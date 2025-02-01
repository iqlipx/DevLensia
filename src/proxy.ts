import type { Proxy } from './types';

// List of more reliable CORS proxies
const FREE_PROXIES: Proxy[] = [
  { 
    url: 'https://thingproxy.freeboard.io/fetch/', 
    isWorking: true, 
    rateLimitRemaining: null 
  },
  { 
    url: 'https://api.allorigins.win/raw?url=', 
    isWorking: true, 
    rateLimitRemaining: null 
  },
  {
    url: 'https://cors-anywhere.herokuapp.com/',
    isWorking: true,
    rateLimitRemaining: null
  }
];

let currentProxyIndex = 0;
const RETRY_DELAY = 1000; // 1 second delay between retries

export function getCurrentProxy(): Proxy {
  return FREE_PROXIES[currentProxyIndex];
}

export function rotateProxy(): Proxy {
  currentProxyIndex = (currentProxyIndex + 1) % FREE_PROXIES.length;
  return FREE_PROXIES[currentProxyIndex];
}

export function markProxyAsExhausted(proxyUrl: string, remaining: number): void {
  const proxy = FREE_PROXIES.find(p => p.url === proxyUrl);
  if (proxy) {
    proxy.rateLimitRemaining = remaining;
    if (remaining === 0) {
      proxy.isWorking = false;
    }
  }
}

export function markProxyAsNotWorking(proxyUrl: string): void {
  const proxy = FREE_PROXIES.find(p => p.url === proxyUrl);
  if (proxy) {
    proxy.isWorking = false;
  }
}

export function getNextAvailableProxy(): Proxy | null {
  return FREE_PROXIES.find(
    proxy => proxy.isWorking && (!proxy.rateLimitRemaining || proxy.rateLimitRemaining > 0)
  );
}

export function resetProxies(): void {
  FREE_PROXIES.forEach(proxy => {
    proxy.rateLimitRemaining = null;
    proxy.isWorking = true;
  });
  currentProxyIndex = 0;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithProxy(url: string, attempt = 1): Promise<Response> {
  const maxAttempts = FREE_PROXIES.length;
  const proxy = getCurrentProxy();
  const proxyUrl = `${proxy.url}${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl);
    
    // Check rate limit headers
    const remaining = Number(response.headers.get('X-RateLimit-Remaining')) || null;
    const reset = Number(response.headers.get('X-RateLimit-Reset')) || null;

    if (remaining !== null) {
      markProxyAsExhausted(proxy.url, remaining);
    }

    // Handle different response scenarios
    if (response.ok) {
      return response;
    }

    if (response.status === 429 || response.status === 403) {
      markProxyAsExhausted(proxy.url, 0);
      
      if (attempt < maxAttempts) {
        rotateProxy();
        await delay(RETRY_DELAY); // Add delay before retry
        return fetchWithProxy(url, attempt + 1);
      }
    }

    markProxyAsNotWorking(proxy.url);
    
    if (attempt < maxAttempts) {
      rotateProxy();
      await delay(RETRY_DELAY);
      return fetchWithProxy(url, attempt + 1);
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.warn(`Proxy failed: ${proxy.url}. Rotating...`);
    markProxyAsNotWorking(proxy.url);
    
    if (attempt < maxAttempts) {
      rotateProxy();
      await delay(RETRY_DELAY);
      return fetchWithProxy(url, attempt + 1);
    }
    
    throw new Error('All proxies failed. Please try again later.');
  }
}