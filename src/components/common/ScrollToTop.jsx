import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// In-memory cache for scroll positions across page visits
const scrollPositions = new Map();

/**
 * Enhanced ScrollManager component for React Router.
 * - For new page navigations (PUSH): Scrolls to top: 0, left: 0.
 * - For back/forward navigations (POP / Back arrow): Restores the exact previous scroll position
 *   where the user clicked the link, preventing unwanted jumps to the top.
 */
export default function ScrollToTop() {
  const location = useLocation();
  const navType = useNavigationType();
  const prevLocationRef = useRef(location);

  // Disable browser's native automatic scroll restoration to avoid conflicting jumps
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously record scroll position for the current page
  useEffect(() => {
    const handleScroll = () => {
      const key = location.key || `${location.pathname}${location.search}`;
      const pathKey = `${location.pathname}${location.search}`;
      scrollPositions.set(key, window.scrollY);
      scrollPositions.set(pathKey, window.scrollY);
      try {
        sessionStorage.setItem(`scroll_${pathKey}`, window.scrollY.toString());
      } catch {
        // Ignore sessionStorage quota errors
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Handle route changes
  useEffect(() => {
    const prevKey = prevLocationRef.current.key || `${prevLocationRef.current.pathname}${prevLocationRef.current.search}`;
    const prevPathKey = `${prevLocationRef.current.pathname}${prevLocationRef.current.search}`;
    
    // Save previous page scroll position before switching
    scrollPositions.set(prevKey, window.scrollY);
    scrollPositions.set(prevPathKey, window.scrollY);

    const currentKey = location.key || `${location.pathname}${location.search}`;
    const currentPathKey = `${location.pathname}${location.search}`;

    if (navType === 'POP') {
      // User navigated back or forward: restore previous scroll position
      let savedY = scrollPositions.get(currentKey);
      if (savedY === undefined) {
        savedY = scrollPositions.get(currentPathKey);
      }
      if (savedY === undefined) {
        try {
          const sessionVal = sessionStorage.getItem(`scroll_${currentPathKey}`);
          if (sessionVal !== null) {
            savedY = parseFloat(sessionVal);
          }
        } catch {
          // ignore
        }
      }

      const targetY = savedY !== undefined ? savedY : 0;

      // Restore immediately and follow up with RAF/timeout in case of dynamic child rendering
      window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });

      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
      });

      const timer = setTimeout(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
      }, 50);

      prevLocationRef.current = location;
      return () => clearTimeout(timer);
    } else {
      // New navigation (PUSH/REPLACE): scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      prevLocationRef.current = location;
    }
  }, [location, navType]);

  return null;
}
