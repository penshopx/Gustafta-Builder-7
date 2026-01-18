declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

let isInitialized = false;

export function initMetaPixel(): void {
  if (!PIXEL_ID || isInitialized) return;
  
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

export function trackCustomEvent(eventName: string, data?: Record<string, unknown>): void {
  if (!PIXEL_ID || typeof window.fbq !== 'function') return;
  window.fbq('trackCustom', eventName, data);
}
