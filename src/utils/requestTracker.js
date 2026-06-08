const counts = new Map();
let currentPage = 'bootstrap';

export const setRequestPage = (page) => {
  currentPage = page;
};

export const trackRequest = (label, url) => {
  const key = `${currentPage}::${label}`;
  counts.set(key, (counts.get(key) || 0) + 1);

  console.log('[api-request]', {
    page: currentPage,
    label,
    url,
    count: counts.get(key),
  });
};

export const logRequestSummary = (page = currentPage) => {
  const pageCounts = [...counts.entries()]
    .filter(([key]) => key.startsWith(`${page}::`))
    .map(([key, count]) => ({
      label: key.replace(`${page}::`, ''),
      count,
    }));

  const total = pageCounts.reduce((sum, entry) => sum + entry.count, 0);

  console.log('[api-request-summary]', {
    page,
    total,
    requests: pageCounts,
  });

  return { page, total, requests: pageCounts };
};

export const resetRequestTracker = (page) => {
  if (page) {
    [...counts.keys()]
      .filter((key) => key.startsWith(`${page}::`))
      .forEach((key) => counts.delete(key));
    return;
  }

  counts.clear();
};
