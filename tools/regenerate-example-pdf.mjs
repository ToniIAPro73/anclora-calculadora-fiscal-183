import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildExampleReportPayload } from '../src/lib/reportMetadata.js';
import { generateTaxReport } from '../src/lib/generatePdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'ejemplo.pdf');

const example = buildExampleReportPayload();

const doc = await generateTaxReport({
  ...example,
  language: 'es',
  exampleMode: true,
});

const pdfBytes = doc.output('arraybuffer');
await writeFile(outputPath, Buffer.from(pdfBytes));
