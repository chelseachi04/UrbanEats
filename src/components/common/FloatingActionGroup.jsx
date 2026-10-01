import React from 'react';
import FloatingCartFAB from './FloatingCartFAB';
import ScrollToTopButton from './ScrollToTopButton';

/**
 * FloatingActionGroup — Unified Vertical Column for Floating Action Buttons
 *
 * Stacks Floating Cart Button (top) and Scroll-to-Top Button (bottom)
 * with coordinated vertical alignment, inset margin, and smooth non-jumping transitions.
 */
export default function FloatingActionGroup() {
  return (
    <div className="floating-actions-container" aria-label="Floating quick actions">
      <FloatingCartFAB />
      <ScrollToTopButton />
    </div>
  );
}
