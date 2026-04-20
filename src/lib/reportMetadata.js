export const reportOwner = {
  name: 'Antonio Ballesteros Alonso',
  address: 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)',
  nif: '08997554T',
  email: 'hola@regla183.com',
};

export const buildExampleReportPayload = () => ({
  name: 'Alex Rivera',
  documentType: 'passport',
  taxId: 'X1234567Z',
  totalDays: 54,
  ranges: [
    { start: new Date('2026-01-05'), end: new Date('2026-01-20'), days: 16 },
    { start: new Date('2026-01-18'), end: new Date('2026-01-28'), days: 11 },
    { start: new Date('2026-03-02'), end: new Date('2026-03-18'), days: 17 },
    { start: new Date('2026-08-11'), end: new Date('2026-08-23'), days: 13 },
  ],
  exampleMode: true,
});
