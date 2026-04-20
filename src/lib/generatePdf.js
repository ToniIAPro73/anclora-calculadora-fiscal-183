import { jsPDF } from 'jspdf';
import { format, differenceInCalendarDays, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { reportOwner } from './reportMetadata.js';

const C = {
  blue: [71, 100, 158],
  darkBlue: [46, 72, 122],
  dark: [15, 23, 42],
  gray: [100, 116, 139],
  lightGray: [241, 245, 249],
  green: [22, 163, 74],
  orange: [234, 88, 12],
  red: [220, 38, 38],
  white: [255, 255, 255],
  blueBg: [228, 236, 250],
  gold: [245, 158, 11],
};

function statusInfo(totalDays) {
  if (totalDays > 183) return { color: C.red, bg: [254, 226, 226], text: 'LÍMITE SUPERADO', badge: '⚠ LÍMITE SUPERADO' };
  if (totalDays > 150) return { color: C.orange, bg: [254, 243, 199], text: 'ATENCIÓN', badge: '! ATENCIÓN' };
  return { color: C.green, bg: [220, 252, 231], text: 'SEGURO', badge: '✓ SEGURO' };
}

function normalizeRange(range) {
  const start = range.start instanceof Date ? range.start : new Date(range.start);
  const end = range.end instanceof Date ? range.end : new Date(range.end);
  const days = range.days ?? differenceInCalendarDays(end, start) + 1;
  return { start, end, days };
}

function calculateOverlapDays(range, ranges, index) {
  return eachDayOfInterval({ start: range.start, end: range.end }).reduce((count, day) => {
    const overlaps = ranges.some((otherRange, otherIndex) => {
      if (otherIndex === index) return false;
      return isWithinInterval(day, { start: otherRange.start, end: otherRange.end });
    });

    return overlaps ? count + 1 : count;
  }, 0);
}

function buildDataUrlFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

let brandLogoDataUrlPromise;

function loadBrandLogoDataUrl() {
  if (!brandLogoDataUrlPromise) {
    brandLogoDataUrlPromise = fetch('/logo-calculadora-183-clean-512.png')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load logo asset: ${response.status}`);
        }

        return response.blob();
      })
      .then(buildDataUrlFromBlob);
  }

  return brandLogoDataUrlPromise;
}

function drawPill(doc, x, y, text, fill, textColor, width) {
  doc.setFillColor(...fill);
  doc.setDrawColor(...fill);
  doc.roundedRect(x, y, width, 8, 3, 3, 'F');
  doc.setTextColor(...textColor);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(text, x + width / 2, y + 5.2, { align: 'center' });
}

function drawTableRow(doc, x, y, widths, values, fill, textColor, bold = false) {
  doc.setFillColor(...fill);
  doc.rect(x, y, widths.reduce((sum, value) => sum + value, 0), 7, 'F');
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setFontSize(7.5);
  doc.text(values[0], x + 3, y + 4.6);
  doc.text(values[1], x + widths[0] + 3, y + 4.6);
  doc.text(values[2], x + widths[0] + widths[1] + widths[2] / 2, y + 4.6, { align: 'center' });
}

export async function generateTaxReport({
  name,
  taxId,
  documentType = 'passport',
  totalDays,
  ranges = [],
  language = 'es',
  exampleMode = false,
  brandLogoDataUrl: providedBrandLogoDataUrl,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const brandLogoDataUrl = providedBrandLogoDataUrl ?? await loadBrandLogoDataUrl();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 18;
  const CW = W - 2 * M;

  const status = statusInfo(totalDays);
  const remaining = Math.max(183 - totalDays, 0);
  const pct = Math.min((totalDays / 183) * 100, 100);
  const refNum = `TN-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const genDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
  const sortedRanges = [...ranges].map(normalizeRange).sort((a, b) => a.start.getTime() - b.start.getTime());
  const rawDays = sortedRanges.reduce((sum, range) => sum + range.days, 0);
  const overlapDeduction = Math.max(rawDays - totalDays, 0);
  const overlapSummaryDays = exampleMode ? 5 : overlapDeduction;
  const identifierLabel = documentType === 'nie' ? 'NIE' : 'Pasaporte';
  const fileOwnerLine = `${reportOwner.name} · ${reportOwner.nif} · ${reportOwner.email}`;

  let y = 0;

  doc.setFillColor(...C.blue);
  doc.rect(0, 0, W, 34, 'F');

  doc.addImage(brandLogoDataUrl, 'PNG', M, 6.5, 22, 16.8);
  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TaxNomad', M + 28, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(208, 227, 255);
  doc.text('Calculadora de Residencia Fiscal · Regla de los 183 Días', M + 28, 22);

  if (exampleMode) {
    drawPill(doc, W - M - 34, 8, 'EJEMPLO', C.gold, C.white, 18);
  }

  doc.setFontSize(7.5);
  doc.setTextColor(208, 227, 255);
  doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy')}`, W - M, 15.8, { align: 'right' });
  doc.text(`Ref: ${refNum}`, W - M, 21.8, { align: 'right' });

  y = 44;

  if (exampleMode) {
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(251, 146, 60);
    doc.roundedRect(M, y - 6, CW, 16, 3, 3, 'FD');
    doc.setTextColor(194, 65, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Informe de ejemplo con datos ficticios', M + 4, y + 0.2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.text('Los días solapados se descuentan automáticamente del total único.', M + 4, y + 5.2);
    y += 14;
  }

  doc.setTextColor(...C.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('INFORME DE RESIDENCIA FISCAL', M, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.gray);
  doc.text('Ejercicio Fiscal 2026 · Art. 9 Ley 35/2006 IRPF · Regla de los 183 Días', M, y);
  y += 6;
  doc.setDrawColor(...C.blue);
  doc.setLineWidth(0.5);
  doc.line(M, y, W - M, y);
  y += 9;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text('DATOS DEL CONTRIBUYENTE', M, y);
  y += 5;

  doc.setFillColor(...C.lightGray);
  doc.roundedRect(M, y, CW, 28, 3, 3, 'F');
  y += 8;

  const row = (label, value, x, rowY) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.gray);
    doc.text(label, x + 4, rowY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(value, x + 4 + doc.getTextWidth(label) + 3, rowY);
  };

  row('Nombre:', name, M, y);
  row(`${identifierLabel}:`, taxId, M + CW / 2, y);
  y += 8;
  row('Fecha de generación:', genDate, M, y);
  y += 8;
  row('N.º de referencia:', refNum, M, y);
  y += 12;

  doc.setDrawColor(...C.lightGray);
  doc.setLineWidth(0.3);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text('RESUMEN DE PRESENCIA FÍSICA EN ESPAÑA', M, y);
  y += 6;

  doc.setFillColor(...status.bg);
  doc.roundedRect(M, y, 56, 34, 4, 4, 'F');
  doc.setTextColor(...status.color);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(27);
  doc.text(String(totalDays), M + 28, y + 15.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.gray);
  doc.text('DÍAS EN ESPAÑA', M + 28, y + 23, { align: 'center' });

  const sX = M + 63;
  [
    ['Límite legal (183 días):', '183 días'],
    ['Días restantes:', `${remaining} días`],
    ['Porcentaje utilizado:', `${pct.toFixed(1)}%`],
  ].forEach(([label, val], i) => {
    const sY = y + 6 + i * 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.gray);
    doc.text(label, sX, sY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(val, W - M, sY, { align: 'right' });
  });

  drawPill(doc, sX, y + 24, status.text, status.color, C.white, 34);
  y += 41;

  doc.setFillColor(...C.lightGray);
  doc.roundedRect(M, y, CW, 4, 2, 2, 'F');
  doc.setFillColor(...status.color);
  doc.roundedRect(M, y, (pct / 100) * CW, 4, 2, 2, 'F');
  y += 11;

  doc.setDrawColor(...C.lightGray);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text('DETALLE DE PERÍODOS EN ESPAÑA', M, y);
  y += 5;

  const colW = [CW * 0.38, CW * 0.38, CW * 0.24];
  const colX = [M, M + colW[0], M + colW[0] + colW[1]];

  doc.setFillColor(...C.blue);
  doc.rect(M, y, CW, 7, 'F');
  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Fecha de inicio', colX[0] + 3, y + 4.5);
  doc.text('Fecha de fin', colX[1] + 3, y + 4.5);
  doc.text('Días', colX[2] + colW[2] / 2, y + 4.5, { align: 'center' });
  y += 7;

  if (sortedRanges.length === 0) {
    doc.setFillColor(...C.white);
    doc.rect(M, y, CW, 8, 'F');
    doc.setTextColor(...C.gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Sin períodos registrados.', M + 3, y + 5);
    y += 8;
  } else {
    sortedRanges.forEach((range, i) => {
      const fill = i % 2 === 0 ? C.white : C.lightGray;
      drawTableRow(
        doc,
        M,
        y,
        colW,
        [
          format(range.start, 'dd/MM/yyyy'),
          format(range.end, 'dd/MM/yyyy'),
          String(range.days),
        ],
        fill,
        C.dark,
        false,
      );

      const overlapDays = calculateOverlapDays(range, sortedRanges, i);
      if (overlapDays > 0) {
        doc.setFillColor(255, 251, 235);
        doc.setDrawColor(245, 158, 11);
        doc.roundedRect(M + CW - 30, y + 1.1, 27, 4.8, 1.5, 1.5, 'FD');
        doc.setTextColor(146, 64, 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.2);
        doc.text(`${overlapDays} d. solap.`, M + CW - 16.5, y + 4.35, { align: 'center' });
      }

      y += 7;
    });
  }

  doc.setFillColor(...C.blueBg);
  doc.rect(M, y, CW, 7, 'F');
  doc.setTextColor(...C.blue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TOTAL DÍAS ÚNICOS EN ESPAÑA', colX[0] + 3, y + 4.5);
  doc.text(String(totalDays), colX[2] + colW[2] / 2, y + 4.5, { align: 'center' });
  y += 12;

  if (overlapSummaryDays > 0) {
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(251, 146, 60);
    doc.roundedRect(M, y - 1.5, CW, 12, 3, 3, 'FD');
    doc.setTextColor(154, 52, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.text('Tratamiento de solapes', M + 4, y + 2.8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.text(
      `Se han descartado ${overlapSummaryDays} día(s) duplicado(s) para obtener el total único de ${totalDays} días en España.`,
      M + 4,
      y + 7.1,
    );
    y += 16;
  }

  doc.setDrawColor(...C.lightGray);
  doc.line(M, y, W - M, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text('CONCLUSIÓN', M, y);
  y += 5;

  const conclusion = totalDays > 183
    ? `A la fecha de generación del presente informe, ${name} ha permanecido ${totalDays} días en territorio español durante el ejercicio fiscal 2026, SUPERANDO el límite de 183 días establecido por el artículo 9 de la Ley 35/2006 del IRPF. Esta circunstancia podría determinar la residencia fiscal habitual en España. Se recomienda consultar urgentemente con un asesor fiscal.`
    : `A la fecha de generación del presente informe, ${name} ha permanecido ${totalDays} días en territorio español durante el ejercicio fiscal 2026, lo que representa el ${pct.toFixed(1)}% del límite de 183 días establecido por el artículo 9 de la Ley 35/2006 del IRPF. Con la información facilitada y descontando los solapes entre períodos, no se supera el umbral de permanencia exigido para la residencia fiscal habitual en España por el criterio de los 183 días.`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C.dark);
  const cLines = doc.splitTextToSize(conclusion, CW);
  doc.text(cLines, M, y);
  y += cLines.length * 4.5 + 6;

  doc.setFillColor(...C.lightGray);
  doc.roundedRect(M, y, CW, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);
  doc.text('AVISO LEGAL', M + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  const disc = 'Este documento es un resumen de datos generado automáticamente por TaxNomad y no constituye asesoramiento legal ni fiscal oficial. Se recomienda validar este informe con un asesor fiscal colegiado antes de realizar cualquier trámite administrativo o declaración tributaria.';
  const dLines = doc.splitTextToSize(disc, CW - 8);
  doc.text(dLines, M + 4, y + 10);
  y += 26;

  doc.setDrawColor(...C.lightGray);
  doc.line(M, H - 16, W - M, H - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(...C.gray);
  doc.text('TaxNomad · Calculadora de Residencia Fiscal · regla183.com', M, H - 11);
  doc.text(fileOwnerLine, M, H - 7.2);
  doc.text(refNum, W - M, H - 11, { align: 'right' });

  return doc;
}
