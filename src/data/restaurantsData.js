/**
 * UrbanEats restaurantsData.js — Compatibility Shim
 *
 * PHASE 2B-2:
 *   Restaurant and menu CONTENT is now stored in MySQL and served
 *   through the PHP REST API. This file is retained ONLY to provide
 *   the logoImg export used by Navbar.jsx, Footer.jsx, and AboutPage.jsx.
 *
 *   All image assets are now in: src/data/imageAssets.js
 *   All restaurant/menu API functions are in: src/api/restaurantApi.js
 *
 *   INITIAL_RESTAURANTS has been removed — use the PHP API instead.
 */

// Logo — still imported here for Navbar, Footer, and AboutPage backward compatibility
export { logoImg } from './imageAssets';
