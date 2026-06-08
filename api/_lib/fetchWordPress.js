const WORDPRESS_ORIGIN = (
  process.env.VITE_WORDPRESS_URL || 'https://sassystrides.com'
).replace(/\/$/, '');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWordPress = async (path, { maxRetries = 3 } = {}) => {
  const url = path.startsWith('http') ? path : `${WORDPRESS_ORIGIN}${path}`;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (response.status === 429 && attempt < maxRetries) {
      const delay = Math.min(1000 * 2 ** attempt, 8000);
      await sleep(delay);
      continue;
    }

    return response;
  }

  throw new Error(`WordPress request exhausted retries for ${url}`);
};

export { WORDPRESS_ORIGIN };
