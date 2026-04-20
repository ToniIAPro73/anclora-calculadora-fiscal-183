import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildExampleReportPayload } from '../src/lib/reportMetadata.js';
import { generateTaxReport } from '../src/lib/generatePdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const logoPath = path.join(repoRoot, 'public', 'logo-calculadora-183-clean-512.png');
const outputPath = path.join(repoRoot, 'ejemplo.pdf');

const logoBase64 = await readFile(logoPath, 'base64');
const brandLogoDataUrl = `data:image/png;base64,${logoBase64}`;
const example = buildExampleReportPayload();

const doc = await generateTaxReport({
  ...example,
  language: 'es',
  exampleMode: true,
  brandLogoDataUrl,
});

const pdfBytes = doc.output('arraybuffer');
await writeFile(outputPath, Buffer.from(pdfBytes));
