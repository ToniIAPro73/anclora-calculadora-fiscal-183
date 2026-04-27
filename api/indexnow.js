// Llama a este endpoint tras cada deploy para notificar a Bing/IndexNow
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return res.status(500).json({ error: 'INDEXNOW_KEY not configured' });
  }

  const host = 'regla183.com';
  const urls = [
    `https://${host}/es/`,
    `https://${host}/en/`,
    `https://${host}/es/privacy/`,
    `https://${host}/en/privacy/`,
    `https://${host}/es/terms/`,
    `https://${host}/en/terms/`,
    `https://${host}/es/legal-notice/`,
    `https://${host}/en/legal-notice/`,
    `https://${host}/es/cookies/`,
    `https://${host}/en/cookies/`,
  ];

  const body = JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  });

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
      timeout: 10000,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`IndexNow API error: ${response.status}`, errorText);
      return res.status(response.status).json({
        error: `IndexNow API returned ${response.status}`,
        details: errorText,
      });
    }

    return res.status(200).json({
      success: true,
      status: response.status,
      urls: urls.length,
    });
  } catch (error) {
    console.error('IndexNow request failed:', error.message);
    return res.status(503).json({
      error: 'Failed to notify IndexNow',
      message: error.message,
    });
  }
}
