import { useEffect } from 'react';

/**
 * Custom hook to trigger scroll animations using IntersectionObserver.
 * Elements with the class `animate-on-scroll` will gain the class `is-visible` when scrolled into view.
 * 
 * Handles asynchronous content loading and dynamic DOM additions seamlessly.
 */
export function useScrollAnimation(deps = []) {
  useEffect(() => {
    // If reduced motion is preferred, immediately show all animated elements
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '50px 0px 50px 0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const checkAndObserve = () => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach((el) => {
        // If element is inside or above current viewport, make visible immediately
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top <= viewportHeight + 100) {
          el.classList.add('is-visible');
        } else if (!el.classList.contains('is-visible')) {
          observer.observe(el);
        }
      });
    };

    // Initial check
    checkAndObserve();

    // Staggered timeouts to catch async API data renders
    const t1 = setTimeout(checkAndObserve, 50);
    const t2 = setTimeout(checkAndObserve, 250);
    const t3 = setTimeout(checkAndObserve, 800);

    // Watch DOM tree for dynamically injected cards
    const mutationObserver = new MutationObserver(() => {
      checkAndObserve();
    });

    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, deps);
}
