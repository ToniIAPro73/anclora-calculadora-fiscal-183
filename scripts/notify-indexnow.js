/* global process */
// Se ejecuta automáticamente tras cada build
const key = process.env.INDEXNOW_KEY;
if (!key) process.exit(0);

fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    host: 'regla183.com',
    key,
    keyLocation: `https://regla183.com/${key}.txt`,
    urlList: [
      'https://regla183.com/es/',
      'https://regla183.com/en/',
    ],
  }),
})
.then(r => console.log('IndexNow notified:', r.status))
.catch(e => console.error('IndexNow error:', e));