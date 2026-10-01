/**
 * Centralized API Client Helper for UrbanEats Frontend
 * Connects React + Vite to PHP Backend (supporting both Localhost & InfinityFree hosting)
 * Enforces PHP Server-Side Session Authentication via HTTP-only Cookies (`credentials: 'include'`).
 */

const getApiBaseUrl = () => {
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/urbaneats-api/api';
  if (typeof window !== 'undefined' && rawBaseUrl.startsWith('/')) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
      return `http://${host}${rawBaseUrl}`;
    }
  }
  return rawBaseUrl;
};

const BASE_URL = getApiBaseUrl();

/**
 * Safely parse JSON from raw response text, stripping out any InfinityFree HTML/statcounter injections.
 * @param {string} rawText
 * @returns {any}
 */
export function parseCleanJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { status: 'error', message: 'Empty response from server.' };
  }

  const trimmed = rawText.trim();

  // Fast path: standard pure JSON
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    // If InfinityFree or hosting provider injected a tracking script or HTML at the end:
    const jsonMatch = trimmed.match(/^(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        const scriptIdx = trimmed.indexOf('<script');
        if (scriptIdx > 0) {
          const sub = trimmed.slice(0, scriptIdx).trim();
          try {
            return JSON.parse(sub);
          } catch (e3) {}
        }
      }
    }

    // Pure HTML error page (e.g. 404/500/Security challenge)
    let cleanMsg = 'Server returned an invalid response. The service may be starting up or under maintenance.';
    const titleMatch = trimmed.match(/<title[^>]*>([^<]+)<\/title>/i);
    const bodyMatch = trimmed.match(/<p[^>]*>([^<]+)<\/p>/i);
    if (titleMatch && titleMatch[1]) {
      cleanMsg = titleMatch[1].trim();
      if (bodyMatch && bodyMatch[1]) {
        cleanMsg += ` - ${bodyMatch[1].trim()}`;
      }
    }

    return { status: 'error', message: cleanMsg, isHtml: true, raw: trimmed };
  }
}

/**
 * Standard HTTP Request Wrapper
 * @param {string} endpoint - API route path (e.g. '/auth/login.php' or 'auth/login.php')
 * @param {Object} options - Standard fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Parsed JSON response data
 */
async function request(endpoint, options = {}) {
  // Normalize URL string
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL.replace(/\/+$/, '')}${cleanEndpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    method: 'GET',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // CRITICAL for PHP Session-Based Auth:
    // Ensures browser sends & stores HTTP-Only session cookies (PHPSESSID) across origins
    credentials: 'include',
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const rawText = await response.text();
    const data = parseCleanJson(rawText);

    if (!response.ok || data.status === 'error' && response.status >= 400) {
      const error = new Error(data.message || data.error || `HTTP Error ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      console.error(`[API Network/CORS Error] Failed to fetch from ${url}:`, err.message);
    }
    throw err;
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  request,
  getBaseUrl: () => BASE_URL,
};

export default apiClient;
