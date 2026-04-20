import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const C = {
  blue:      [37, 99, 235],
  darkBlue:  [30, 58, 138],
  dark:      [15, 23, 42],
  gray:      [100, 116, 139],
  lightGray: [241, 245, 249],
  green:     [22, 163, 74],
  orange:    [234, 88, 12],
  red:       [220, 38, 38],
  white:     [255, 255, 255],
  blueBg:    [219, 234, 254],
};

function statusInfo(totalDays) {
  if (totalDays > 183) return { color: C.red,    bg: [254, 226, 226], text: 'LÍMITE SUPERADO', badge: '⚠ LÍMITE SUPERADO' };
  if (totalDays > 150) return { color: C.orange,  bg: [254, 243, 199], text: 'ATENCIÓN',        badge: '! ATENCIÓN' };
  return                       { color: C.green,   bg: [220, 252, 231], text: 'SEGURO',          badge: '✓ SEGURO' };
}

export function generateTaxReport({ name, taxId, totalDays, ranges = [], language = 'es' }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 20;
  const CW = W - 2 * M;
  const status = statusInfo(totalDays);
  const remaining = Math.max(183 - totalDays, 0);
  const pct = Math.min((totalDays / 183) * 100, 100);
  const refNum = `TN-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const genDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

  let y = 0;

  // ── HEADER BAR ────────────────────────────────────────────────
  doc.setFillColor(...C.blue);
  doc.rect(0, 0, W, 32, 'F');

  // Logo badge "183"
  doc.setFillColor(...C.darkBlue);
  doc.roundedRect(M, 6, 20, 20, 3, 3, 'F');
  doc.setTextColor(...C.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('183', M + 10, 18.5, { align: 'center' });

  // Product name
  doc.setFontSize(16);
  doc.text('TaxNomad', M + 25, 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 220, 255);
  doc.text('Calculadora de Residencia Fiscal · Regla de los 183 Días', M + 25, 22);

  // Gen date top-right
  doc.setFontSize(7.5);
  doc.setTextColor(200, 220, 255);
  doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy')}`, W - M, 16, { align: 'right' });
  doc.text(`Ref: ${refNum}`, W - M, 22, { align: 'right' });

  y = 42;

  // ── TITLE ─────────────────────────────────────────────────────
  doc.setTextColor(...C.dark);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE RESIDENCIA FISCAL', M, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.gray);
  doc.text('Ejercicio Fiscal 2026 · Art. 9 Ley 35/2006 IRPF · Regla de los 183 Días', M, y);
  y += 6;
  doc.setDrawColor(...C.blue);
  doc.setLineWidth(0.5);
  doc.line(M, y, W - M, y);
  y += 9;

  // ── DATOS DEL CONTRIBUYENTE ───────────────────────────────────
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.blue);
  doc.text('DATOS DEL CONTRIBUYENTE', M, y);
  y += 5;

  doc.setFillColor(...C.lightGray);
  doc.roundedRect(M, y, CW, 26, 2, 2, 'F');
  y += 7;

  const row = (label, value, x, rowY) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.gray);
    doc.text(label, x + 4, rowY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(value, x + 4 + doc.getTextWidth(label) + 4, rowY);
  };

  row('Nombre:', name, M, y);
  row('DNI / Pasaporte:', taxId, M + CW / 2, y);
  y += 8;
  row('Fecha de generación:', genDate, M, y);
  y += 8;
  row('N.º de referencia:', refNum, M, y);
  y += 11;

  // ── RESUMEN ───────────────────────────────────────────────────
  doc.setDrawColor(...C.lightGray);
  doc.setLineWidth(0.3);
  doc.line(M, y, W - M, y);
  y += 7;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.blue);
  doc.text('RESUMEN DE PRESENCIA FÍSICA EN ESPAÑA', M, y);
  y += 6;

  // Big days box
  doc.setFillColor(...status.bg);
  doc.roundedRect(M, y, 55, 33, 3, 3, 'F');
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...status.color);
  doc.text(String(totalDays), M + 27.5, y + 15, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.gray);
  doc.text('DÍAS EN ESPAÑA', M + 27.5, y + 23, { align: 'center' });

  // Stats
  const sX = M + 63;
  [
    ['Límite legal (183 días):', '183 días'],
    ['Días restantes:', `${remaining} días`],
    ['Porcentaje utilizado:', `${pct.toFixed(1)}%`],
  ].forEach(([label, val], i) => {
    const sY = y + 6 + i * 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.gray);
    doc.text(label, sX, sY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(val, W - M, sY, { align: 'right' });
  });

  // Status badge
  doc.setFillColor(...status.color);
  doc.roundedRect(sX, y + 22, W - M - sX, 9, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  doc.text(status.badge, sX + (W - M - sX) / 2, y + 28, { align: 'center' });

  y += 38;

  // Progress bar
  doc.setFillColor(...C.lightGray);
  doc.roundedRect(M, y, CW, 3.5, 1.75, 1.75, 'F');
  const pw = (pct / 100) * CW;
  doc.setFillColor(...status.color);
  doc.roundedRect(M, y, pw, 3.5, 1.75, 1.75, 'F');
  y += 10;

  // ── DETALLE DE PERÍODOS ───────────────────────────────────────
  doc.line(M, y, W - M, y);
  y += 7;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.blue);
  doc.text('DETALLE DE PERÍODOS EN ESPAÑA', M, y);
  y += 5;

  // Table header
  const colW = [CW * 0.38, CW * 0.38, CW * 0.24];
  const colX = [M, M + colW[0], M + colW[0] + colW[1]];

  doc.setFillColor(...C.blue);
  doc.rect(M, y, CW, 7, 'F');
  doc.setTextColor(...C.white);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de inicio', colX[0] + 3, y + 4.5);
  doc.text('Fecha de fin', colX[1] + 3, y + 4.5);
  doc.text('Días', colX[2] + colW[2] / 2, y + 4.5, { align: 'center' });
  y += 7;

  const sortedRanges = [...ranges].sort((a, b) => new Date(a.start) - new Date(b.start));

  sortedRanges.forEach((range, i) => {
    doc.setFillColor(...(i % 2 === 0 ? C.white : C.lightGray));
    doc.rect(M, y, CW, 6, 'F');
    doc.setTextColor(...C.dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const s = new Date(range.start);
    const e = new Date(range.end);
    doc.text(format(s, 'dd/MM/yyyy'), colX[0] + 3, y + 4);
    doc.text(format(e, 'dd/MM/yyyy'), colX[1] + 3, y + 4);
    doc.text(String(range.days), colX[2] + colW[2] / 2, y + 4, { align: 'center' });
    y += 6;
  });

  // Total row
  doc.setFillColor(...C.blueBg);
  doc.rect(M, y, CW, 7, 'F');
  doc.setTextColor(...C.blue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TOTAL DÍAS ÚNICOS EN ESPAÑA', colX[0] + 3, y + 4.5);
  doc.text(String(totalDays), colX[2] + colW[2] / 2, y + 4.5, { align: 'center' });
  y += 12;

  // ── CONCLUSIÓN ────────────────────────────────────────────────
  doc.line(M, y, W - M, y);
  y += 7;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.blue);
  doc.text('CONCLUSIÓN', M, y);
  y += 5;

  const conclusion = totalDays > 183
    ? `A la fecha de generación del presente informe, ${name} ha permanecido ${totalDays} días en territorio español durante el ejercicio fiscal 2026, SUPERANDO el límite de 183 días establecido por el artículo 9 de la Ley 35/2006 del IRPF. Esta circunstancia podría determinar la residencia fiscal habitual en España. Se recomienda consultar urgentemente con un asesor fiscal.`
    : `A la fecha de generación del presente informe, ${name} ha permanecido ${totalDays} días en territorio español durante el ejercicio fiscal 2026, lo que representa el ${pct.toFixed(1)}% del límite de 183 días establecido por el artículo 9 de la Ley 35/2006 del IRPF. En consecuencia, no se cumple el criterio de permanencia para la residencia fiscal habitual en España por el criterio de los 183 días.`;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.dark);
  const cLines = doc.splitTextToSize(conclusion, CW);
  doc.text(cLines, M, y);
  y += cLines.length * 4.5 + 6;

  // ── AVISO LEGAL ───────────────────────────────────────────────
  doc.setFillColor(...C.lightGray);
  doc.roundedRect(M, y, CW, 18, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.gray);
  doc.text('AVISO LEGAL', M + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  const disc = 'Este documento es un resumen de datos generado automáticamente por TaxNomad y no constituye asesoramiento legal ni fiscal oficial. Se recomienda validar este informe con un asesor fiscal colegiado antes de realizar cualquier trámite administrativo o declaración tributaria.';
  const dLines = doc.splitTextToSize(disc, CW - 8);
  doc.text(dLines, M + 4, y + 10);
  y += 22;

  // ── FOOTER ────────────────────────────────────────────────────
  doc.setDrawColor(...C.lightGray);
  doc.line(M, H - 14, W - M, H - 14);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.gray);
  doc.text('TaxNomad · Calculadora de Residencia Fiscal · taxnomad.app', M, H - 9);
  doc.text(refNum, W - M, H - 9, { align: 'right' });

  return doc;
}
