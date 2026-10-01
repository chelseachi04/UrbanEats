/**
 * UrbanEats Food Customization Schemas
 *
 * Dynamic, dish-tailored Nigerian food customization schemas.
 * Categorizes dishes by name, category, and cuisine type into:
 *   1. Rice Dishes (Jollof, Fried, White, Ofada, Coconut, etc.)
 *   2. Soups & Swallow (Egusi, Ogbono, Afang, Okro, Banga, Oha, Bitterleaf, Ewedu, etc.)
 *   3. Pepper Soups (Catfish, Goat Meat, Tilapia, Bush Meat, etc.)
 *   4. Pasta, Noodles, Fries, Yam & Beans (Spaghetti, Indomie, Fried Yam, Ewa Aganyin, etc.)
 *   5. Snacks & Pastries (Meat Pie, Chicken Pie, Sausage Roll, etc.)
 *   6. Drinks, Grills & General Delicacies
 */

// ── Standard authentic Nigerian Protein Catalogs ──────────────────────────────
export const RICE_PROTEINS = [
  { id: 'none', name: 'No Meat', price: 0, tag: 'Base Only' },
  { id: 'beef', name: 'Beef', price: 700, tag: 'Stewed' },
  { id: 'fried_chicken', name: 'Fried Chicken', price: 1200, tag: 'Chicken' },
  { id: 'stewed_chicken', name: 'Stewed Chicken', price: 1200, tag: 'Chicken' },
  { id: 'peppered_chicken', name: 'Peppered Chicken', price: 1300, tag: 'Spicy' },
  { id: 'chicken_lap', name: 'Chicken Lap', price: 1400, tag: 'Drumstick' },
  { id: 'chicken_wings', name: 'Chicken Wings (3 pcs)', price: 1100, tag: 'Wings' },
  { id: 'chicken_breast', name: 'Chicken Breast', price: 1500, tag: 'Grilled' },
  { id: 'turkey', name: 'Turkey', price: 1600, tag: 'Fried Turkey' },
  { id: 'goat_meat', name: 'Goat Meat', price: 1200, tag: 'Asun / Stewed' },
  { id: 'gizzard', name: 'Gizzard', price: 600, tag: 'Peppered' },
  { id: 'fried_fish', name: 'Fried Fish', price: 1000, tag: 'Titus' },
  { id: 'grilled_croaker', name: 'Croaker Fish', price: 1800, tag: 'Grilled' },
  { id: 'assorted_meat', name: 'Assorted Meat', price: 1000, tag: 'Shaki & Beef' },
  { id: 'ponmo', name: 'Ponmo', price: 400, tag: 'Cow Skin' },
  { id: 'liver', name: 'Liver', price: 500, tag: 'Cow Liver' },
  { id: 'sausage', name: 'Sausage (2 pcs)', price: 500, tag: 'Grilled' },
  { id: 'prawns', name: 'Prawns (4 pcs)', price: 1500, tag: 'Shrimps' },
  { id: 'boiled_egg', name: 'Boiled Egg', price: 300, tag: 'Egg' },
  { id: 'fried_egg', name: 'Fried Egg', price: 350, tag: 'Egg' },
];

export const SOUP_PROTEINS = [
  { id: 'beef', name: 'Beef', price: 700, tag: 'Stewed' },
  { id: 'goat_meat', name: 'Goat Meat', price: 1200, tag: 'Native Meat' },
  { id: 'assorted_meat', name: 'Assorted Meat', price: 1000, tag: 'Mix' },
  { id: 'ponmo', name: 'Ponmo', price: 400, tag: 'Cow Skin' },
  { id: 'shaki', name: 'Shaki', price: 600, tag: 'Tripe' },
  { id: 'cow_foot', name: 'Cow Foot', price: 900, tag: 'Bokoto' },
  { id: 'oxtail', name: 'Oxtail', price: 1500, tag: 'Cow Tail' },
  { id: 'chicken', name: 'Chicken', price: 1200, tag: 'Local/Stewed' },
  { id: 'turkey', name: 'Turkey', price: 1600, tag: 'Turkey Cut' },
  { id: 'catfish', name: 'Catfish', price: 1800, tag: 'Fresh Catfish' },
  { id: 'croaker', name: 'Croaker Fish', price: 1600, tag: 'Fresh Fish' },
  { id: 'titus', name: 'Titus Fish', price: 1200, tag: 'Mackerel' },
  { id: 'stockfish', name: 'Stockfish', price: 1500, tag: 'Okporoko' },
  { id: 'dried_fish', name: 'Dry Fish', price: 1000, tag: 'Mangala' },
  { id: 'smoked_fish', name: 'Smoked Fish', price: 1000, tag: 'Smoked Catfish' },
  { id: 'periwinkle', name: 'Periwinkles', price: 700, tag: 'Isam' },
  { id: 'giant_snail', name: 'Snail', price: 2000, tag: 'Congo Meat' },
  { id: 'prawns', name: 'Prawns', price: 1500, tag: 'Seafood' },
];

export const PEPPER_SOUP_BASES = [
  { id: 'catfish', name: 'Catfish', price: 2200, tag: 'Point & Kill' },
  { id: 'goat_meat', name: 'Goat Meat', price: 1500, tag: 'Pepper Soup' },
  { id: 'tilapia', name: 'Tilapia Fish', price: 1800, tag: 'Fresh' },
  { id: 'croaker', name: 'Croaker Fish', price: 1600, tag: 'Fresh Fish' },
  { id: 'chicken', name: 'Chicken', price: 1300, tag: 'Local Fowl' },
  { id: 'turkey', name: 'Turkey', price: 1700, tag: 'Turkey Cut' },
  { id: 'assorted_meat', name: 'Assorted Meat', price: 1200, tag: 'Assorted & Offals' },
  { id: 'cow_foot', name: 'Cow Foot', price: 1100, tag: 'Bokoto' },
  { id: 'cow_tail', name: 'Cow Tail', price: 1800, tag: 'Oxtail' },
  { id: 'snail', name: 'Snail', price: 2200, tag: 'Giant Snail' },
  { id: 'bush_meat', name: 'Bush Meat', price: 2500, tag: 'Grasscutter' },
];

export const SWALLOW_OPTIONS = [
  { id: 'none', name: 'No Swallow', price: 0, tag: 'Soup Only' },
  { id: 'eba', name: 'Eba', price: 300, tag: 'Garri' },
  { id: 'starch', name: 'Starch', price: 300, tag: 'Delta Usi' },
  { id: 'pounded_yam', name: 'Pounded Yam', price: 600, tag: 'Iyan' },
  { id: 'semovita', name: 'Semovita', price: 400, tag: 'Semo' },
  { id: 'wheat', name: 'Wheat', price: 400, tag: 'Wheat Meal' },
  { id: 'fufu', name: 'Fufu', price: 300, tag: 'Akpu' },
  { id: 'amala', name: 'Amala', price: 400, tag: 'Amala Dudu' },
  { id: 'tuwo_shinkafa', name: 'Tuwo Shinkafa', price: 400, tag: 'Rice Swallow' },
  { id: 'plantain_fufu', name: 'Plantain Fufu', price: 500, tag: 'Unripe Plantain' },
  { id: 'oat_fufu', name: 'Oat Fufu', price: 400, tag: 'Oatmeal' },
];

export const RICE_SIDES = [
  { id: 'plantain', name: 'Fried Plantain (Dodo)', price: 500, tag: 'Dodo' },
  { id: 'coleslaw', name: 'Coleslaw / Salad', price: 400, tag: 'Salad' },
  { id: 'moi_moi', name: 'Moi-Moi', price: 600, tag: 'Steamed' },
  { id: 'pepper_sauce', name: 'Extra Stew / Sauce', price: 300, tag: 'Spicy' },
];

export const PASTA_NOODLES_PROTEINS = [
  { id: 'boiled_egg', name: 'Boiled Egg', price: 300 },
  { id: 'fried_egg', name: 'Fried Egg', price: 350 },
  { id: 'chicken', name: 'Chicken', price: 1200 },
  { id: 'beef', name: 'Beef', price: 700 },
  { id: 'sausage', name: 'Sausage', price: 500 },
  { id: 'turkey', name: 'Turkey', price: 1600 },
  { id: 'gizzard', name: 'Gizzard', price: 600 },
  { id: 'minced_meat', name: 'Minced Meat', price: 900 },
  { id: 'prawns', name: 'Prawns', price: 1500 },
  { id: 'smoked_fish', name: 'Smoked Fish', price: 1000 },
];

export const YAM_PLANTAIN_PROTEINS = [
  { id: 'fried_egg', name: 'Fried Egg', price: 350 },
  { id: 'egg_sauce', name: 'Egg Sauce', price: 600 },
  { id: 'beef', name: 'Beef', price: 700 },
  { id: 'chicken', name: 'Chicken', price: 1200 },
  { id: 'fish', name: 'Fried Fish', price: 1000 },
  { id: 'goat_meat', name: 'Goat Meat', price: 1200 },
  { id: 'ponmo', name: 'Ponmo', price: 400 },
  { id: 'stew_portion', name: 'Extra Stew', price: 400 },
];

export const CHIPS_FRIES_PROTEINS = [
  { id: 'chicken_wings', name: 'Chicken Wings (3 pcs)', price: 1100 },
  { id: 'chicken_lap', name: 'Chicken Lap', price: 1400 },
  { id: 'beef', name: 'Suya Beef', price: 700 },
  { id: 'sausage', name: 'Sausage', price: 500 },
  { id: 'turkey', name: 'Turkey', price: 1600 },
  { id: 'gizzard', name: 'Gizzard', price: 600 },
  { id: 'tomato_sauce', name: 'Ketchup & Mayo', price: 250 },
  { id: 'pepper_sauce', name: 'Pepper Sauce', price: 300 },
];

export const BEANS_PORRIDGE_PROTEINS = [
  { id: 'ponmo', name: 'Ponmo', price: 400 },
  { id: 'shaki', name: 'Shaki', price: 600 },
  { id: 'fried_fish', name: 'Fried Fish', price: 1000 },
  { id: 'smoked_fish', name: 'Smoked Fish', price: 1000 },
  { id: 'dried_fish', name: 'Dry Fish', price: 1000 },
  { id: 'beef', name: 'Beef', price: 700 },
  { id: 'goat_meat', name: 'Goat Meat', price: 1200 },
  { id: 'crayfish', name: 'Extra Crayfish', price: 400 },
  { id: 'boiled_egg', name: 'Boiled Egg', price: 300 },
  { id: 'plantain', name: 'Fried Plantain (Dodo)', price: 500 },
];

export const QUICK_INSTRUCTION_SUGGESTIONS = [
  'Less pepper & mild spices',
  'Make it extra spicy hot 🌶️',
  'Pack swallow in separate wrap',
  'Stew / sauce on the side',
  'No onions please',
  'Extra napkin & cutlery included',
  'Well done & crispy meat',
];

/**
 * Determine dish customization schema based on dish name, category, and metadata.
 */
export function getCustomizationSchema(foodItem) {
  if (!foodItem) return null;

  const nameLower = (foodItem.name || '').toLowerCase();
  const catLower  = (foodItem.category_name || foodItem.categoryName || '').toLowerCase();
  const descLower = (foodItem.description || '').toLowerCase();
  const slugLower = (foodItem.slug || '').toLowerCase();
  const basePrice = parseFloat(foodItem.price) || 0;

  const combined = `${nameLower} ${catLower} ${descLower} ${slugLower}`;

  // ── 1. RICE DISHES ────────────────────────────────────────────────────────
  if (
    combined.includes('rice') ||
    combined.includes('jollof') ||
    combined.includes('ofada') ||
    combined.includes('fried rice') ||
    combined.includes('coconut rice') ||
    combined.includes('concoction')
  ) {
    let dishType = 'jollof';
    let defaultProteins = RICE_PROTEINS;
    let subtitle = 'Select your scoop size, proteins & sides';

    if (combined.includes('fried rice')) {
      dishType = 'fried';
      defaultProteins = RICE_PROTEINS.filter(p =>
        ['none', 'fried_chicken', 'stewed_chicken', 'turkey', 'beef', 'gizzard', 'liver', 'prawns', 'sausage', 'boiled_egg', 'fried_egg'].includes(p.id)
      );
    } else if (combined.includes('white rice') || combined.includes('boiled rice')) {
      dishType = 'white';
      subtitle = 'Choose your preferred stew/sauce base, proteins & fresh sides';
      defaultProteins = [
        { id: 'beef_stew', name: 'Beef Stew', price: 700, tag: 'Stew' },
        { id: 'chicken_stew', name: 'Chicken Stew', price: 1200, tag: 'Stew' },
        { id: 'turkey_stew', name: 'Turkey Stew', price: 1600, tag: 'Stew' },
        { id: 'fish_stew', name: 'Fish Stew', price: 1000, tag: 'Stew' },
        { id: 'goat_meat_stew', name: 'Goat Meat Stew', price: 1200, tag: 'Stew' },
        { id: 'egg_sauce', name: 'Egg Sauce', price: 600, tag: 'Sauce' },
        { id: 'veg_sauce', name: 'Vegetable Sauce', price: 700, tag: 'Sauce' },
        ...RICE_PROTEINS.filter(p => ['ponmo', 'boiled_egg', 'fried_egg'].includes(p.id)),
      ];
    } else if (combined.includes('ofada')) {
      dishType = 'ofada';
      subtitle = 'Includes Ayamase sauce. Select your meat mix & sides';
      defaultProteins = [
        { id: 'assorted_meat', name: 'Assorted Meat', price: 1000, tag: 'Shaki, Towel, Beef' },
        { id: 'ponmo', name: 'Ponmo', price: 400, tag: 'Cow Skin' },
        { id: 'shaki', name: 'Shaki', price: 600, tag: 'Tripe' },
        { id: 'beef', name: 'Beef', price: 700, tag: 'Fried Beef' },
        { id: 'goat_meat', name: 'Goat Meat', price: 1200, tag: 'Spiced Meat' },
        { id: 'liver', name: 'Liver', price: 500, tag: 'Cow Liver' },
        { id: 'boiled_egg', name: 'Boiled Egg', price: 300, tag: 'Egg' },
        { id: 'fried_fish', name: 'Fried Fish', price: 1000, tag: 'Fish' },
        { id: 'fried_chicken', name: 'Fried Chicken', price: 1200, tag: 'Chicken Lap' },
      ];
    }

    return {
      categoryType: 'rice',
      badge: 'Rice Specialty',
      subtitle: subtitle,
      portions: {
        title: 'Choose Scoop / Portion Size',
        type: 'radio',
        required: true,
        options: [
          { id: '1_scoop', name: '1 Scoop', price: 0, description: 'Standard serving portion' },
          { id: '2_scoops', name: '2 Scoops', price: 800, description: 'Double portion (+₦800)' },
          { id: '3_scoops', name: '3 Scoops', price: 1500, description: 'Triple portion (+₦1,500)' },
        ],
        defaultId: '1_scoop',
      },
      proteins: {
        title: dishType === 'white' ? 'Select Stew / Sauce & Protein Pairings' : 'Protein Selection',
        description: 'Tap to add proteins and adjust quantity per piece',
        type: 'counter_list',
        multi: true,
        options: defaultProteins,
      },
      sides: {
        title: 'Sides & Extras (Optional)',
        type: 'checkbox_list',
        options: RICE_SIDES,
      },
      hasInstructions: true,
    };
  }

  // ── 2. SOUPS & SWALLOW ────────────────────────────────────────────────────
  if (
    combined.includes('soup') && !combined.includes('pepper soup') ||
    combined.includes('egusi') ||
    combined.includes('ogbono') ||
    combined.includes('afang') ||
    combined.includes('okro') ||
    combined.includes('okro soup') ||
    combined.includes('banga') ||
    combined.includes('oha') ||
    combined.includes('bitterleaf') ||
    combined.includes('ewedu') ||
    combined.includes('edikaikong') ||
    combined.includes('efo riro') ||
    combined.includes('swallow') ||
    combined.includes('vegetable soup')
  ) {
    return {
      categoryType: 'soup_swallow',
      badge: 'Soup & Swallow',
      subtitle: 'Select swallow, meats, fish and extras',
      swallow: {
        title: 'Choose Your Swallow',
        type: 'radio',
        required: false,
        options: SWALLOW_OPTIONS,
        defaultId: 'pounded_yam',
      },
      proteins: {
        title: 'Meat, Fish & Seafood Choices',
        description: 'Select one or more cuts and customize quantity per piece',
        type: 'counter_list',
        multi: true,
        options: SOUP_PROTEINS,
      },
      sides: {
        title: 'Soup Extras (Optional)',
        type: 'checkbox_list',
        options: [
          { id: 'extra_soup', name: 'Extra Soup', price: 800, tag: 'More Soup' },
          { id: 'crayfish', name: 'Extra Crayfish', price: 400, tag: 'Crayfish' },
          { id: 'periwinkle_extra', name: 'Extra Periwinkles', price: 600, tag: 'Periwinkles' },
          { id: 'fried_plantain', name: 'Fried Plantain (Dodo)', price: 500, tag: 'Dodo' },
        ],
      },
      hasInstructions: true,
    };
  }

  // ── 3. PEPPER SOUPS ───────────────────────────────────────────────────────
  if (
    combined.includes('pepper soup') ||
    combined.includes('peppersoup') ||
    combined.includes('catfish point') ||
    combined.includes('point and kill') ||
    combined.includes('goat meat pepper')
  ) {
    return {
      categoryType: 'peppersoup',
      badge: 'Pepper Soup',
      subtitle: 'Hot aromatic broth with your choice of protein & pairings',
      proteins: {
        title: 'Select Pepper Soup Protein Base',
        description: 'Choose your desired meat, fresh fish or delicacy cut',
        type: 'counter_list',
        multi: true,
        options: PEPPER_SOUP_BASES,
      },
      sides: {
        title: 'Accompaniments & Extras',
        type: 'checkbox_list',
        options: [
          { id: 'extra_broth', name: 'Extra Pepper Soup Broth', price: 400, tag: 'Broth' },
          { id: 'agidi', name: 'Agidi / Eko', price: 300, tag: 'Agidi' },
          { id: 'boiled_yam', name: 'Boiled Yam', price: 500, tag: 'Yam' },
          { id: 'boiled_plantain', name: 'Boiled Plantain', price: 500, tag: 'Plantain' },
        ],
      },
      hasInstructions: true,
    };
  }

  // ── 4. PASTA, NOODLES, FRIES, YAM & BEANS ──────────────────────────────────
  if (
    combined.includes('noodle') ||
    combined.includes('indomie') ||
    combined.includes('spaghetti') ||
    combined.includes('pasta') ||
    combined.includes('macaroni')
  ) {
    return {
      categoryType: 'noodles_pasta',
      badge: 'Pasta & Noodles',
      subtitle: 'Customize your proteins & toppings',
      portions: {
        title: 'Serving Size',
        type: 'radio',
        required: true,
        options: [
          { id: '1_pack', name: '1 Pack', price: 0, description: 'Standard serving' },
          { id: '2_packs', name: '2 Packs', price: 600, description: 'Double noodles serving (+₦600)' },
        ],
        defaultId: '1_pack',
      },
      proteins: {
        title: 'Proteins & Egg Toppings',
        description: 'Select your eggs, chicken, sausages or seafood',
        type: 'counter_list',
        multi: true,
        options: PASTA_NOODLES_PROTEINS,
      },
      sides: {
        title: 'Veggies & Extras',
        type: 'checkbox_list',
        options: [
          { id: 'fried_plantain', name: 'Fried Plantain (Dodo)', price: 500 },
          { id: 'extra_veggies', name: 'Stir-Fried Veggies', price: 350 },
          { id: 'extra_pepper', name: 'Extra Pepper', price: 200 },
        ],
      },
      hasInstructions: true,
    };
  }

  if (
    combined.includes('chips') ||
    combined.includes('fries') ||
    combined.includes('french fries') ||
    combined.includes('fried yam') ||
    combined.includes('yam chips')
  ) {
    return {
      categoryType: 'fries_chips',
      badge: 'Fries & Chips',
      subtitle: 'Served with tasty dips and poultry options',
      portions: {
        title: 'Portion Size',
        type: 'radio',
        required: true,
        options: [
          { id: 'regular', name: 'Regular', price: 0, description: 'Single portion' },
          { id: 'large', name: 'Large', price: 700, description: 'Large loaded box (+₦700)' },
        ],
        defaultId: 'regular',
      },
      proteins: {
        title: 'Pair With Wings, Turkey & Dips',
        description: 'Choose your wings, sausage links and dips',
        type: 'counter_list',
        multi: true,
        options: CHIPS_FRIES_PROTEINS,
      },
      hasInstructions: true,
    };
  }

  if (
    combined.includes('yam') ||
    combined.includes('plantain') ||
    combined.includes('bole') ||
    combined.includes('egg sauce')
  ) {
    return {
      categoryType: 'yam_plantain',
      badge: 'Yam & Plantain',
      subtitle: 'Boiled or fried yam/plantain with delicious sauces and meat',
      proteins: {
        title: 'Select Sauce, Egg & Protein Pairings',
        type: 'counter_list',
        multi: true,
        options: YAM_PLANTAIN_PROTEINS,
      },
      sides: {
        title: 'Extra Accompaniments',
        type: 'checkbox_list',
        options: [
          { id: 'extra_sauce', name: 'Extra Sauce', price: 500 },
          { id: 'extra_plantain', name: 'Extra Fried Plantain', price: 400 },
        ],
      },
      hasInstructions: true,
    };
  }

  if (
    combined.includes('bean') ||
    combined.includes('ewa') ||
    combined.includes('porridge') ||
    combined.includes('asaro')
  ) {
    return {
      categoryType: 'beans_porridge',
      badge: 'Beans & Porridge',
      subtitle: 'Beans/porridge with authentic protein toppings',
      proteins: {
        title: 'Protein, Fish & Egg Toppings',
        type: 'counter_list',
        multi: true,
        options: BEANS_PORRIDGE_PROTEINS,
      },
      sides: {
        title: 'Traditional Add-ons',
        type: 'checkbox_list',
        options: [
          { id: 'aganyin_sauce', name: 'Extra Aganyin Sauce', price: 400 },
          { id: 'bread', name: 'Agege Bread', price: 500 },
          { id: 'garri', name: 'Ijebu Garri', price: 250 },
        ],
      },
      hasInstructions: true,
    };
  }

  // ── 5. SNACKS & PASTRIES ──────────────────────────────────────────────────
  if (
    combined.includes('pie') ||
    combined.includes('roll') ||
    combined.includes('pastry') ||
    combined.includes('snack') ||
    combined.includes('doughnut') ||
    combined.includes('puff puff') ||
    combined.includes('shawarma') ||
    combined.includes('burger') ||
    combined.includes('sandwich')
  ) {
    const isPie = combined.includes('pie') || combined.includes('roll');

    return {
      categoryType: 'pastries_snacks',
      badge: isPie ? 'Pastries' : 'Quick Bites',
      subtitle: isPie ? 'Select your pack size and instructions' : 'Select extra fillings and preparation options',
      portions: isPie ? {
        title: 'Select Pack Size',
        type: 'radio',
        required: true,
        options: [
          { id: '1_piece', name: '1 Piece', price: 0, description: 'Single piece' },
          { id: '3_pieces', name: '3 Pieces', price: Math.round(basePrice * 2), description: 'Triple pack (+₦' + (basePrice * 2).toLocaleString() + ')' },
          { id: '6_pieces', name: '6 Pieces', price: Math.round(basePrice * 4.8), description: 'Half-dozen pack (+₦' + Math.round(basePrice * 4.8).toLocaleString() + ')' },
          { id: '12_pieces', name: '12 Pieces', price: Math.round(basePrice * 9.5), description: 'Dozen party pack (+₦' + Math.round(basePrice * 9.5).toLocaleString() + ')' },
        ],
        defaultId: '1_piece',
      } : {
        title: 'Portion / Size',
        type: 'radio',
        required: true,
        options: [
          { id: 'regular', name: 'Regular', price: 0, description: 'Standard size' },
          { id: 'jumbo', name: 'Jumbo', price: 800, description: 'Extra filling & wrap (+₦800)' },
        ],
        defaultId: 'regular',
      },
      proteins: {
        title: 'Add Extra Fillings (Optional)',
        type: 'counter_list',
        multi: true,
        options: [
          { id: 'extra_sausage', name: 'Extra Sausage', price: 500 },
          { id: 'extra_cheese', name: 'Extra Cheese Slice', price: 400 },
          { id: 'extra_chicken', name: 'Extra Chicken', price: 800 },
          { id: 'extra_creamy_sauce', name: 'Extra Creamy Mayo', price: 250 },
        ],
      },
      hasInstructions: true,
    };
  }

  // ── 6. DRINKS & BEVERAGES ─────────────────────────────────────────────────
  if (
    combined.includes('drink') ||
    combined.includes('juice') ||
    combined.includes('coke') ||
    combined.includes('fanta') ||
    combined.includes('water') ||
    combined.includes('smoothie') ||
    combined.includes('zobo') ||
    combined.includes('malt')
  ) {
    return {
      categoryType: 'drinks',
      badge: 'Chilled Beverages',
      subtitle: 'Choose serving temperature and options',
      portions: {
        title: 'Serving Temperature',
        type: 'radio',
        required: true,
        options: [
          { id: 'ice_cold', name: 'Ice Cold', price: 0, description: 'Served chilled' },
          { id: 'room_temp', name: 'Room Temperature', price: 0, description: 'Non-chilled' },
        ],
        defaultId: 'ice_cold',
      },
      sides: {
        title: 'Extras (Optional)',
        type: 'checkbox_list',
        options: [
          { id: 'ice_cup', name: 'Cup with Ice Cubes', price: 100 },
          { id: 'straw', name: 'Paper Straw & Napkin', price: 0 },
          { id: 'lime_wedge', name: 'Lemon / Lime Wedge', price: 150 },
        ],
      },
      hasInstructions: true,
    };
  }

  // ── 7. GENERAL MEALS FALLBACK ─────────────────────────────────────────────
  return {
    categoryType: 'general',
    badge: 'Dish Customization',
    subtitle: 'Customize portion size, add proteins and chef notes',
    portions: {
      title: 'Select Serving Portion',
      type: 'radio',
      required: true,
      options: [
        { id: 'regular', name: 'Regular', price: 0, description: 'Regular serving' },
        { id: 'large', name: 'Large', price: 800, description: 'Large serving (+₦800)' },
      ],
      defaultId: 'regular',
    },
    proteins: {
      title: 'Add Extra Proteins & Sides',
      type: 'counter_list',
      multi: true,
      options: RICE_PROTEINS.slice(0, 10),
    },
    sides: {
      title: 'Sides & Extras',
      type: 'checkbox_list',
      options: RICE_SIDES,
    },
    hasInstructions: true,
  };
}
