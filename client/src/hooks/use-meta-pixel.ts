import { useEffect } from 'react';
import { initMetaPixel, trackPageView } from '@/lib/meta-pixel';

export function useMetaPixel() {
  useEffect(() => {
    initMetaPixel();
  }, []);
}

export function useTrackPageView(pageName?: string) {
  useEffect(() => {
    trackPageView();
  }, [pageName]);
}

export * from '@/lib/meta-pixel';
