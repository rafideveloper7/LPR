const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_URL = configuredApiUrl.replace(/\/$/, '');
