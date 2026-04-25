import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { reportOwner } from './reportMetadata.js';
import { calculateFiscalSummary } from './fiscalSummary.js';
import logoSource from '@/assets/logo.png';

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

function statusInfo(totalDays, copy) {
  if (totalDays > 183) return { color: C.red, bg: [254, 226, 226], text: copy.status.over };
  if (totalDays > 150) return { color: C.orange, bg: [254, 243, 199], text: copy.status.warning };
  return { color: C.green, bg: [220, 252, 231], text: copy.status.safe };
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
    brandLogoDataUrlPromise = fetch(logoSource)
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

function estimateBlockHeight(lineCount, lineHeight, extra = 0) {
  return lineCount * lineHeight + extra;
}

function drawFooter(doc, pageWidth, pageHeight, margin, fileOwnerLine, refNum, copy) {
  doc.setDrawColor(...C.lightGray);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(...C.gray);
  doc.text(copy.footer, margin, pageHeight - 11);
  doc.text(fileOwnerLine, margin, pageHeight - 7.2);
  doc.text(refNum, pageWidth - margin, pageHeight - 11, { align: 'right' });
}

function addReportPage(doc, pageWidth, pageHeight, margin, fileOwnerLine, refNum, copy) {
  drawFooter(doc, pageWidth, pageHeight, margin, fileOwnerLine, refNum, copy);
  doc.addPage();
  return 24;
}

function getPdfCopy(language) {
  if (language === 'en') {
    return {
      locale: enUS,
      dateFormat: 'MMMM d, yyyy',
      shortDateFormat: 'MM/dd/yyyy',
      appSubtitle: 'Fiscal Residency Calculator · 183-Day Rule',
      generated: 'Generated',
      ref: 'Ref',
      exampleBadge: 'EXAMPLE',
      exampleTitle: 'Example report with fictional data',
      exampleDescription: 'Overlapping days are automatically deducted from the unique total.',
      title: 'FISCAL RESIDENCY REPORT',
      fiscalSubtitle: (year) => `Fiscal Year ${year} · Art. 9 Spanish Personal Income Tax Law 35/2006 · 183-Day Rule`,
      taxpayerSection: 'TAXPAYER DETAILS',
      nameLabel: 'Name:',
      passportLabel: 'Passport:',
      nieLabel: 'NIE:',
      generationDateLabel: 'Generation date:',
      referenceLabel: 'Reference no.:',
      summarySection: 'PHYSICAL PRESENCE SUMMARY IN SPAIN',
      daysInSpain: 'DAYS IN SPAIN',
      legalLimit: 'Legal limit (183 days):',
      legalLimitValue: '183 days',
      remainingDays: 'Remaining days:',
      percentageUsed: 'Percentage used:',
      periodsSection: 'DETAIL OF PERIODS IN SPAIN',
      startDate: 'Start date',
      endDate: 'End date',
      days: 'Days',
      noPeriods: 'No periods recorded.',
      overlapShort: (days) => `${days} overlapping d.`,
      totalUniqueDays: 'TOTAL UNIQUE DAYS IN SPAIN',
      overlapTitle: 'Overlap handling',
      overlapDescription: (overlapDays, totalDays) =>
        `${overlapDays} duplicated day(s) have been discarded to obtain the unique total of ${totalDays} days in Spain.`,
      conclusionHeading: 'CONCLUSION',
      conclusion: ({ name, verifiedTotalDays, fiscalYear, pct }) => verifiedTotalDays > 183
        ? `As of the current date, ${name} has recorded a total of ${verifiedTotalDays} days of physical presence in Spanish territory during the ${fiscalYear} fiscal year. This duration accounts for ${pct.toFixed(1)}% of the 183-day statutory limit prescribed by Article 9 of the Spanish Personal Income Tax Act (Law 35/2006). Following the consolidation of overlapping periods, it is confirmed that the subject EXCEEDS the threshold for tax residency under the physical presence test. Urgent consultation with a qualified tax advisor is recommended.`
        : `As of the current date, ${name} has recorded a total of ${verifiedTotalDays} days of physical presence in Spanish territory during the ${fiscalYear} fiscal year. This duration accounts for ${pct.toFixed(1)}% of the 183-day statutory limit prescribed by Article 9 of the Spanish Personal Income Tax Act (Law 35/2006). Following the consolidation of overlapping periods, it is confirmed that the subject does not exceed the threshold for tax residency under the physical presence test.`,
      legalNoticeHeading: 'LEGAL NOTICE',
      legalNotice: 'This document is an automatically generated data summary by TaxNomad and does not constitute official legal or tax advice. Validate this report with a qualified tax advisor before any administrative procedure or tax filing.',
      footer: 'TaxNomad · Fiscal Residency Calculator · regla183.com',
      status: {
        over: 'LIMIT EXCEEDED',
        warning: 'ATTENTION',
        safe: 'SAFE',
      },
    };
  }

  return {
    locale: es,
    dateFormat: "dd 'de' MMMM 'de' yyyy",
    shortDateFormat: 'dd/MM/yyyy',
    appSubtitle: 'Calculadora de Residencia Fiscal · Regla de los 183 Días',
    generated: 'Generado',
    ref: 'Ref',
    exampleBadge: 'EJEMPLO',
    exampleTitle: 'Informe de ejemplo con datos ficticios',
    exampleDescription: 'Los días solapados se descuentan automáticamente del total único.',
    title: 'INFORME DE RESIDENCIA FISCAL',
    fiscalSubtitle: (year) => `Ejercicio Fiscal ${year} · Art. 9 Ley 35/2006 IRPF · Regla de los 183 Días`,
    taxpayerSection: 'DATOS DEL CONTRIBUYENTE',
    nameLabel: 'Nombre:',
    passportLabel: 'Pasaporte:',
    nieLabel: 'NIE:',
    generationDateLabel: 'Fecha de generación:',
    referenceLabel: 'N.º de referencia:',
    summarySection: 'RESUMEN DE PRESENCIA FÍSICA EN ESPAÑA',
    daysInSpain: 'DÍAS EN ESPAÑA',
    legalLimit: 'Límite legal (183 días):',
    legalLimitValue: '183 días',
    remainingDays: 'Días restantes:',
    percentageUsed: 'Porcentaje utilizado:',
    periodsSection: 'DETALLE DE PERÍODOS EN ESPAÑA',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha de fin',
    days: 'Días',
    noPeriods: 'Sin períodos registrados.',
    overlapShort: (days) => `${days} d. solap.`,
    totalUniqueDays: 'TOTAL DÍAS ÚNICOS EN ESPAÑA',
    overlapTitle: 'Tratamiento de solapes',
    overlapDescription: (overlapDays, totalDays) =>
      `Se han descartado ${overlapDays} día(s) duplicado(s) para obtener el total único de ${totalDays} días en España.`,
    conclusionHeading: 'CONCLUSIÓN',
    conclusion: ({ name, verifiedTotalDays, fiscalYear, pct }) => verifiedTotalDays > 183
      ? `A la fecha actual, ${name} ha registrado un total de ${verifiedTotalDays} días de presencia física en territorio español durante el ejercicio fiscal ${fiscalYear}. Esta duración representa el ${pct.toFixed(1)}% del límite estatutario de 183 días establecido por el artículo 9 de la Ley 35/2006 del Impuesto sobre la Renta de las Personas Físicas. Tras la consolidación de los períodos solapados, se confirma que el sujeto SUPERA el umbral para la residencia fiscal conforme al criterio de presencia física. Se recomienda consultar urgentemente con un asesor fiscal cualificado.`
      : `A la fecha actual, ${name} ha registrado un total de ${verifiedTotalDays} días de presencia física en territorio español durante el ejercicio fiscal ${fiscalYear}. Esta duración representa el ${pct.toFixed(1)}% del límite estatutario de 183 días establecido por el artículo 9 de la Ley 35/2006 del Impuesto sobre la Renta de las Personas Físicas. Tras la consolidación de los períodos solapados, se confirma que el sujeto no supera el umbral para la residencia fiscal conforme al criterio de presencia física.`,
    legalNoticeHeading: 'AVISO LEGAL',
    legalNotice: 'Este documento es un resumen de datos generado automáticamente por TaxNomad y no constituye asesoramiento legal ni fiscal oficial. Se recomienda validar este informe con un asesor fiscal colegiado antes de realizar cualquier trámite administrativo o declaración tributaria.',
    footer: 'TaxNomad · Calculadora de Residencia Fiscal · regla183.com',
    status: {
      over: 'LÍMITE SUPERADO',
      warning: 'ATENCIÓN',
      safe: 'SEGURO',
    },
  };
}

export async function generateTaxReport({
  name,
  taxId,
  documentType = 'passport',
  totalDays,
  ranges = [],
  fiscalYear = new Date().getFullYear(),
  language = 'es',
  exampleMode = false,
  brandLogoDataUrl: providedBrandLogoDataUrl,
}) {
  const copy = getPdfCopy(language);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const brandLogoDataUrl = providedBrandLogoDataUrl ?? await loadBrandLogoDataUrl();
  const summary = calculateFiscalSummary(ranges);
  const verifiedTotalDays = summary.totalDays;
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 18;
  const CW = W - 2 * M;

  const status = statusInfo(verifiedTotalDays, copy);
  const remaining = Math.max(183 - verifiedTotalDays, 0);
  const pct = Math.min((verifiedTotalDays / 183) * 100, 100);
  const refNum = `TN-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const genDate = format(new Date(), copy.dateFormat, { locale: copy.locale });
  const sortedRanges = [...summary.annotatedRanges].sort((a, b) => a.start.getTime() - b.start.getTime());
  const rawDays = sortedRanges.reduce((sum, range) => sum + range.days, 0);
  const overlapDeduction = Math.max(rawDays - verifiedTotalDays, 0);
  const overlapSummaryDays = exampleMode ? 5 : overlapDeduction;
  const identifierLabel = documentType === 'nie' ? copy.nieLabel.replace(':', '') : copy.passportLabel.replace(':', '');
  const contactLabel = language === 'en' ? 'Contact' : 'Contacto';
  const fileOwnerLine = `${contactLabel}: ${reportOwner.email}`;
  const headerHeight = exampleMode ? 30 : 34;
  const footerReserveY = H - 42;
  const tableFooterReserveY = H - 28;

  let y = 0;

  doc.setFillColor(...C.blue);
  doc.rect(0, 0, W, headerHeight, 'F');

  const logoY = exampleMode ? 4.8 : 6.5;
  const logoW = exampleMode ? 24 : 22;
  const logoH = exampleMode ? 18.4 : 16.8;
  try {
    doc.addImage(brandLogoDataUrl, 'WEBP', M, logoY, logoW, logoH);
  } catch (error) {
    console.warn('PDF logo rendering skipped:', error.message);
  }
  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TaxNomad', M + 28, exampleMode ? 14.6 : 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(208, 227, 255);
  doc.text(copy.appSubtitle, M + 28, exampleMode ? 19.8 : 22);

  if (exampleMode) {
    drawPill(doc, (W - 22) / 2, 3.8, copy.exampleBadge, C.gold, C.white, 22);
  }

  doc.setFontSize(7.5);
  doc.setTextColor(208, 227, 255);
  doc.text(`${copy.generated}: ${format(new Date(), copy.shortDateFormat)}`, W - M, exampleMode ? 15 : 15.8, { align: 'right' });
  doc.text(`${copy.ref}: ${refNum}`, W - M, exampleMode ? 20.4 : 21.8, { align: 'right' });

  y = headerHeight + 10;

  if (exampleMode) {
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(251, 146, 60);
    doc.roundedRect(M, y - 4, CW, 14, 3, 3, 'FD');
    doc.setTextColor(194, 65, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(copy.exampleTitle, M + 4, y + 0.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.text(copy.exampleDescription, M + 4, y + 5.6);
    y += 18;
  }

  doc.setTextColor(...C.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(copy.title, M, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.gray);
  doc.text(copy.fiscalSubtitle(fiscalYear), M, y);
  y += 6;
  doc.setDrawColor(...C.blue);
  doc.setLineWidth(0.5);
  doc.line(M, y, W - M, y);
  y += 9;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text(copy.taxpayerSection, M, y);
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

  row(copy.nameLabel, name, M, y);
  row(`${identifierLabel}:`, taxId, M + CW / 2, y);
  y += 8;
  row(copy.generationDateLabel, genDate, M, y);
  y += 8;
  row(copy.referenceLabel, refNum, M, y);
  y += 12;

  doc.setDrawColor(...C.lightGray);
  doc.setLineWidth(0.3);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text(copy.summarySection, M, y);
  y += 6;

  doc.setFillColor(...status.bg);
  doc.roundedRect(M, y, 56, 34, 4, 4, 'F');
  doc.setTextColor(...status.color);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(27);
  doc.text(String(verifiedTotalDays), M + 28, y + 15.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.gray);
  doc.text(copy.daysInSpain, M + 28, y + 23, { align: 'center' });

  const sX = M + 63;
  [
    [copy.legalLimit, copy.legalLimitValue],
    [copy.remainingDays, `${remaining} ${copy.days.toLowerCase()}`],
    [copy.percentageUsed, `${pct.toFixed(1)}%`],
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
  doc.text(copy.periodsSection, M, y);
  y += 5;

  const colW = [CW * 0.38, CW * 0.38, CW * 0.24];
  const colX = [M, M + colW[0], M + colW[0] + colW[1]];

  doc.setFillColor(...C.blue);
  doc.rect(M, y, CW, 7, 'F');
  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(copy.startDate, colX[0] + 3, y + 4.5);
  doc.text(copy.endDate, colX[1] + 3, y + 4.5);
  doc.text(copy.days, colX[2] + colW[2] / 2, y + 4.5, { align: 'center' });
  y += 7;

  if (sortedRanges.length === 0) {
    doc.setFillColor(...C.white);
    doc.rect(M, y, CW, 8, 'F');
    doc.setTextColor(...C.gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(copy.noPeriods, M + 3, y + 5);
    y += 8;
  } else {
    sortedRanges.forEach((range, i) => {
      if (y + 7 > tableFooterReserveY) {
        y = addReportPage(doc, W, H, M, fileOwnerLine, refNum, copy);
        doc.setFillColor(...C.blue);
        doc.rect(M, y, CW, 7, 'F');
        doc.setTextColor(...C.white);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(copy.startDate, colX[0] + 3, y + 4.5);
        doc.text(copy.endDate, colX[1] + 3, y + 4.5);
        doc.text(copy.days, colX[2] + colW[2] / 2, y + 4.5, { align: 'center' });
        y += 7;
      }

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

      const overlapDays = range.overlapDays;
      if (overlapDays > 0) {
        doc.setFillColor(255, 251, 235);
        doc.setDrawColor(245, 158, 11);
        doc.roundedRect(M + CW - 30, y + 1.1, 27, 4.8, 1.5, 1.5, 'FD');
        doc.setTextColor(146, 64, 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.2);
        doc.text(copy.overlapShort(overlapDays), M + CW - 16.5, y + 4.35, { align: 'center' });
      }

      y += 7;
    });
  }

  doc.setFillColor(...C.blueBg);
  doc.rect(M, y, CW, 7, 'F');
  doc.setTextColor(...C.blue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(copy.totalUniqueDays, colX[0] + 3, y + 4.5);
  doc.text(String(verifiedTotalDays), colX[2] + colW[2] / 2, y + 4.5, { align: 'center' });
  y += 12;

  if (overlapSummaryDays > 0) {
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(251, 146, 60);
    doc.roundedRect(M, y - 1.5, CW, 12, 3, 3, 'FD');
    doc.setTextColor(154, 52, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.text(copy.overlapTitle, M + 4, y + 2.8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.text(
      copy.overlapDescription(overlapSummaryDays, verifiedTotalDays),
      M + 4,
      y + 7.1,
    );
    y += 16;
  }

  const conclusion = copy.conclusion({ name, verifiedTotalDays, fiscalYear, pct });

  const cLines = doc.splitTextToSize(conclusion, CW);
  const legalBlockHeight = 26;
  const conclusionHeadingHeight = 12;
  const conclusionHeight = estimateBlockHeight(cLines.length, 4.2, 6);

  if (y + conclusionHeadingHeight + conclusionHeight + legalBlockHeight > footerReserveY) {
    y = addReportPage(doc, W, H, M, fileOwnerLine, refNum, copy);
  }

  doc.setDrawColor(...C.lightGray);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text(copy.conclusionHeading, M, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.7);
  doc.setTextColor(...C.dark);
  doc.text(cLines, M, y);
  y += cLines.length * 4.2 + 6;

  doc.setFillColor(...C.lightGray);
  doc.roundedRect(M, y, CW, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);
  doc.text(copy.legalNoticeHeading, M + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  const disc = copy.legalNotice;
  const dLines = doc.splitTextToSize(disc, CW - 8);
  doc.text(dLines, M + 4, y + 10);
  y += 26;

  drawFooter(doc, W, H, M, fileOwnerLine, refNum, copy);

  return doc;
}
