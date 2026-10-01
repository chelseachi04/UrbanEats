/**
 * UrbanEats Local Image Asset Map
 *
 * PURPOSE:
 *   Maps database restaurant/food slugs and IDs to locally bundled image assets.
 *   The database stores text content (names, descriptions, prices, categories).
 *   Local image assets remain in the Vite bundle since the database does not
 *   yet serve image files directly.
 *
 * IMPORTANT:
 *   This file is NOT the source of truth for restaurant or menu CONTENT.
 *   All content (names, descriptions, prices, categories) comes from the
 *   PHP API / MySQL database.
 *   This file exists ONLY to provide image assets for presentation.
 */

// ── Restaurant Cover Images ──────────────────────────────────────────────────
import deltaPalaceCover    from '../Delta Food Palace/Delta Food Palace.webp';
import mayorBreakfastCover from '../Mayor Breakfast/Mayor Breakfast Restaurant.webp';
import royalBukaCover      from '../Royal Delta Buka/Royal Delta Buka.jpg';

// ── Delta Food Palace — Food Item Images ─────────────────────────────────────
import bangaSoupImg      from '../Delta Food Palace/Banga soup and Starch.jpg';
import egusiSoupImg      from '../Delta Food Palace/Delicious Egusi soup.jpg';
import jollofRiceImg     from '../Delta Food Palace/NIGERIAN JOLLOF RICE.webp';
import amalaImg          from '../Delta Food Palace/Amala , gbegiri , ewedu and some proteins.jpg';
import efoRiroImg        from '../Delta Food Palace/Efo riro.webp';
import friedPlantainsImg from '../Delta Food Palace/𝗙𝗿𝗶𝗲𝗱 𝗣𝗹𝗮𝗻𝘁𝗮𝗶𝗻𝘀.jpg';

// ── Mayor Breakfast — Food Item Images ───────────────────────────────────────
import akamuMoiMoiImg       from '../Mayor Breakfast/Akamu and Moi Moi.jpg';
import eggSandwichImg       from '../Mayor Breakfast/Egg Sandwich.jpg';
import watermelonJuiceImg   from '../Mayor Breakfast/Watermelon Juice.jpg';
import americanBreakfastImg from '../Mayor Breakfast/All-American Breakfast Plate.webp';
import pancakesImg          from '../Mayor Breakfast/Pan cake.jpg';
import croissantImg         from '../Mayor Breakfast/Ham and Cheese Croissants.webp';

// ── Royal Delta Buka — Food Item Images ──────────────────────────────────────
import peppersoupImg    from '../Royal Delta Buka/Assorted Nigerian pepper soup.jpg';
import friedRiceImg     from '../Royal Delta Buka/Nigerian Fried Rice _ How To Make Nigerian Foods.jpg';
import afangSoupImg     from '../Royal Delta Buka/Afang soup.webp';
import beansPlantainImg from '../Royal Delta Buka/Beans and plantain 😝.webp';
import fishPeppersoupImg from '../Royal Delta Buka/Fresh Fish Peppersoup.jpg';
import stirFriedSpagImg from '../Royal Delta Buka/Stirred fried spaghetti.jpg';

// ── App Logo ──────────────────────────────────────────────────────────────────
export { default as logoImg } from '../logo/Urban_Eats.png';

// ─────────────────────────────────────────────────────────────────────────────
// RESTAURANT IMAGES
// Keyed by database slug (primary) and database ID (secondary fallback).
// Slugs come from the PHP API's `slug` field on the restaurants table.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Restaurant cover images keyed by database slug.
 * Slugs: verified against MySQL urbaneats_db.restaurants table.
 */
export const RESTAURANT_COVER_IMAGES = {
  // By slug (primary key for lookup)
  'delta-food-palace': deltaPalaceCover,
  'mayor-breakfast':   mayorBreakfastCover,
  'royal-delta-buka':  royalBukaCover,
};

/**
 * Restaurant cover images keyed by database ID (integer).
 * Used as a fallback when slug-based lookup returns null.
 * IDs: verified against MySQL urbaneats_db.restaurants table.
 *   id=1 → Delta Food Palace
 *   id=2 → Mayor Breakfast
 *   id=3 → Royal Delta Buka
 */
export const RESTAURANT_COVER_IMAGES_BY_ID = {
  1: deltaPalaceCover,
  2: mayorBreakfastCover,
  3: royalBukaCover,
};

// ─────────────────────────────────────────────────────────────────────────────
// FOOD ITEM IMAGES
// Keyed by database slug (primary) and database ID (secondary fallback).
// Slugs come from the PHP API's `slug` field on the food_items table.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Food item images keyed by database slug.
 * Slugs: verified against MySQL urbaneats_db.food_items table.
 */
export const FOOD_ITEM_IMAGES = {
  // ── Delta Food Palace (restaurant_id = 1) ──────────────────────────────
  'banga-soup-native-starch':    bangaSoupImg,
  'delicious-egusi-soup-fufu':   egusiSoupImg,
  'smokey-nigerian-jollof-rice': jollofRiceImg,
  'amala-gbegiri-ewedu':         amalaImg,
  'efo-riro-special':            efoRiroImg,
  'golden-fried-plantains-dodo': friedPlantainsImg,

  // ── Mayor Breakfast (restaurant_id = 2) ───────────────────────────────
  'akamu-pap-hot-moi-moi':        akamuMoiMoiImg,
  'loaded-egg-sandwich':          eggSandwichImg,
  'all-american-breakfast-plate': americanBreakfastImg,
  'stack-of-fluffy-pancakes':     pancakesImg,
  'ham-cheese-croissant':         croissantImg,
  'fresh-watermelon-juice':       watermelonJuiceImg,

  // ── Royal Delta Buka (restaurant_id = 3) ──────────────────────────────
  'assorted-goat-meat-pepper-soup': peppersoupImg,
  'special-nigerian-fried-rice':    friedRiceImg,
  'calabar-afang-soup-fufu':        afangSoupImg,
  'stewed-beans-fried-plantain':    beansPlantainImg,
  'fresh-catfish-pepper-soup':      fishPeppersoupImg,
  'stir-fried-spaghetti-deluxe':    stirFriedSpagImg,
};

/**
 * Food item images keyed by database ID (integer).
 * Used as a fallback when slug-based lookup returns null.
 * IDs: verified against MySQL urbaneats_db.food_items table.
 */
export const FOOD_ITEM_IMAGES_BY_ID = {
  // Delta Food Palace
  1: bangaSoupImg,
  2: egusiSoupImg,
  3: jollofRiceImg,
  4: amalaImg,
  5: efoRiroImg,
  6: friedPlantainsImg,
  // Mayor Breakfast
  7:  akamuMoiMoiImg,
  8:  eggSandwichImg,
  9:  americanBreakfastImg,
  10: pancakesImg,
  11: croissantImg,
  12: watermelonJuiceImg,
  // Royal Delta Buka
  13: peppersoupImg,
  14: friedRiceImg,
  15: afangSoupImg,
  16: beansPlantainImg,
  17: fishPeppersoupImg,
  18: stirFriedSpagImg,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the local image asset for a restaurant.
 * Supports slug string, numeric ID, restaurant object, or path string.
 *
 * @param {string|number|object} param1 - slug, ID, or restaurant object
 * @param {number|string} [param2]  - optional fallback restaurant ID
 */
export function getRestaurantImage(param1, param2) {
  if (param1 && typeof param1 === 'object') {
    const slugMatch = param1.slug ? RESTAURANT_COVER_IMAGES[param1.slug] : null;
    if (slugMatch) return slugMatch;
    const idMatch = param1.id != null ? RESTAURANT_COVER_IMAGES_BY_ID[Number(param1.id)] : null;
    if (idMatch) return idMatch;
    if (param1.cover_image) return param1.cover_image;
    if (param1.image) return param1.image;
  }

  if (typeof param1 === 'string' && RESTAURANT_COVER_IMAGES[param1]) {
    return RESTAURANT_COVER_IMAGES[param1];
  }

  if (param1 != null && RESTAURANT_COVER_IMAGES_BY_ID[Number(param1)]) {
    return RESTAURANT_COVER_IMAGES_BY_ID[Number(param1)];
  }

  if (param2 != null && RESTAURANT_COVER_IMAGES_BY_ID[Number(param2)]) {
    return RESTAURANT_COVER_IMAGES_BY_ID[Number(param2)];
  }

  if (typeof param1 === 'string' && (param1.startsWith('src/') || param1.startsWith('/src/'))) {
    return param1;
  }

  return null;
}

/**
 * Resolve the local image asset for a food item.
 * Supports slug string, numeric ID, food item object, or path string.
 *
 * @param {string|number|object} param1 - slug, ID, or food item object
 * @param {number|string} [param2]  - optional fallback food item ID
 */
export function getFoodItemImage(param1, param2) {
  const toSlug = (str) => typeof str === 'string' ? str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';

  if (param1 && typeof param1 === 'object') {
    if (param1.slug && FOOD_ITEM_IMAGES[param1.slug]) return FOOD_ITEM_IMAGES[param1.slug];
    if (param1.food_slug && FOOD_ITEM_IMAGES[param1.food_slug]) return FOOD_ITEM_IMAGES[param1.food_slug];
    if (param1.id != null && FOOD_ITEM_IMAGES_BY_ID[Number(param1.id)]) return FOOD_ITEM_IMAGES_BY_ID[Number(param1.id)];
    if (param1.food_item_id != null && FOOD_ITEM_IMAGES_BY_ID[Number(param1.food_item_id)]) return FOOD_ITEM_IMAGES_BY_ID[Number(param1.food_item_id)];
    
    const nameStr = param1.food_name || param1.name || '';
    if (nameStr) {
      const slugFromName = toSlug(nameStr);
      if (FOOD_ITEM_IMAGES[slugFromName]) return FOOD_ITEM_IMAGES[slugFromName];
    }

    if (param1.image_url) return param1.image_url;
    if (param1.food_image_url) return param1.food_image_url;
    if (param1.image) return param1.image;
  }

  if (typeof param1 === 'string') {
    if (FOOD_ITEM_IMAGES[param1]) return FOOD_ITEM_IMAGES[param1];
    const slugFromStr = toSlug(param1);
    if (FOOD_ITEM_IMAGES[slugFromStr]) return FOOD_ITEM_IMAGES[slugFromStr];
  }

  if (param1 != null && FOOD_ITEM_IMAGES_BY_ID[Number(param1)]) {
    return FOOD_ITEM_IMAGES_BY_ID[Number(param1)];
  }

  if (param2 != null && FOOD_ITEM_IMAGES_BY_ID[Number(param2)]) {
    return FOOD_ITEM_IMAGES_BY_ID[Number(param2)];
  }

  if (typeof param1 === 'string' && (param1.startsWith('src/') || param1.startsWith('/src/'))) {
    return param1;
  }

  return null;
}

