declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[][];
      loaded: boolean;
      version: string;
      push: (...args: unknown[]) => void;
    };
    _fbq: unknown;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

let isInitialized = false;

function injectPixelScript(): void {
  if (typeof window === 'undefined' || window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue.push(args);
    }
  } as Window['fbq'];

  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

export function initMetaPixel(): void {
  if (!PIXEL_ID || isInitialized) return;
  injectPixelScript();
  if (typeof window.fbq === 'function') {
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
    isInitialized = true;
  }
}

export function trackPageView(): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'PageView');
}

export function trackLead(data?: { content_name?: string; value?: number; currency?: string }): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'Lead', data);
}

export function trackCompleteRegistration(data?: { content_name?: string; value?: number; currency?: string }): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'CompleteRegistration', data);
}

export function trackInitiateCheckout(data?: { content_name?: string; value?: number; currency?: string; num_items?: number }): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'InitiateCheckout', data);
}

export function trackPurchase(data: { value: number; currency: string; content_name?: string }): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'Purchase', data);
}

export function trackViewContent(data?: { content_name?: string; content_category?: string; value?: number; currency?: string }): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'ViewContent', data);
}

export function trackContact(): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'Contact');
}

export function trackSearch(data?: { search_string?: string; content_category?: string }): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('track', 'Search', data);
}

export function trackCustomEvent(eventName: string, data?: Record<string, unknown>): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('trackCustom', eventName, data);
}
