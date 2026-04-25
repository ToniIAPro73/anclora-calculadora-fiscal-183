// Llama a este endpoint tras cada deploy para notificar a Bing/IndexNow
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.INDEXNOW_KEY;
  const host = 'regla183.com';

  const urls = [
    `https://${host}/es/`,
    `https://${host}/en/`,
    `https://${host}/es/privacy/`,
    `https://${host}/en/privacy/`,
    `https://${host}/es/terms/`,
    `https://${host}/en/terms/`,
  ];

  const body = JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  });

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });

  return res.status(200).json({
    indexnow: response.status,
    urls: urls.length,
  });
}