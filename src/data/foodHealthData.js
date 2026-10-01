/**
 * UrbanEats — Comprehensive Nigerian Native Foods & Health Knowledge Base
 * Complete nutritional profiles, cultural background, health talks, macronutrients, and prep tips.
 */

export const FOOD_CATEGORIES = [
  'All',
  'Delta & Native Soups',
  'Swallows & Traditional Fufu',
  'Rice & Grain Specialties',
  'Yam & Plantain Delicacies',
  'Proteins, Meats & Grills',
  'Legumes, Beans & Traditional Cakes'
];

export const NIGERIAN_FOODS = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DELTA & NATIVE SOUPS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'egusi-soup',
    name: 'Egusi Soup',
    nativeAlias: 'Melon Seed Stew / Ofe Egusi',
    category: 'Delta & Native Soups',
    calories: '450 - 580 kcal / serving',
    nutritionSummary: 'High in Protein, Healthy Lipids, Vitamin E, Zinc & Magnesium',
    benefit: 'Rebuilds muscle tissues, nourishes glowing skin, and provides long-lasting stamina.',
    badgeColor: '#EA580C',
    tag: 'Cell Renewal & Strength',
    fullDetails: {
      tagline: 'The Ultimate West African Protein & Mineral Powerhouse',
      healthTalk:
        'Egusi soup is crafted from slow-simmered, sun-dried melon seeds rich in essential vegetable oils and high-grade plant protein. When combined with traditional leafy greens such as Ugwu (fluted pumpkin), Bitterleaf, or Waterleaf, it delivers a deeply restorative nutritional profile that repairs tired muscles and protects body cells from oxidation.',
      benefits: [
        {
          title: 'Cellular Repair & Muscle Tone',
          desc: 'Rich in dietary amino acids that actively rebuild cellular tissues and sustain muscle recovery after strenuous daily activities.'
        },
        {
          title: 'Heart-Healthy Unsaturated Fats',
          desc: 'Loaded with linoleic and oleic fatty acids that assist in balancing blood lipid profiles and maintaining vascular elasticity.'
        },
        {
          title: 'Skin Radiance & Anti-Aging',
          desc: 'High concentration of Vitamin E (alpha-tocopherol) shields skin cells against harsh environmental and oxidative stress.'
        },
        {
          title: 'Bone Density & Immune Support',
          desc: 'Bioavailable magnesium, phosphorus, and zinc bolster strong bones, mental clarity, and white blood cell defense.'
        }
      ],
      macronutrients: [
        { label: 'Plant Protein', value: '18 - 24g' },
        { label: 'Healthy Fats', value: '28 - 34g' },
        { label: 'Dietary Fiber', value: '6 - 9g' },
        { label: 'Glycemic Load', value: 'Low' }
      ],
      preparationTips:
        'Ask for moderate palm oil during preparation. Increase the proportion of leafy vegetables (Ugwu/Bitterleaf) and pair with steamed fish or lean beef for an optimally balanced meal.',
      bestPairings: 'Wheat Meal, Eba (Garri), Semo, Starch, or Boiled Plantains.'
    }
  },
  {
    id: 'banga-soup',
    name: 'Banga Soup',
    nativeAlias: 'Oghwo Amiedi / Palm Nut Delicacy',
    category: 'Delta & Native Soups',
    calories: '480 - 620 kcal / serving',
    nutritionSummary: 'Rich in Vitamin A, Vitamin E (Tocotrienols), Beta-Carotene & Antioxidants',
    benefit: 'Delta State’s signature delicacy; boosts eyesight, shields brain cells, and fuels energy.',
    badgeColor: '#D97706',
    tag: 'Vision & Brain Defense',
    fullDetails: {
      tagline: 'The Crown Jewel of Delta State Heritage & Antioxidant Health',
      healthTalk:
        'Banga soup is naturally extracted from ripe palm nut pulp and infused with unique indigenous aromatics including Oburunbebe stick, Beletete leaves, and Aidan fruit. Its vivid reddish-orange hue is nature’s signature indicator of immense beta-carotene and tocotrienols (potent Vitamin E isomer), making it one of the most antioxidant-dense native soups in Nigeria.',
      benefits: [
        {
          title: 'Eye & Macular Vision Protection',
          desc: 'Abundant natural beta-carotene (pro-vitamin A) supports optimal night vision and defends eye retinas against fatigue.'
        },
        {
          title: 'Neuroprotective Tocotrienols',
          desc: 'Contains specialized Vitamin E compounds known scientifically for defending neural brain tissue against degeneration.'
        },
        {
          title: 'Deep Sustained Energy',
          desc: 'Wholesome natural lipids provide dense, slow-burning fuel ideal for busy students and hard-working professionals.'
        },
        {
          title: 'Digestive & Gut Soothing Aromatics',
          desc: 'Indigenous Delta botanicals (Beletete and Aidan) support gastric enzymes and ease digestive bloating.'
        }
      ],
      macronutrients: [
        { label: 'Vitamin A & Carotene', value: 'Very High' },
        { label: 'Healthy Fatty Acids', value: '32 - 40g' },
        { label: 'Protein (with Seafood)', value: '22 - 30g' },
        { label: 'Antioxidant Level', value: 'Peak' }
      ],
      preparationTips:
        'Skim off excess surface oil after boiling. Cook with fresh catfish, dried bonga fish, and authentic delta aromatics for maximum micronutrient density.',
      bestPairings: 'Delta Yellow Starch (Usi), Pounded Yam, Eba, or Wheat.'
    }
  },
  {
    id: 'starch-owo-soup',
    name: 'Starch and Owo Soup',
    nativeAlias: 'Usi & Owo / Delta Cultural Specialty',
    category: 'Delta & Native Soups',
    calories: '420 - 550 kcal / serving',
    nutritionSummary: 'Complex Carbohydrates, Bioavailable Calcium, Phosphorus, Native Spices',
    benefit: 'Delta’s quintessential heritage pairing; delivers smooth digestion and instant, enduring stamina.',
    badgeColor: '#CA8A04',
    tag: 'Endurance & Easy Digestion',
    fullDetails: {
      tagline: 'Authentic Urhobo & Isoko Energy Staple for Vitality',
      healthTalk:
        'Owo soup, enjoyed with steaming Delta Yellow Starch (Usi), is a revered cultural staple among the Urhobo, Isoko, and Itsekiri peoples. Crafted from palm oil, edible potash or native soda, blended crayfish, and smoked fish or bushmeat, this pairing provides clean, gluten-free carbohydrates that are easy on the stomach while delivering rich seafood minerals.',
      benefits: [
        {
          title: 'Gentle on the Digestive Tract',
          desc: 'Cassava starch undergoes smooth gelatinization during preparation, making it exceptionally light on sensitive gastrointestinal tracts.'
        },
        {
          title: 'Instant & Enduring Stamina',
          desc: 'Delivers clean glucose fueling without the heaviness or bloating associated with overly dense grain swallows.'
        },
        {
          title: 'Mineral-Rich Seafood Infusion',
          desc: 'Heavy addition of ground crayfish and smoked dry fish supplies bioavailable calcium, phosphorus, and trace iodine.'
        },
        {
          title: '100% Naturally Gluten-Free',
          desc: 'Safe, wholesome alternative for individuals with gluten sensitivities or wheat intolerances.'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '65 - 75g' },
        { label: 'Seafood Protein', value: '16 - 22g' },
        { label: 'Calcium & Minerals', value: 'High' },
        { label: 'Digestive Speed', value: 'Smooth' }
      ],
      preparationTips:
        'Use genuine unadulterated edible native potash/soda in moderation. Pair with ample dried catfish and crayfish to maximize calcium and lean protein.',
      bestPairings: 'Delta Yellow Starch (Usi), Boiled Unripe Plantains, or Boiled Yam.'
    }
  },
  {
    id: 'ofe-nsala',
    name: 'Ofe Nsala (Nsala Soup / White Soup)',
    nativeAlias: 'White Soup / Ofe Nsala with Catfish & Utazi',
    category: 'Delta & Native Soups',
    calories: '260 - 380 kcal / bowl',
    nutritionSummary: 'Oil-Free Broth, Yam Starch, Utazi Antioxidants, Omega-3 Fish Protein',
    benefit: 'A light, oil-free medicinal soup traditionally prized for post-natal rejuvenation and gentle digestion.',
    badgeColor: '#0284C7',
    tag: 'Oil-Free & Restorative',
    fullDetails: {
      tagline: 'Pure Restorative White Soup Infused with Utazi and Fresh Fish',
      healthTalk:
        'Ofe Nsala (White Soup) is an iconic Igbo and Delta native soup prepared without a single drop of palm oil. Thickened delicately with freshly mashed yam paste and flavored with aromatic spices (Uziza, Uda) and slightly bitter Utazi leaves, it delivers pure, comforting nourishment that is easy on the liver and stomach.',
      benefits: [
        {
          title: '100% Palm Oil Free',
          desc: 'Extremely light on the cardiovascular system and liver, making it an ideal choice for low-fat medical diets.'
        },
        {
          title: 'Utazi Cleansing & Blood Sugar Control',
          desc: 'Utazi leaves contain bitter glycosides that stimulate digestive bile and assist in regulating blood sugar.'
        },
        {
          title: 'Accelerated Healing & Convalescence',
          desc: 'Rich in bioavailable collagen and minerals from fresh catfish or chicken, speeding recuperation from illness.'
        },
        {
          title: 'Yam Complex Prebiotics',
          desc: 'Mashed yam thickener provides smooth soluble starch that feeds beneficial gut flora.'
        }
      ],
      macronutrients: [
        { label: 'Lean Protein', value: '26 - 34g' },
        { label: 'Fat Content', value: 'Very Low (3 - 6g)' },
        { label: 'Complex Carbs', value: '18 - 24g' },
        { label: 'Healing Score', value: 'Exceptional' }
      ],
      preparationTips:
        'Thicken with fresh boiled yam rather than processed flours. Use plenty of fresh catfish and add torn utazi leaves during the last 2 minutes of simmering.',
      bestPairings: 'Pounded Yam, Semovita, Wheat, or Eba.'
    }
  },
  {
    id: 'oha-soup',
    name: 'Oha Soup (Ora Soup)',
    nativeAlias: 'Ofe Oha / Ora Leaf Soup with Cocoyam',
    category: 'Delta & Native Soups',
    calories: '380 - 490 kcal / bowl',
    nutritionSummary: 'Cocoyam Dietary Fiber, Oha Leaf Iron, Calcium, Zinc & Beta-Carotene',
    benefit: 'Soothes the bowel, promotes strong blood count, and provides soothing mucilaginous fiber.',
    badgeColor: '#16A34A',
    tag: 'Iron Rich & Bowel Health',
    fullDetails: {
      tagline: 'Traditional Southeastern Delicacy Rich in Micronutrients and Fiber',
      healthTalk:
        'Oha (Ora) soup is cooked with tender, hand-shredded Oha leaves and thickened naturally with boiled, pounded cocoyam (ede) or achi. The leaves are rich in dietary fiber, iron, calcium, and amino acids, creating a velvety soup that bolsters the immune system and supports healthy bowel movements.',
      benefits: [
        {
          title: 'Anemia Defense & Iron Supply',
          desc: 'Fresh Oha leaves deliver non-heme iron and folate, improving hemoglobin synthesis and vitality.'
        },
        {
          title: 'Digestive Colon Motility',
          desc: 'Cocoyam and Oha fibers stimulate peristalsis, eliminating sluggish bowel movements and bloating.'
        },
        {
          title: 'Bone Matrix Strengthening',
          desc: 'Bioavailable calcium and magnesium fortify bone density in both growing youth and elderly adults.'
        },
        {
          title: 'Antioxidant Cellular Defense',
          desc: 'Rich in polyphenols that neutralize free radicals generated during stressful daily routines.'
        }
      ],
      macronutrients: [
        { label: 'Dietary Fiber', value: '8 - 12g' },
        { label: 'Protein (with Assorted Meat)', value: '24 - 30g' },
        { label: 'Healthy Fats', value: '18 - 24g' },
        { label: 'Iron & Folate', value: 'High' }
      ],
      preparationTips:
        'Always tear Oha leaves by hand rather than cutting with a knife to prevent oxidation and darkening. Cook cocoyam paste until completely smooth.',
      bestPairings: 'Pounded Yam, Cassava Fufu, Wheat, or Eba.'
    }
  },
  {
    id: 'bitterleaf-soup',
    name: 'Bitterleaf Soup (Ofe Onugbu)',
    nativeAlias: 'Ofe Onugbu / Vernonia Amygdalina Herbal Delicacy',
    category: 'Delta & Native Soups',
    calories: '360 - 480 kcal / bowl',
    nutritionSummary: 'Herbal Peptides, Potassium, Flavonoids, Detoxifying Phytochemicals',
    benefit: 'Powerhouse liver cleanser; lowers blood pressure, regulates glucose, and improves gut immunity.',
    badgeColor: '#15803D',
    tag: 'Liver Detox & Glucose Balance',
    fullDetails: {
      tagline: 'The Ancient Herbal Soup of the Ancients for Liver & Heart Health',
      healthTalk:
        'Bitterleaf Soup (Ofe Onugbu) is famous for its distinctive savory-bitter taste and remarkable medicinal properties. Prepared with thoroughly washed bitterleaf (Vernonia amygdalina) and thickened with cocoyam or achi, it is celebrated by traditional herbalists and modern nutritionists alike for its natural detoxifying properties.',
      benefits: [
        {
          title: 'Liver Detoxification & Bile Stimulation',
          desc: 'Natural bitter phytochemicals stimulate hepatic enzymes, assisting the liver in processing and filtering toxins.'
        },
        {
          title: 'Blood Sugar Regulation',
          desc: 'Bioactive sesquiterpene lactones enhance cellular insulin sensitivity and balance glycemic spikes.'
        },
        {
          title: 'Blood Pressure Reduction',
          desc: 'High potassium content aids in relaxing blood vessel walls and counteracting excess sodium in the diet.'
        },
        {
          title: 'Anti-Parasitic & Gut Defense',
          desc: 'Traditionally used to combat harmful gastrointestinal parasites and encourage a balanced microbiome.'
        }
      ],
      macronutrients: [
        { label: 'Herbal Flavonoids', value: 'Potent' },
        { label: 'Protein (with Stockfish)', value: '26 - 32g' },
        { label: 'Dietary Fiber', value: '7 - 10g' },
        { label: 'Glycemic Impact', value: 'Very Low' }
      ],
      preparationTips:
        'Wash the leaves thoroughly to moderate bitterness while preserving active herbal compounds. Simmer with stockfish, dry fish, and cocoyam paste.',
      bestPairings: 'Pounded Yam, Semo, Fufu (Akpu), or Wheat.'
    }
  },
  {
    id: 'groundnut-soup',
    name: 'Groundnut Soup (Omisagwe)',
    nativeAlias: 'Peanut Soup / Edo & Delta Omisagwe',
    category: 'Delta & Native Soups',
    calories: '490 - 640 kcal / bowl',
    nutritionSummary: 'Monounsaturated Fats, Arginine, Biotin, Plant Protein & Niacin',
    benefit: 'Nutrient-dense energy booster; supports cardiovascular blood flow and provides radiant skin.',
    badgeColor: '#B45309',
    tag: 'Cardio Arginine & Energy',
    fullDetails: {
      tagline: 'Rich Roasted Peanut Broth Packed with Arginine and Healthy Lipids',
      healthTalk:
        'Groundnut soup (Omisagwe) is a beloved native delicacy originating from Edo and Delta States. Ground roasted peanuts form a creamy, nutty base loaded with heart-healthy monounsaturated fats, arginine (a nitric oxide precursor that dilates arteries), and restorative plant protein.',
      benefits: [
        {
          title: 'Arginine & Cardiovascular Circulation',
          desc: 'High L-arginine stimulates nitric oxide production, expanding blood vessels and enhancing circulation.'
        },
        {
          title: 'Heart-Smart Monounsaturated Fats',
          desc: 'Packed with oleic acid, similar to olive oil, which helps reduce LDL cholesterol and support heart health.'
        },
        {
          title: 'Biotin for Hair, Skin & Nails',
          desc: 'Supplies abundant biotin and Vitamin E, promoting hair follicle strength and skin elasticity.'
        },
        {
          title: 'High-Calorie Recovery Fuel',
          desc: 'Provides dense, nutrient-rich fuel for athletes, active youth, and individuals recovering from weight loss.'
        }
      ],
      macronutrients: [
        { label: 'Healthy Plant Fats', value: '34 - 42g' },
        { label: 'Protein', value: '22 - 28g' },
        { label: 'Biotin & Niacin', value: 'High' },
        { label: 'Energy Density', value: 'High' }
      ],
      preparationTips:
        'Use dry-roasted peanuts with minimal added palm oil. Incorporate bitterleaf or scent leaf to balance the rich nutty sweetness.',
      bestPairings: 'Pounded Yam, Starch, Eba, or Boiled Plantains.'
    }
  },
  {
    id: 'gbegiri',
    name: 'Gbegiri Soup',
    nativeAlias: 'Yoruba Yellow Bean Soup / Abula Component',
    category: 'Delta & Native Soups',
    calories: '210 - 320 kcal / bowl',
    nutritionSummary: 'Pure Legume Protein, Soluble Fiber, Folate, Iron & Potassium',
    benefit: 'Low-fat, silky smooth bean soup that stabilizes blood sugar and nourishes muscle tissue.',
    badgeColor: '#EAB308',
    tag: 'High Legume Protein & Low Fat',
    fullDetails: {
      tagline: 'Silky Pureed Honey Beans for Blood Sugar & Muscle Wellness',
      healthTalk:
        'Gbegiri is a traditional Yoruba soup prepared from peeled, well-cooked brown or black-eyed honey beans pureed into a silky golden consistency. Commonly enjoyed as part of the famous "Abula" trio (Amala, Ewedu, and Gbegiri), it delivers concentrated plant protein, prebiotic fiber, and minerals with virtually no heavy saturated fat.',
      benefits: [
        {
          title: 'Low Glycemic & Diabetic Friendly',
          desc: 'Digestible bean starches release glucose slowly into the bloodstream, preventing glycemic spikes.'
        },
        {
          title: 'Plant Protein for Lean Muscle',
          desc: 'Delivers high-quality vegetarian amino acids that complement animal proteins in the meal.'
        },
        {
          title: 'Prebiotic Colon Nourishment',
          desc: 'Dense soluble fiber ferments in the colon to produce short-chain fatty acids (SCFAs) that protect gut walls.'
        },
        {
          title: 'Low-Calorie Nutrient Delivery',
          desc: 'Provides satisfying fullness and rich texture with minimal caloric density.'
        }
      ],
      macronutrients: [
        { label: 'Legume Protein', value: '14 - 18g' },
        { label: 'Dietary Fiber', value: '8 - 11g' },
        { label: 'Fat Content', value: 'Low (4 - 7g)' },
        { label: 'GI Score', value: 'Very Low' }
      ],
      preparationTips:
        'Peel beans thoroughly before boiling. Mash or blend to a velvety texture with moderate palm oil, iru (locust beans), and ground crayfish.',
      bestPairings: 'Amala (with Ewedu), Tuwo, or Eba.'
    }
  },
  {
    id: 'ewedu',
    name: 'Ewedu Soup',
    nativeAlias: 'Jute Leaf Draw Soup / Obe Ewedu',
    category: 'Delta & Native Soups',
    calories: '90 - 160 kcal / bowl',
    nutritionSummary: 'Beta-Carotene, Calcium, Vitamin C, Vitamin E, Iron, Mucilage Fiber',
    benefit: 'Ultra-light, enzyme-rich draw soup that enhances gut motility and protects against acid reflux.',
    badgeColor: '#16A34A',
    tag: 'Enzyme Rich & Ulcer Friendly',
    fullDetails: {
      tagline: 'Nutrient-Dense Jute Leaf Broth for Digestion and Skin Elasticity',
      healthTalk:
        'Ewedu is crafted from fresh Jute leaves (Corchorus olitorius), traditionally pureed with a small broom (Ijabe) or blender. Renowned in West African herbal medicine for its high mucilage content and exceptional antioxidant levels, Ewedu provides a protective coating for the digestive lining and is among the lowest-calorie soups in Africa.',
      benefits: [
        {
          title: 'Acid Reflux & Ulcer Relief',
          desc: 'Its natural slippery mucilage coats esophageal and stomach linings, relieving symptoms of hyperacidity and ulcers.'
        },
        {
          title: 'Collagen Synthesis & Radiant Skin',
          desc: 'Abundant in Vitamin C, Vitamin A, and Vitamin E, which stimulate skin collagen and protect from UV damage.'
        },
        {
          title: 'Smooth Bowel Transit',
          desc: 'Eases intestinal movement and prevents painful constipation, especially in pregnant mothers and elderly individuals.'
        },
        {
          title: 'Immune Boosting Micronutrients',
          desc: 'Rich in polyphenols, bioavailable iron, and zinc that activate white blood cell defenses.'
        }
      ],
      macronutrients: [
        { label: 'Caloric Density', value: 'Ultra Low (~120 kcal)' },
        { label: 'Vitamins A, C & E', value: 'Peak' },
        { label: 'Mucilage Fiber', value: 'High' },
        { label: 'Iron & Calcium', value: 'Rich' }
      ],
      preparationTips:
        'Do not over-boil jute leaves to preserve bright green color and heat-sensitive Vitamin C. Season simply with locust beans (iru) and crayfish.',
      bestPairings: 'Amala (paired with Gbegiri / Buka Stew), Semo, or Pounded Yam.'
    }
  },
  {
    id: 'ila-alasepo',
    name: 'Ila Alasepo',
    nativeAlias: 'One-Pot Mixed Seafood Okra Soup',
    category: 'Delta & Native Soups',
    calories: '280 - 410 kcal / bowl',
    nutritionSummary: 'Okra Mucilage, Marine Collagen, Omega-3s, Vitamin K, Zinc, Iodine',
    benefit: 'One-pot seafood okra loaded with marine collagen; lubricates joints and stabilizes blood sugar.',
    badgeColor: '#059669',
    tag: 'Joint Health & Marine Collagen',
    fullDetails: {
      tagline: 'Seafood-Packed One-Pot Okra for Bone, Joint and Metabolic Health',
      healthTalk:
        'Ila Alasepo is a vibrant, one-pot Nigerian okra soup cooked with an abundant medley of seafood (fresh fish, crabs, shrimps, snails) and locust beans. The synergistic combination of soluble okra fiber and rich marine collagen makes it an exceptional meal for joint lubrication, bone density, and glycemic control.',
      benefits: [
        {
          title: 'Synovial Joint Lubrication',
          desc: 'Okra mucilage combined with seafood marine collagen cushions joints and reduces arthritic stiffness.'
        },
        {
          title: 'Blood Glucose Regulation',
          desc: 'Inhibits intestinal glucose absorption, moderating post-prandial blood sugar levels.'
        },
        {
          title: 'Iodine for Thyroid Metabolism',
          desc: 'Seafood contents supply vital iodine and selenium, supporting active thyroid hormone synthesis.'
        },
        {
          title: 'Cardiovascular Plaque Defense',
          desc: 'High soluble fibers bind to excess bile acids in the gut, promoting healthy blood cholesterol levels.'
        }
      ],
      macronutrients: [
        { label: 'Marine Protein', value: '28 - 36g' },
        { label: 'Soluble Fiber', value: '7 - 10g' },
        { label: 'Marine Omega-3s', value: '1.6g' },
        { label: 'Saturated Fat', value: 'Low' }
      ],
      preparationTips:
        'Cook okra briefly on medium heat to keep its bright green crunch. Add shredded scent leaf or spinach right before turning off the heat.',
      bestPairings: 'Eba, Wheat, Amala, Semovita, or Cassava Fufu.'
    }
  },
  {
    id: 'efo-elegusi',
    name: 'Efo Elegusi',
    nativeAlias: 'Rich Vegetable Egusi Soup / Green Leaf Egusi',
    category: 'Delta & Native Soups',
    calories: '420 - 540 kcal / bowl',
    nutritionSummary: 'Chlorophyll, Plant Protein, Iron, Magnesium, Essential Fatty Acids',
    benefit: 'High-iron vegetable soup with melon seeds; builds strong blood and accelerates post-workout recovery.',
    badgeColor: '#15803D',
    tag: 'High Iron & Chlorophyll',
    fullDetails: {
      tagline: 'Vegetable-Packed Egusi Delicacy for Peak Blood Vitality and Muscle Repair',
      healthTalk:
        'Efo Elegusi is a lush variation of Egusi soup where abundant green leafy vegetables (Ugwu, Waterleaf, or Shoko) take center stage alongside grounded melon seeds. This delivers the protein and healthy lipid benefits of egusi alongside the potent blood-building chlorophyll and minerals of fresh vegetables.',
      benefits: [
        {
          title: 'Red Blood Cell Proliferation',
          desc: 'High concentration of plant iron and folate stimulates robust hemoglobin synthesis, banishing fatigue.'
        },
        {
          title: 'Balanced Lipid & Protein Profile',
          desc: 'Combines amino acids and unsaturated fatty acids from melon seeds with micronutrients from greens.'
        },
        {
          title: 'Immune & Antioxidant Boost',
          desc: 'Rich in lutein, beta-carotene, and Vitamin C, which scavenge harmful free radicals.'
        },
        {
          title: 'Sustained Satiety with Low GI',
          desc: 'Keeps you thoroughly full without creating sluggishness or erratic blood sugar drops.'
        }
      ],
      macronutrients: [
        { label: 'Plant Protein', value: '20 - 26g' },
        { label: 'Dietary Fiber', value: '8 - 12g' },
        { label: 'Chlorophyll & Iron', value: 'Peak' },
        { label: 'Healthy Fats', value: '22 - 28g' }
      ],
      preparationTips:
        'Steam vegetables gently to avoid nutrient leaching. Use smoked fish and lean beef to maximize clean protein intake.',
      bestPairings: 'Pounded Yam, Wheat Meal, Eba, or Semo.'
    }
  },
  {
    id: 'atama-soup',
    name: 'Atama Soup (Abak Atama)',
    nativeAlias: 'Efik & Ibibio Palm Fruit & Atama Leaf Delicacy',
    category: 'Delta & Native Soups',
    calories: '460 - 590 kcal / bowl',
    nutritionSummary: 'Atama Polyphenols, Palm Tocotrienols, Periwinkle Minerals, Calcium',
    benefit: 'Traditional Efik delicacy; delivers rich antioxidants, periwinkle minerals, and digestive comfort.',
    badgeColor: '#C2410C',
    tag: 'Efik Heritage & Antioxidants',
    fullDetails: {
      tagline: 'Aromatic Palm Fruit and Fresh Herb Soup from Coastal Cross River',
      healthTalk:
        'Abak Atama is an Efik/Ibibio culinary masterpiece extracted from fresh palm fruit pulp and seasoned with shredded Atama leaves (Heinsia crinita), periwinkles, stockfish, and smoked meats. The slightly fragrant, tangy Atama leaf is celebrated for its digestive stimulants and potent natural polyphenols.',
      benefits: [
        {
          title: 'Antioxidant & Tocotrienol Defense',
          desc: 'Combines the neural benefits of palm fruit tocotrienols with the herbal antioxidants of Atama leaves.'
        },
        {
          title: 'Mineral Rich Periwinkle & Seafood',
          desc: 'Provides bioavailable calcium, zinc, and phosphorus crucial for strong teeth and skeletal health.'
        },
        {
          title: 'Digestive Motility Stimulation',
          desc: 'Atama leaf phytochemicals support gastric juices and promote smooth digestive transit.'
        },
        {
          title: 'Deep Physical Vitality',
          desc: 'Provides nutrient-dense, sustained energy for physically demanding days.'
        }
      ],
      macronutrients: [
        { label: 'Healthy Fats', value: '28 - 36g' },
        { label: 'Seafood Protein', value: '24 - 32g' },
        { label: 'Calcium & Zinc', value: 'High' },
        { label: 'Flavor Index', value: 'Aromatic' }
      ],
      preparationTips:
        'Thinly shred fresh Atama leaves and bruise slightly before adding to the boiling palm extract for optimal aroma and nutrient release.',
      bestPairings: 'Cassava Fufu, Pounded Yam, Eba, or Wheat.'
    }
  },
  {
    id: 'editan-soup',
    name: 'Editan Soup',
    nativeAlias: 'Medicinal Editan Leaf Delicacy with Waterleaf',
    category: 'Delta & Native Soups',
    calories: '340 - 450 kcal / bowl',
    nutritionSummary: 'Herbal Alkaloids, Dietary Fiber, Vitamin A, Iron, Calcium',
    benefit: 'Medicinal herbal soup from Akwa Ibom; aids digestive cleansing, bowel health, and blood purification.',
    badgeColor: '#047857',
    tag: 'Medicinal Herb & Colon Cleanser',
    fullDetails: {
      tagline: 'Akwa Ibom’s Esteemed Bitter-Aromatic Herbal Wellness Soup',
      healthTalk:
        'Editan soup is prepared from the nutritious leaves of Lasianthera africana (Editan), known for its characteristic mild bitterness and immense therapeutic benefits. Often paired with waterleaf and assorted dried seafood, Editan is revered as a potent colon cleanser and natural blood purifier.',
      benefits: [
        {
          title: 'Gastrointestinal Cleansing',
          desc: 'High fiber and herbal glycosides clean the intestinal tract and eliminate toxic waste build-up.'
        },
        {
          title: 'Blood Pressure & Heart Support',
          desc: 'Phytochemicals in Editan relax peripheral blood vessels, promoting cardiovascular balance.'
        },
        {
          title: 'Blood Building & Anti-Anemic',
          desc: 'Supplies bioavailable iron and Vitamin C to support high red blood cell counts.'
        },
        {
          title: 'Natural Anti-Microbial Properties',
          desc: 'Traditionally used to fortify the body against infections and promote internal resilience.'
        }
      ],
      macronutrients: [
        { label: 'Herbal Fiber', value: '9 - 13g' },
        { label: 'Lean Protein', value: '24 - 30g' },
        { label: 'Total Fats', value: '14 - 20g' },
        { label: 'Medicinal Score', value: 'Very High' }
      ],
      preparationTips:
        'Soak cut Editan leaves in boiling water to wash out excess bitterness before cooking with waterleaf and dry fish.',
      bestPairings: 'Cassava Fufu, Semo, Eba, or Pounded Yam.'
    }
  },
  {
    id: 'fisherman-soup',
    name: 'Fisherman Soup',
    nativeAlias: 'Niger Delta Fresh Seafood Platter Soup',
    category: 'Delta & Native Soups',
    calories: '280 - 420 kcal / bowl',
    nutritionSummary: 'Marine Collagen, Omega-3s (EPA/DHA), Iodine, Zinc, Lean Seafood Protein',
    benefit: 'Loaded with fresh catfish, crabs, prawns, and snails; supercharges brain performance and joint health.',
    badgeColor: '#0284C7',
    tag: 'Marine Superfood & Brain Fuel',
    fullDetails: {
      tagline: 'The Ultimate Coastal Riverine Seafood Feast for Brain & Heart Longevity',
      healthTalk:
        'Fisherman Soup is the crowning glory of Niger Delta riverine cuisine (Delta, Rivers, Bayelsa). Made with freshly caught point-and-kill catfish, river prawns, crabs, periwinkles, and sea snails, this light palm oil broth is loaded with marine Omega-3 fatty acids, bioavailable iodine, and natural collagen.',
      benefits: [
        {
          title: 'Superior Cognitive & Memory Focus',
          desc: 'DHA and EPA fatty acids from fresh marine fish nourish brain synaptic membranes and enhance focus.'
        },
        {
          title: 'Joint Cartilage & Skin Elasticity',
          desc: 'Marine collagen from crab shells, fish bones, and snail meat repairs connective tissues and firms skin.'
        },
        {
          title: 'Thyroid Metabolism & Energy',
          desc: 'Unrivaled source of natural dietary iodine and selenium, stimulating active metabolism.'
        },
        {
          title: 'Low Saturated Fat & High Lean Protein',
          desc: 'High protein density with negligible saturated fats makes it ideal for heart longevity.'
        }
      ],
      macronutrients: [
        { label: 'Marine Protein', value: '32 - 42g' },
        { label: 'Omega-3 Fats', value: '2.4g' },
        { label: 'Marine Collagen', value: 'High' },
        { label: 'Iodine & Zinc', value: 'Peak' }
      ],
      preparationTips:
        'Use freshly harvested seafood. Thicken lightly with cocoyam paste or pounded yam, and simmer with fresh scent leaves.',
      bestPairings: 'Delta Yellow Starch, Pounded Yam, Eba, or Semo.'
    }
  },
  {
    id: 'ofe-akwu',
    name: 'Ofe Akwu',
    nativeAlias: 'Igbo Palm Nut Stew / Scent Leaf Banga Stew',
    category: 'Delta & Native Soups',
    calories: '440 - 580 kcal / serving',
    nutritionSummary: 'Beta-Carotene, Tocopherols, Scent Leaf Eugenol, Iron, Calcium',
    benefit: 'Scent-leaf infused palm nut stew; enhances respiratory clarity and protects cardiovascular tissue.',
    badgeColor: '#D97706',
    tag: 'Respiratory Health & Scent Leaf',
    fullDetails: {
      tagline: 'Aromatic Palm Fruit Stew with Fresh Scent Leaves for Rice and Swallows',
      healthTalk:
        'Ofe Akwu is the Southeastern Nigerian rendition of Banga stew, traditionally prepared with freshly extracted palm nut pulp, smoked fish, meat, and abundant fragrant Scent leaves (Nchuanwu/Efirin). The natural eugenol essential oils in scent leaves work synergistically with palm beta-carotenes to protect lung airways and stimulate healthy digestion.',
      benefits: [
        {
          title: 'Airway & Respiratory Relief',
          desc: 'Eugenol and thymol in scent leaves clear nasal passages, relieve coughs, and soothe throat inflammation.'
        },
        {
          title: 'Cardiovascular Cellular Defense',
          desc: 'Rich in tocotrienols that inhibit LDL cholesterol oxidation and defend heart arteries.'
        },
        {
          title: 'Digestive & Anti-Spasmodic Action',
          desc: 'Scent leaf aromatics soothe stomach cramps, reduce gas, and stimulate natural enzyme secretion.'
        },
        {
          title: 'Vision & Macular Health',
          desc: 'High pro-vitamin A carotenoids preserve retinal health and prevent visual fatigue.'
        }
      ],
      macronutrients: [
        { label: 'Healthy Fats', value: '28 - 35g' },
        { label: 'Protein (with Fish)', value: '22 - 28g' },
        { label: 'Carotenoids', value: 'Very High' },
        { label: 'Scent Leaf Bioactives', value: 'Potent' }
      ],
      preparationTips:
        'Add fresh, finely chopped scent leaves during the final 3 minutes of cooking to retain their volatile essential oils.',
      bestPairings: 'Boiled White Rice, Boiled Yam, Plantains, or Pounded Yam.'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. SWALLOWS & TRADITIONAL FUFU / TUWO
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'pounded-yam',
    name: 'Pounded Yam',
    nativeAlias: 'Iyan / Traditional Mortar-Pounded White Yam',
    category: 'Swallows & Traditional Fufu',
    calories: '360 - 460 kcal / wrap',
    nutritionSummary: 'Complex Carbohydrates, Potassium, Vitamin B6, Dietary Fiber, Copper',
    benefit: 'Nigeria’s king of swallows; provides rich potassium for cardiovascular endurance and mental stamina.',
    badgeColor: '#E2E8F0',
    tag: 'High Energy & King of Swallows',
    fullDetails: {
      tagline: 'The Celebrated King of West African Swallows for Enduring Strength',
      healthTalk:
        'Pounded Yam (Iyan) is prepared by boiling mature white yams and pounding them vigorously in a wooden mortar (or modern processor) into an elastic, pillowy swallow. Yam tubers are packed with complex carbohydrates, potassium, and Vitamin B6, which support heart rhythm and provide sustained physical power.',
      benefits: [
        {
          title: 'Long-Lasting Physical Stamina',
          desc: 'Complex yam starches break down steadily, providing enduring energy for active workdays and celebrations.'
        },
        {
          title: 'Potassium Blood Pressure Control',
          desc: 'High potassium content counterbalances dietary sodium, promoting relaxed blood vessels and healthy blood pressure.'
        },
        {
          title: 'Vitamin B6 for Brain & Energy Metabolism',
          desc: 'Crucial for synthesizing serotonin and dopamine, enhancing mood and mental alertness.'
        },
        {
          title: 'Hormonal Balance & Copper Support',
          desc: 'Contains natural diosgenin plant sterols and copper, which assist in hormonal balance and collagen formation.'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '78 - 88g' },
        { label: 'Dietary Fiber', value: '5 - 7g' },
        { label: 'Potassium', value: '720mg' },
        { label: 'Protein', value: '3 - 5g' }
      ],
      preparationTips:
        'Enjoy with fiber-rich vegetable soups like Egusi, Efo Riro, or Oha to balance glycemic absorption and aid smooth digestion.',
      bestPairings: 'Egusi Soup, Banga Soup, Ofe Nsala, Oha Soup, or Bitterleaf Soup.'
    }
  },
  {
    id: 'amala',
    name: 'Amala (Amala Dudu / Isu)',
    nativeAlias: 'Yam Flour Swallow / Elubo Dudu',
    category: 'Swallows & Traditional Fufu',
    calories: '280 - 360 kcal / wrap',
    nutritionSummary: 'Low Glycemic Index, Resistant Starch, Dietary Fiber, Iron, Potassium',
    benefit: 'The gold standard for low-GI swallows; highly recommended for blood sugar management and easy digestion.',
    badgeColor: '#475569',
    tag: 'Low Glycemic & Diabetic Friendly',
    fullDetails: {
      tagline: 'The Famous Low-GI Black Yam Flour Swallow for Digestive Health',
      healthTalk:
        'Amala is made from sun-dried, fermented yam peels (Elubo Dudu) turned into a light, dark-brown swallow with boiling water. The unique curing and drying process converts standard starch into beneficial resistant starch, resulting in a low glycemic index that makes Amala a favorite among health professionals and diabetic patients.',
      benefits: [
        {
          title: 'Remarkably Low Glycemic Index',
          desc: 'Slowly digested resistant starches prevent blood glucose spikes, making it the safest swallow for diabetics.'
        },
        {
          title: 'High Prebiotic Resistant Starch',
          desc: 'Reaches the large intestine intact, feeding beneficial probiotic bacteria and optimizing colon integrity.'
        },
        {
          title: 'Digestive Lightness & Low Bloating',
          desc: 'Unlike heavy grain swallows, Amala is light on the digestive tract and prevents post-meal sluggishness.'
        },
        {
          title: 'Cardiovascular & Lipid Support',
          desc: 'Rich in dietary fiber and polyphenols that assist in lowering serum LDL cholesterol levels.'
        }
      ],
      macronutrients: [
        { label: 'Resistant Fiber', value: '8 - 12g' },
        { label: 'Complex Carbs', value: '58 - 66g' },
        { label: 'Glycemic Index', value: 'Low' },
        { label: 'Digestive Speed', value: 'Light & Fast' }
      ],
      preparationTips:
        'Whisk smoothly into hot water without lumps. Pair traditionally with Ewedu, Gbegiri, and Buka stew for a complete nutritional balance.',
      bestPairings: 'Gbegiri & Ewedu (Abula), Okro Soup, Ogbono, or Efo Riro.'
    }
  },
  {
    id: 'fufu-akpu',
    name: 'Fufu (Akpu / Cassava Fufu)',
    nativeAlias: 'Fermented Cassava Fufu / Akpu / Santana',
    category: 'Swallows & Traditional Fufu',
    calories: '310 - 390 kcal / wrap',
    nutritionSummary: 'Fermented Probiotics, 100% Gluten-Free, High Energy Starch, Resistant Carbs',
    benefit: 'Fermented cassava swallow; completely gluten-free, easily digested, and provides sustained endurance.',
    badgeColor: '#CBD5E1',
    tag: '100% Gluten-Free & Probiotic Fermented',
    fullDetails: {
      tagline: 'Traditional Fermented Cassava Swallow for Gut Resilience and Energy',
      healthTalk:
        'Fufu (Akpu) is prepared by soaking peeled cassava roots in water for several days to undergo natural lactic acid fermentation, followed by pounding or cooking into a smooth, elastic white dough. The natural fermentation process degrades cyanogenic compounds, synthesizes B-vitamins, and makes it 100% gluten-free and easy on the stomach.',
      benefits: [
        {
          title: '100% Gluten-Free Gut Safety',
          desc: 'Completely grain-free and gluten-free, eliminating intestinal inflammation for individuals with celiac disease.'
        },
        {
          title: 'Fermentation Probiotic Benefits',
          desc: 'Lactic acid fermentation breaks down complex starches and improves mineral bioavailability.'
        },
        {
          title: 'Enduring Physical Endurance',
          desc: 'Supplies steady glycogen fuel for hard-working days without causing digestive heaviness.'
        },
        {
          title: 'Low Fat & Clean Carbohydrate',
          desc: 'Contains virtually zero saturated fat or cholesterol, serving as a clean energy carrier.'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '68 - 78g' },
        { label: 'Fat Content', value: '< 0.5g' },
        { label: 'Fermented Fiber', value: '4 - 6g' },
        { label: 'Gluten', value: '0% (Free)' }
      ],
      preparationTips:
        'Cook thoroughly until smooth and translucent. Consume in moderate portions paired with leafy vegetable soups.',
      bestPairings: 'Oha Soup, Bitterleaf Soup, Egusi Soup, Banga Soup, or Nsala.'
    }
  },
  {
    id: 'oat-fufu',
    name: 'Oat Fufu',
    nativeAlias: 'Rolled Oats Swallow / Whole Grain Oatmeal Fufu',
    category: 'Swallows & Traditional Fufu',
    calories: '270 - 340 kcal / wrap',
    nutritionSummary: 'Soluble Beta-Glucan, Plant Protein, B-Vitamins, Magnesium, Iron',
    benefit: 'The modern heart-healthy swallow; binds bad cholesterol, stabilizes blood sugar, and provides high fiber.',
    badgeColor: '#E2E8F0',
    tag: 'Beta-Glucan & Heart Smart',
    fullDetails: {
      tagline: 'Modern Whole Grain Oat Swallow for Cholesterol & Glucose Control',
      healthTalk:
        'Oat Fufu is made by blending 100% whole rolled oats into flour and cooking with hot water into a smooth, pliable swallow. It is renowned in modern clinical nutrition for its dense beta-glucan soluble fiber, which traps dietary cholesterol in the digestive tract and prevents blood glucose spikes.',
      benefits: [
        {
          title: 'Cholesterol Reduction via Beta-Glucan',
          desc: 'Soluble oat beta-glucan forms a gel in the digestive tract that binds to bile acids, significantly lowering blood LDL cholesterol.'
        },
        {
          title: 'Superior Glycemic & Insulin Control',
          desc: 'Slow-digesting complex carbohydrates ensure a gradual release of sugar into the bloodstream.'
        },
        {
          title: 'Prolonged Satiation & Weight Management',
          desc: 'Expands in the stomach to keep you feeling full for hours, suppressing cravings for snacks.'
        },
        {
          title: 'Higher Plant Protein Density',
          desc: 'Contains nearly double the protein of traditional cassava or yam swallows, aiding muscle repair.'
        }
      ],
      macronutrients: [
        { label: 'Beta-Glucan Fiber', value: '8 - 12g' },
        { label: 'Plant Protein', value: '11 - 15g' },
        { label: 'Complex Carbs', value: '52 - 60g' },
        { label: 'Heart Health Score', value: 'Peak' }
      ],
      preparationTips:
        'Blend rolled oats finely. Stir continuously in boiling water until it forms a smooth, lump-free ball.',
      bestPairings: 'Egusi Soup, Okro Soup, Efo Riro, or Banga Soup.'
    }
  },
  {
    id: 'wheat-meal-swallow',
    name: 'Wheat Meal (Swallow)',
    nativeAlias: '100% Whole Wheat Swallow',
    category: 'Swallows & Traditional Fufu',
    calories: '290 - 360 kcal / wrap',
    nutritionSummary: 'High Insoluble & Soluble Fiber, B-Complex Vitamins, Magnesium, Iron',
    benefit: 'Promotes heart health, aids slow glucose release, and keeps the digestive colon clean.',
    badgeColor: '#854D0E',
    tag: 'Fiber Rich & Heart Smart',
    fullDetails: {
      tagline: 'Whole Grain Health-Conscious Swallow for Balanced Glycemic Control',
      healthTalk:
        'Whole wheat meal swallow is produced from 100% ground unrefined whole wheat grains, preserving the nutrient-packed bran and germ layers. Highly recommended by medical practitioners for managing blood glucose, maintaining healthy blood pressure, and preventing intestinal sluggishness.',
      benefits: [
        {
          title: 'Stable Blood Sugar & Low GI',
          desc: 'Dense bran fibers slow carbohydrate absorption into the bloodstream, preventing dangerous insulin spikes.'
        },
        {
          title: 'Colon Health & Regularity',
          desc: 'Insoluble fiber adds bulk to stools and speeds gastrointestinal transit, effectively preventing constipation.'
        },
        {
          title: 'Cholesterol Reduction',
          desc: 'Soluble beta-glucans and plant sterols bind to dietary cholesterol in the gut, reducing circulating LDL levels.'
        },
        {
          title: 'Extended Satiation',
          desc: 'Keeps you feeling nourished and full for hours, suppressing cravings for sugary snacks and fast foods.'
        }
      ],
      macronutrients: [
        { label: 'Dietary Fiber', value: '9 - 13g' },
        { label: 'Plant Protein', value: '10 - 14g' },
        { label: 'Complex Carbs', value: '58 - 66g' },
        { label: 'Glycemic Index', value: 'Low - Medium' }
      ],
      preparationTips:
        'Stir vigorously into boiling water until thoroughly cooked. Do not add butter or refined fats. Pair with vegetable-dense soups.',
      bestPairings: 'Egusi Soup, Vegetable Soup (Efo Riro), Banga Soup, or Bitterleaf Soup.'
    }
  },
  {
    id: 'semovita',
    name: 'Semovita (Semo)',
    nativeAlias: 'Durum Wheat Semolina Swallow',
    category: 'Swallows & Traditional Fufu',
    calories: '310 - 380 kcal / wrap',
    nutritionSummary: 'Complex Carbohydrates, Plant Protein, Iron, Folate (Vitamin B9)',
    benefit: 'Smooth, easy-to-digest swallow that sustains endurance and supports cellular renewal.',
    badgeColor: '#D97706',
    tag: 'Silky Smooth & Nutritious',
    fullDetails: {
      tagline: 'Delightfully Smooth Swallow for Easy Digestion & Sustained Energy',
      healthTalk:
        'Semo (semovita) is crafted from purified durum wheat middlings. Loved across Nigerian households for its lump-free, velvety smooth texture, it provides quick-acting nutrition fortified with iron and folate, making it gentle on the stomach and comforting after a busy day.',
      benefits: [
        {
          title: 'Smooth & Effortless Digestion',
          desc: 'Significantly lighter on the stomach than fibrous roots, eliminating heavy post-meal lethargy.'
        },
        {
          title: 'Folate (B9) for Cell Generation',
          desc: 'Supplies essential folate, which assists in red blood cell generation, DNA repair, and maternal health.'
        },
        {
          title: 'Reliable Athletic Energy Output',
          desc: 'Supplies complex carbohydrates that release steady energy for sports, lectures, and daily errands.'
        },
        {
          title: 'Iron-Fortified Blood Support',
          desc: 'Helps combat anemia and promotes healthy oxygen circulation through all bodily organs.'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '68 - 76g' },
        { label: 'Plant Protein', value: '7 - 10g' },
        { label: 'Folate & Iron', value: 'Fortified' },
        { label: 'Texture Factor', value: 'Ultra Smooth' }
      ],
      preparationTips:
        'Dissolve in a little cold water first before stirring into boiling water to ensure a lump-free texture. Pair with fiber-dense soups to balance absorption.',
      bestPairings: 'Egusi Soup, Owo Soup, Banga Soup, Seafood Okro, or Ogbono.'
    }
  },
  {
    id: 'tuwo-shinkafa',
    name: 'Tuwo Shinkafa',
    nativeAlias: 'Northern Nigerian Rice Swallow',
    category: 'Swallows & Traditional Fufu',
    calories: '300 - 390 kcal / wrap',
    nutritionSummary: 'Soft Starch, Easily Digestible Carbohydrates, Zero Gluten, Low Fiber',
    benefit: 'Ultra-soft Northern delicacy; exceptionally gentle on ulcers and sensitive stomachs.',
    badgeColor: '#F8FAFC',
    tag: 'Gentle on Gut & Ulcer Safe',
    fullDetails: {
      tagline: 'Soft, Soothing Northern Rice Swallow for Delicate Stomachs',
      healthTalk:
        'Tuwo Shinkafa is a revered Northern Nigerian staple made by over-boiling short-grain or broken rice into a soft mush and mashing it into a pillowy, tender swallow. Because it is completely gluten-free and very low in coarse roughage, it is widely recommended for recuperating patients and individuals with gastritis or ulcers.',
      benefits: [
        {
          title: 'Ultra Gentle on Inflamed Stomachs',
          desc: 'The soft gelatinized rice starch soothes gastric walls without causing irritation or hyperacidity.'
        },
        {
          title: '100% Gluten-Free Energy',
          desc: 'Safe for anyone with wheat sensitivities, delivering smooth carbohydrates for daily activities.'
        },
        {
          title: 'Rapid Nutrient Absorption',
          desc: 'Breaks down quickly in the digestive tract, allowing fast refueling of glycogen reserves.'
        },
        {
          title: 'Hypoallergenic Nutritional Profile',
          desc: 'One of the least allergic food staples in the world, ideal for all age groups.'
        }
      ],
      macronutrients: [
        { label: 'Digestible Carbs', value: '66 - 74g' },
        { label: 'Protein', value: '5 - 7g' },
        { label: 'Fat Content', value: '< 1g' },
        { label: 'Digestive Ease', value: 'Maximum' }
      ],
      preparationTips:
        'Cook short-grain rice with plenty of water until very soft, then mash thoroughly with a wooden paddle.',
      bestPairings: 'Miyan Kuka, Miyan Geda (Groundnut Soup), Miyan Taushe, or Egusi Soup.'
    }
  },
  {
    id: 'tuwo-masara',
    name: 'Tuwo Masara',
    nativeAlias: 'Corn / Maize Meal Swallow',
    category: 'Swallows & Traditional Fufu',
    calories: '310 - 400 kcal / wrap',
    nutritionSummary: 'Zeaxanthin, Lutein, Insoluble Fiber, Phosphorus, Magnesium',
    benefit: 'Whole corn swallow rich in eye-protecting carotenoids; supports colon regularity.',
    badgeColor: '#FEF08A',
    tag: 'Eye Carotenoids & Colon Health',
    fullDetails: {
      tagline: 'Wholesome Northern Corn Meal Swallow for Vision and Daily Vitality',
      healthTalk:
        'Tuwo Masara is prepared from finely milled white or yellow maize (corn) flour cooked into a thick, satisfying swallow. It contains substantial amounts of eye-protecting antioxidants (lutein and zeaxanthin) and insoluble corn fiber, which supports healthy colon regularity.',
      benefits: [
        {
          title: 'Macular Vision Shield (Lutein & Zeaxanthin)',
          desc: 'Carotenoids in corn filter harmful blue light and protect eye retinas from macular degeneration.'
        },
        {
          title: 'Bowel Regularity & Insoluble Fiber',
          desc: 'Adds bulk to the stool, promoting efficient waste elimination and preventing constipation.'
        },
        {
          title: 'Bone Mineralization (Phosphorus)',
          desc: 'Supplies bioavailable phosphorus and magnesium to maintain strong skeletal matrix.'
        },
        {
          title: 'Gluten-Free Sustained Power',
          desc: 'Natural gluten-free grain swallow that fuels heavy physical output and sports.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '68 - 76g' },
        { label: 'Dietary Fiber', value: '6 - 9g' },
        { label: 'Lutein / Zeaxanthin', value: 'High' },
        { label: 'Protein', value: '6 - 8g' }
      ],
      preparationTips:
        'Whisk corn flour into boiling water and simmer thoroughly on low heat so the grain starches cook fully.',
      bestPairings: 'Miyan Taushe (Pumpkin Soup), Miyan Kuka, Okro Soup, or Gbegiri.'
    }
  },
  {
    id: 'tuwo-dawa',
    name: 'Tuwo Dawa',
    nativeAlias: 'Guinea Corn / Sorghum Swallow',
    category: 'Swallows & Traditional Fufu',
    calories: '280 - 360 kcal / wrap',
    nutritionSummary: 'Anthocyanins, Polyphenols, High Fiber, Iron, Calcium, Copper',
    benefit: 'Ancient African sorghum grain; exceptional antioxidant capacity, low GI, and strong blood-building power.',
    badgeColor: '#991B1B',
    tag: 'Sorghum Super-Grain & Low GI',
    fullDetails: {
      tagline: 'Ancient Super-Grain Swallow Loaded with Protective Polyphenols',
      healthTalk:
        'Tuwo Dawa is crafted from whole guinea corn (Sorghum bicolor), an indigenous African grain renowned for its deep reddish-purple antioxidant anthocyanins. Sorghum has a lower glycemic index than maize or refined grains, making it a nutritional powerhouse for blood sugar balance and cardiovascular protection.',
      benefits: [
        {
          title: 'High Antioxidant Anthocyanins',
          desc: 'Dark sorghum pigments possess superior free-radical scavenging ability compared to blueberries and pomegranates.'
        },
        {
          title: 'Superior Diabetic Blood Sugar Control',
          desc: 'Sorghum tannins and high fiber retard starch hydrolysis, keeping post-meal blood sugar exceptionally stable.'
        },
        {
          title: 'Iron & Blood Building Power',
          desc: 'Traditional staple for increasing hemoglobin levels and preventing iron-deficiency anemia.'
        },
        {
          title: 'Gluten-Free Cardiovascular Ally',
          desc: 'Natural plant sterols assist in reducing gut absorption of dietary cholesterol.'
        }
      ],
      macronutrients: [
        { label: 'Polyphenol Level', value: 'Exceptional' },
        { label: 'Dietary Fiber', value: '9 - 14g' },
        { label: 'Protein', value: '8 - 11g' },
        { label: 'Glycemic Index', value: 'Low' }
      ],
      preparationTips:
        'Use unrefined whole-grain sorghum flour. Cook with continuous stirring to produce a smooth, cohesive swallow.',
      bestPairings: 'Miyan Kuka, Miyan Taushe, Ogbono, or Bitterleaf Soup.'
    }
  },
  {
    id: 'plantain-fufu',
    name: 'Plantain Fufu',
    nativeAlias: 'Unripe Plantain Flour Swallow / Amala Ogede',
    category: 'Swallows & Traditional Fufu',
    calories: '260 - 330 kcal / wrap',
    nutritionSummary: 'Resistant Starch Type 2, Potassium, Vitamin A, Vitamin B6, Magnesium',
    benefit: 'The #1 recommended swallow for diabetic diets; low glycemic load and supports cardiovascular health.',
    badgeColor: '#84CC16',
    tag: 'Diabetic Gold Standard & Potassium',
    fullDetails: {
      tagline: 'Unripe Green Plantain Swallow for Blood Sugar Mastery and Heart Health',
      healthTalk:
        'Plantain Fufu is made from 100% dehydrated and ground unripe (green) plantains. Unripe plantains are rich in Type 2 Resistant Starch, which bypasses small-intestine digestion and functions like soluble fiber, making it the undisputed gold standard swallow for diabetic management and weight loss.',
      benefits: [
        {
          title: 'Superior Blood Sugar Mastery',
          desc: 'Resistant starch prevents insulin surges, making it the premier swallow recommended by endocrinologists.'
        },
        {
          title: 'Potassium Heart & Blood Pressure Defense',
          desc: 'Dense potassium content relaxes blood vessel walls and protects against hypertension.'
        },
        {
          title: 'Gut Microbiome Colon Cleanser',
          desc: 'Ferments into butyrate in the colon, which fortifies the gut barrier and suppresses inflammation.'
        },
        {
          title: 'Low Caloric Density for Fat Loss',
          desc: 'Supplies substantial physical fullness while containing significantly fewer calories than tuber swallows.'
        }
      ],
      macronutrients: [
        { label: 'Resistant Starch', value: '14 - 18g' },
        { label: 'Potassium', value: '620mg' },
        { label: 'Glycemic Index', value: 'Very Low' },
        { label: 'Calories', value: 'Low (~280 kcal)' }
      ],
      preparationTips:
        'Whisk pure unripe plantain flour into cold water first, then stir on medium heat until thick and translucent.',
      bestPairings: 'Seafood Okro, Vegetable Soup (Efo Riro), Ofe Nsala, or Egusi.'
    }
  },
  {
    id: 'eba-garri-swallow',
    name: 'Eba (Garri)',
    nativeAlias: 'Yellow / White Garri Swallow',
    category: 'Swallows & Traditional Fufu',
    calories: '330 - 410 kcal / wrap',
    nutritionSummary: 'High Energy Carbohydrates, Soluble Fiber, Probiotic Fermentation Trace Minerals',
    benefit: 'Quick and deeply satisfying staple swallow that provides immediate stamina and digestive fullness.',
    badgeColor: '#059669',
    tag: 'Quick Stamina & Satiety',
    fullDetails: {
      tagline: 'The Legendary Quick-Fuel Cassava Swallow of West Africa',
      healthTalk:
        'Eba is prepared by stirring roasted fermented cassava granules (Garri) into boiling water until it reaches a smooth, elastic consistency. The traditional fermentation process degrades cassava cyanogenic glucosides while enhancing dietary digestibility, creating a gluten-free swallow that fuels intense physical and mental work.',
      benefits: [
        {
          title: 'Sustained Physical Stamina',
          desc: 'Supplies steady glucose release that powers students through long lecture halls and manual workers through high-output tasks.'
        },
        {
          title: '100% Gluten-Free & Celiac Safe',
          desc: 'Completely free from wheat gluten, eliminating gut irritation for people suffering from celiac or wheat sensitivity.'
        },
        {
          title: 'Fermentation Digestive Ease',
          desc: 'Traditional multi-day lactic acid fermentation breaks down complex starches, making it easier on intestinal flora.'
        },
        {
          title: 'Fast Fullness & Appetite Satiety',
          desc: 'Expands in the stomach to trigger stretch receptors, effectively staving off hunger pangs throughout long days.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '72 - 82g' },
        { label: 'Dietary Fiber', value: '4 - 6g' },
        { label: 'Protein', value: '2 - 4g' },
        { label: 'Fat', value: '< 1g' }
      ],
      preparationTips:
        'Practice portion moderation (1 to 1.5 fist-sized wraps). Always pair with high-vegetable soups (Efo Riro, Afang, or Okro) to balance your meal’s glycemic load.',
      bestPairings: 'Egusi Soup, Banga Soup, Okro Soup, Ogbono, or Afang Soup.'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. RICE & GRAIN SPECIALTIES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'ofada-rice-ayamase',
    name: 'Ofada Rice & Ayamase',
    nativeAlias: 'Unpolished Native Brown Rice with Designer Stew',
    category: 'Rice & Grain Specialties',
    calories: '420 - 560 kcal / plate',
    nutritionSummary: 'Whole Grain Bran Fiber, Vitamin B1 (Thiamine), Zinc, Green Pepper Capsaicin, Iru',
    benefit: 'Unpolished indigenous brown rice; lowers diabetes risk, boosts metabolism, and provides natural B-vitamins.',
    badgeColor: '#65A30D',
    tag: 'Whole Grain Bran & Metabolism',
    fullDetails: {
      tagline: 'Nutrient-Dense Indigenous Brown Rice with Spicy Green Pepper Stew',
      healthTalk:
        'Ofada Rice is an indigenous, unpolished West African short-grain rice retaining its natural bran and germ layers. Paired with Ayamase (Designer pepper stew made from green peppers, bleached palm oil, locust beans, and assorted meats), it provides vastly superior dietary fiber, Vitamin B1 (thiamine), and zinc compared to polished white rice.',
      benefits: [
        {
          title: 'Whole Grain Bran Fiber & Lower GI',
          desc: 'Unpolished bran prevents rapid carbohydrate breakdown, significantly reducing the risk of Type 2 diabetes.'
        },
        {
          title: 'B-Vitamins & Cognitive Nerve Energy',
          desc: 'Rich in Vitamin B1 (thiamine) and B6, vital for converting glucose into brain energy and preventing nerve fatigue.'
        },
        {
          title: 'Capsaicin & Locust Bean Gut Flora',
          desc: 'Green scotch bonnets and fermented Iru deliver thermogenic fat-burning capsaicin and probiotic health.'
        },
        {
          title: 'Immune Zinc & Magnesium',
          desc: 'High zinc content supports immune cellular repair, wound healing, and hormonal balance.'
        }
      ],
      macronutrients: [
        { label: 'Whole Bran Fiber', value: '7 - 10g' },
        { label: 'Complex Carbs', value: '52 - 62g' },
        { label: 'Protein (with Meats)', value: '22 - 30g' },
        { label: 'Thiamine (B1)', value: 'High' }
      ],
      preparationTips:
        'Wash Ofada rice thoroughly to remove natural dust, then boil until tender. Moderate bleached palm oil in Ayamase stew.',
      bestPairings: 'Ayamase Stew, Boiled Eggs, Fried Plantain (Dodo), or Steamed Fish.'
    }
  },
  {
    id: 'coconut-rice',
    name: 'Coconut Rice',
    nativeAlias: 'Simmered Fresh Coconut Milk Rice',
    category: 'Rice & Grain Specialties',
    calories: '380 - 510 kcal / plate',
    nutritionSummary: 'Medium-Chain Triglycerides (MCTs), Lauric Acid, Manganese, Clean Energy',
    benefit: 'Simmered in natural coconut milk; delivers healthy MCT fats for rapid brain energy and immune defense.',
    badgeColor: '#0EA5E9',
    tag: 'Lauric Acid & Fast Brain Fuel',
    fullDetails: {
      tagline: 'Infused with Fresh Coconut Milk for Rapid Mental Clarity and Immunity',
      healthTalk:
        'Coconut Rice is prepared by simmering parboiled rice in freshly extracted coconut milk, savory meat stock, and aromatic herbs. Natural coconut milk contains Medium-Chain Triglycerides (MCTs)—healthy fats that travel directly to the liver to be converted into immediate mental and physical energy rather than stored as fat.',
      benefits: [
        {
          title: 'MCT Fats for Immediate Brain Energy',
          desc: 'Medium-chain triglycerides are rapidly oxidized by the liver into ketones, enhancing cognitive stamina.'
        },
        {
          title: 'Lauric Acid Anti-Microbial Defense',
          desc: 'Coconut fat converts into monolaurin, a natural substance that helps combat harmful bacteria and viruses.'
        },
        {
          title: 'Manganese for Bone & Enzyme Support',
          desc: 'Provides abundant manganese, essential for bone structure, antioxidant defense, and fat metabolism.'
        },
        {
          title: 'Smooth Satiety & Appetite Control',
          desc: 'Wholesome coconut lipids slow stomach emptying, curbing impulsive hunger between study or work hours.'
        }
      ],
      macronutrients: [
        { label: 'MCT Healthy Fats', value: '18 - 24g' },
        { label: 'Complex Carbs', value: '54 - 62g' },
        { label: 'Protein (with Chicken)', value: '20 - 26g' },
        { label: 'Lauric Acid', value: 'High' }
      ],
      preparationTips:
        'Extract milk from freshly grated mature coconuts rather than using artificial canned additives. Add chopped carrots and peppers.',
      bestPairings: 'Grilled Chicken, Peppered Fish, Coleslaw, or Steamed Shrimp.'
    }
  },
  {
    id: 'palm-oil-rice',
    name: 'Palm Oil Rice (Concoction Rice)',
    nativeAlias: 'Native Jollof / Native Concoction Rice',
    category: 'Rice & Grain Specialties',
    calories: '390 - 520 kcal / plate',
    nutritionSummary: 'Beta-Carotene, Tocopherols, Scent Leaf Eugenol, Crayfish Calcium, Smoked Fish',
    benefit: 'One-pot native rice rich in Vitamin A and seafood minerals; fuels physical endurance.',
    badgeColor: '#D97706',
    tag: 'Beta-Carotene & Native Minerals',
    fullDetails: {
      tagline: 'Traditional One-Pot Native Rice Infused with Palm Oil, Scent Leaf and Crayfish',
      healthTalk:
        'Palm Oil Rice (Native Concoction Rice / Iwuk Edesi) is an authentic village-style one-pot rice cooked with pure unbleached red palm oil, ground crayfish, smoked dry fish, locust beans (iru), and freshly shredded scent leaves. It delivers rich pro-vitamin A and bone-strengthening seafood minerals in every bite.',
      benefits: [
        {
          title: 'Pro-Vitamin A & Eye Longevity',
          desc: 'Natural unbleached palm oil provides intense carotenoids that protect eyesight and reinforce epithelial barriers.'
        },
        {
          title: 'Bioavailable Seafood Calcium & Zinc',
          desc: 'Abundant dry fish and ground crayfish provide organic calcium and trace minerals that strengthen bones.'
        },
        {
          title: 'Scent Leaf & Iru Gut Fermentation',
          desc: 'Locust beans and scent leaves promote healthy digestion and ease gastrointestinal cramps.'
        },
        {
          title: 'Clean Whole-Meal Nourishment',
          desc: 'A complete one-pot meal that balances carbohydrates, marine proteins, and healthy lipids.'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '58 - 66g' },
        { label: 'Healthy Lipids', value: '16 - 22g' },
        { label: 'Seafood Protein', value: '18 - 24g' },
        { label: 'Vitamin A', value: 'Very High' }
      ],
      preparationTips:
        'Use unadulterated red palm oil. Load with plenty of dried catfish, crayfish, and finish with torn fresh scent leaves.',
      bestPairings: 'Boiled Eggs, Smoked Fish, Fried Plantains (Dodo), or Peppered Snails.'
    }
  },
  {
    id: 'banga-rice',
    name: 'Banga Rice',
    nativeAlias: 'Palm Fruit Infused Rice / Delta Native Rice',
    category: 'Rice & Grain Specialties',
    calories: '440 - 580 kcal / plate',
    nutritionSummary: 'Palm Nut Tocotrienols, Beta-Carotene, Indigenous Delta Spices, Marine Collagen',
    benefit: 'Rice simmered in rich palm fruit extract; delivers powerful antioxidants and lasting energy.',
    badgeColor: '#EA580C',
    tag: 'Antioxidant Rich & Delta Flavor',
    fullDetails: {
      tagline: 'Delta State’s Signature Palm Fruit Rice for Sustained Physical Stamina',
      healthTalk:
        'Banga Rice is an exquisite Delta delicacy where parboiled rice is cooked directly in concentrated palm fruit extract (Oghwo Amiedi) and native aromatics (Oburunbebe stick, Beletete, dried fish, and crayfish). It marries the brain-protecting tocotrienols of palm fruit with the sustained energy of parboiled rice.',
      benefits: [
        {
          title: 'Brain-Defending Tocotrienols',
          desc: 'Potent Vitamin E isomers shield cerebral blood vessels and brain cells from oxidative damage.'
        },
        {
          title: 'High-Output Physical Energy',
          desc: 'Combines dense lipids with complex carbs to provide multi-hour stamina for demanding workloads.'
        },
        {
          title: 'Mineral-Rich Marine Infusion',
          desc: 'Cooked with abundant crayfish and dried catfish, supplying bioavailable iodine, zinc, and phosphorus.'
        },
        {
          title: 'Anti-Inflammatory Native Botanicals',
          desc: 'Traditional Delta spices stimulate gastric enzymes and reduce internal inflammation.'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '60 - 70g' },
        { label: 'Palm Lipids', value: '20 - 26g' },
        { label: 'Protein (with Fish)', value: '18 - 25g' },
        { label: 'Antioxidant Score', value: 'High' }
      ],
      preparationTips:
        'Skim off excess surface oil from the palm nut extract before adding the rice. Cook with smoked catfish and dry bonga fish.',
      bestPairings: 'Fresh Catfish Pepper Soup, Grilled Chicken, or Boiled Eggs.'
    }
  },
  {
    id: 'white-rice-stew',
    name: 'White Rice',
    nativeAlias: 'Parboiled Rice & Fresh Tomato/Vegetable Stew',
    category: 'Rice & Grain Specialties',
    calories: '320 - 460 kcal / plate',
    nutritionSummary: 'Pure Clean Energy Carbs, Iron, B-Vitamins, Lycopene (from Stew)',
    benefit: 'Readily digestible carbohydrate staple that quickly refuels glycogen reserves without stomach stress.',
    badgeColor: '#2563EB',
    tag: 'Quick Glycogen Refuel',
    fullDetails: {
      tagline: 'Clean Everyday Carbohydrate Fuel for Maximum Productivity',
      healthTalk:
        'White rice is the versatile centerpiece of Nigerian meals. When parboiled properly to remove surface starch and accompanied by rich tomato-pepper stew or vegetable sauce (Efo Riro), it supplies readily accessible carbohydrates that power cognitive tasks, workouts, and busy campus schedules.',
      benefits: [
        {
          title: 'Rapid Energy Replenishment',
          desc: 'Easily digestible carbohydrates that rapidly restore depleted muscle and liver glycogen after intensive work or study.'
        },
        {
          title: 'Low Allergy & Stomach Friendly',
          desc: 'Free from gluten and irritating FODMAPs, making it gentle on individuals prone to bloating, ulcers, or digestive upset.'
        },
        {
          title: 'Lycopene Antioxidant Infusion',
          desc: 'Simmered red tomato and pepper stew delivers cooked lycopene, supporting prostate health and cardiovascular wellness.'
        },
        {
          title: 'Versatile Nutrient Matrix',
          desc: 'Acts as the perfect carrier for high-fiber side dishes including stewed beans, steamed vegetables, and lean grilled proteins.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '58 - 68g' },
        { label: 'Protein (with Stew)', value: '14 - 20g' },
        { label: 'Dietary Fat', value: '8 - 14g' },
        { label: 'Digestion Time', value: 'Fast' }
      ],
      preparationTips:
        'Always wash and parboil rice before cooking. Moderate the oil used in the accompanying stew and pair with boiled eggs, beans, or fresh steamed vegetables.',
      bestPairings: 'Fresh Vegetable Stew, Stewed Beans, Fried/Boiled Plantains, Grilled Fish or Chicken.'
    }
  },
  {
    id: 'fried-rice-party',
    name: 'Fried Rice',
    nativeAlias: 'Nigerian Party Veggie Fried Rice',
    category: 'Rice & Grain Specialties',
    calories: '360 - 490 kcal / plate',
    nutritionSummary: 'Beta-Carotene, Dietary Fiber, Vitamin C, Vitamin A, Turmeric Curcumin',
    benefit: 'Packed with colorful fresh vegetables (carrots, green peas, sweet corn) and antioxidant herbs.',
    badgeColor: '#16A34A',
    tag: 'Vitamins & Antioxidants',
    fullDetails: {
      tagline: 'Savory Vegetable-Loaded Rice for Comprehensive Micronutrition',
      healthTalk:
        'Nigerian Fried Rice is stir-fried in rich, seasoned chicken stock and tossed with crunchy diced carrots, green peas, sweet corn, green bell peppers, and liver/protein tidbits. The inclusion of turmeric and curry spices introduces curcumin—a potent natural antioxidant and anti-inflammatory compound.',
      benefits: [
        {
          title: 'Immune & Eye Health Micronutrients',
          desc: 'Carrots and green peas provide abundant Vitamin A, beta-carotene, and lutein to maintain sharp eyesight.'
        },
        {
          title: 'Curcumin Anti-Inflammatory Action',
          desc: 'Turmeric seasoning delivers curcumin, proven to suppress bodily inflammation and support joint comfort.'
        },
        {
          title: 'Fiber & Digestibility',
          desc: 'The blend of diced vegetables provides prebiotic fiber that slows glucose absorption and enhances gut motility.'
        },
        {
          title: 'Fat-Soluble Vitamin Uptake',
          desc: 'Healthy vegetable oils assist in the smooth bioavailability of fat-soluble vitamins (A, D, E, and K).'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '54 - 62g' },
        { label: 'Vegetable Fiber', value: '5 - 8g' },
        { label: 'Protein', value: '16 - 22g' },
        { label: 'Antioxidants', value: 'High' }
      ],
      preparationTips:
        'Stir-fry vegetables briefly so they maintain their vibrant crunch and heat-sensitive vitamins. Use lean chicken broth and minimal cooking oil.',
      bestPairings: 'Grilled Chicken, Peppered Fish, Coleslaw (low-mayo), or Turkey.'
    }
  },
  {
    id: 'jollof-rice-smoky',
    name: 'Jollof Rice',
    nativeAlias: 'Smoky Party Jollof Rice',
    category: 'Rice & Grain Specialties',
    calories: '350 - 480 kcal / plate',
    nutritionSummary: 'Cooked Lycopene, Vitamin A, Vitamin C, Essential Spices & Clean Energy',
    benefit: 'West Africa’s iconic savory rice meal, packed with cooked tomato antioxidants and mood-elevating spices.',
    badgeColor: '#E11D48',
    tag: 'Antioxidant & Mood Booster',
    fullDetails: {
      tagline: 'West Africa’s Most Celebrated Culinary Icon and Lycopene Source',
      healthTalk:
        'Nigerian Jollof Rice is slowly simmered in a reduced, flavorful base of fresh plum tomatoes, tatashe (red bell peppers), rodo (scotch bonnets), onions, and aromatic herbs. The gentle reduction of tomatoes under heat unlocks maximum bioavailable lycopene—a premier antioxidant for cell and vascular longevity.',
      benefits: [
        {
          title: 'Potent Bioavailable Lycopene',
          desc: 'Heating tomatoes in oil increases lycopene absorption by up to 300%, conferring powerful cardiovascular and prostate protection.'
        },
        {
          title: 'Vitamin C & Red Pepper Carotenes',
          desc: 'Red bell peppers (tatashe) infuse the rice with high Vitamin C and beta-carotene, revitalizing your immune defenses.'
        },
        {
          title: 'Psychological Comfort & Mood Boost',
          desc: 'Its savory aroma and rich spice profile trigger natural dopamine and endorphin release, elevating emotional wellbeing.'
        },
        {
          title: 'Stamina Refueling',
          desc: 'Provides steady carbohydrate replenishment to restore physical energy after prolonged exertion.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '62 - 70g' },
        { label: 'Lycopene & Carotene', value: 'Exceptional' },
        { label: 'Protein (with Meat)', value: '18 - 26g' },
        { label: 'Flavor Profile', value: 'Rich Smoky' }
      ],
      preparationTips:
        'Cook with moderate vegetable oil. Always balance your plate with grilled lean chicken or fish and a fresh garden salad or coleslaw.',
      bestPairings: 'Grilled Chicken, Peppered Beef, Fried/Boiled Plantains (Dodo), and Coleslaw.'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. YAM & PLANTAIN DELICACIES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'yam-porridge-asaro',
    name: 'Yam Porridge (Asaro)',
    nativeAlias: 'Asaro / Stewed Yam Pottage with Palm Oil',
    category: 'Yam & Plantain Delicacies',
    calories: '380 - 510 kcal / bowl',
    nutritionSummary: 'Potassium, Vitamin B6, Beta-Carotene, Smoked Fish Collagen, Dietary Fiber',
    benefit: 'Comforting, slow-cooked yam pottage; supports heart rhythm, nerve transmission, and lasting stamina.',
    badgeColor: '#EA580C',
    tag: 'Heart Potassium & Nerve Support',
    fullDetails: {
      tagline: 'Hearty Slow-Simmered Yam Pottage for Sustained Comfort and Stamina',
      healthTalk:
        'Yam Porridge (Asaro) is prepared by gently simmering cubed white yams in a savory broth of blended tomatoes, peppers, unrefined palm oil, smoked fish, and leafy greens. The slow cooking creates a creamy, nutrient-rich stew packed with potassium (essential for counterbalancing high sodium) and Vitamin B6 for neurological health.',
      benefits: [
        {
          title: 'Cardiovascular Blood Pressure Support',
          desc: 'Supplies high dietary potassium, which helps relax blood vessel walls and promotes regular heart rhythm.'
        },
        {
          title: 'Vitamin B6 Cognitive Vitality',
          desc: 'Aids in neurotransmitter synthesis, enhancing mental alertness and reducing mental fatigue.'
        },
        {
          title: 'Beta-Carotene Immune Defense',
          desc: 'Natural unrefined palm oil provides beta-carotenes that strengthen mucous membranes and skin.'
        },
        {
          title: 'Sustained Satiety & Stomach Comfort',
          desc: 'Warm, semi-mashed yam starches coat the stomach and keep hunger at bay for hours.'
        }
      ],
      macronutrients: [
        { label: 'Complex Carbs', value: '64 - 74g' },
        { label: 'Potassium', value: '780mg' },
        { label: 'Healthy Fats', value: '12 - 18g' },
        { label: 'Protein (with Fish)', value: '16 - 22g' }
      ],
      preparationTips:
        'Add generous handfuls of shredded spinach, Ugwu, or scent leaves right at the end of simmering. Use smoked mackerel for clean protein.',
      bestPairings: 'Fried/Boiled Plantains, Fried Fish, Peppered Chicken, or Boiled Eggs.'
    }
  },
  {
    id: 'fried-yam-dundun',
    name: 'Fried Yam (Dundun)',
    nativeAlias: 'Dundun / Crispy Fried Yam with Pepper Sauce',
    category: 'Yam & Plantain Delicacies',
    calories: '340 - 460 kcal / serving',
    nutritionSummary: 'Energy-Dense Carbohydrates, Potassium, Capsaicin (from Ata Dindin Sauce)',
    benefit: 'Crisp on the outside, fluffy inside; provides rapid carbohydrate refueling for active days.',
    badgeColor: '#CA8A04',
    tag: 'Crispy Energy Refuel',
    fullDetails: {
      tagline: 'Nigeria’s Favorite Street-Side Crispy Yam Energy Refuel',
      healthTalk:
        'Fried Yam (Dundun) is sliced white yam fried to golden-crisp perfection and served hot with spicy fried pepper sauce (Ata Dindin) or fried eggs. It delivers dense, satisfying carbohydrates that instantly restore depleted glycogen reserves in athletes and busy campus students.',
      benefits: [
        {
          title: 'Fast Glycogen Replenishment',
          desc: 'Provides accessible carbohydrate energy for high-demand physical labor and post-workout recovery.'
        },
        {
          title: 'Dietary Potassium Content',
          desc: 'Yam provides natural potassium to support muscle contraction and fluid balance.'
        },
        {
          title: 'Capsaicin Thermogenesis from Sauce',
          desc: 'Spicy pepper sauce stimulates metabolic rate, gastric enzyme secretion, and alertness.'
        },
        {
          title: 'Satisfying Satiety Factor',
          desc: 'Delivers a crispy texture that satisfies cravings and maintains physical fullness.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '62 - 72g' },
        { label: 'Fats', value: '14 - 20g' },
        { label: 'Protein', value: '4 - 6g' },
        { label: 'Energy Density', value: 'High' }
      ],
      preparationTips:
        'Parboil yam sticks slightly in salted water before flash-frying to reduce oil absorption, or prepare in an air fryer for 80% less fat.',
      bestPairings: 'Fried Egg Sauce, Peppered Fish, Grilled Chicken, or Ata Dindin Sauce.'
    }
  },
  {
    id: 'boiled-yam',
    name: 'Boiled Yam',
    nativeAlias: 'Steamed White Yam Slices',
    category: 'Yam & Plantain Delicacies',
    calories: '260 - 340 kcal / serving',
    nutritionSummary: 'Complex Carbohydrates, Zero Added Fat, Potassium, Vitamin C, Dietary Fiber',
    benefit: 'Clean, oil-free energy source; gentle on the stomach and an ideal base for high-protein sauces.',
    badgeColor: '#94A3B8',
    tag: 'Clean Oil-Free Carbohydrate',
    fullDetails: {
      tagline: 'Pure, Unadulterated Steamed Yam for Clean Everyday Sustenance',
      healthTalk:
        'Boiled Yam is simply sliced fresh white yam boiled in lightly salted water until tender. Containing zero added cooking oil, it is one of the cleanest carbohydrate sources available, preserving heat-stable minerals, potassium, and complex starches.',
      benefits: [
        {
          title: 'Zero Added Fat & Cholesterol',
          desc: 'A pure, clean energy base with no added lipids, ideal for calorie-controlled and cardiovascular meal plans.'
        },
        {
          title: 'Superior Potassium-to-Sodium Ratio',
          desc: 'Natural whole yam provides potassium that supports cardiovascular stability and renal fluid balance.'
        },
        {
          title: 'Slow-Release Glucose Fuel',
          desc: 'Whole boiled yam digests at a steady pace, fueling long mental work without afternoon energy crashes.'
        },
        {
          title: 'Stomach Soothing & Anti-Acid',
          desc: 'Soft boiled yam starch buffers stomach acid and provides gentle nutrition for ulcer patients.'
        }
      ],
      macronutrients: [
        { label: 'Clean Carbs', value: '60 - 68g' },
        { label: 'Fat Content', value: '< 0.5g' },
        { label: 'Potassium', value: '650mg' },
        { label: 'Fiber', value: '4 - 6g' }
      ],
      preparationTips:
        'Boil with a pinch of salt until fork-tender. Pair with nutrient-dense scrambled egg sauce, vegetable stew, or garden egg sauce.',
      bestPairings: 'Yam & Egg Sauce, Garden Egg Sauce, Vegetable Stew, or Fish Pepper Soup.'
    }
  },
  {
    id: 'roasted-yam',
    name: 'Roasted Yam',
    nativeAlias: 'Charcoal-Grilled Yam / Bole Yam',
    category: 'Yam & Plantain Delicacies',
    calories: '270 - 360 kcal / serving',
    nutritionSummary: 'Resistant Starch, Complex Carbs, Potassium, Vitamin B6',
    benefit: 'Charcoal-grilled without oil; develops resistant starch for lower glycemic impact and digestive health.',
    badgeColor: '#78350F',
    tag: 'Charcoal-Grilled & Resistant Starch',
    fullDetails: {
      tagline: 'Smoky Charcoal-Roasted Yam with Low Glycemic Resistance',
      healthTalk:
        'Roasted Yam is slow-grilled over hot charcoal embers until a golden, smoky exterior develops over a tender interior. The dry roasting process retrogrades a portion of the yam starch into resistant starch, giving it a lower glycemic response than boiled or fried yam.',
      benefits: [
        {
          title: 'Higher Resistant Starch Content',
          desc: 'Dry heat roasting increases resistant starch, helping maintain lower post-meal blood sugar levels.'
        },
        {
          title: '100% Oil-Free Cooking Method',
          desc: 'Contains zero frying oil, providing pure complex carbohydrates without unnecessary calories.'
        },
        {
          title: 'High Satiety Duration',
          desc: 'The firm, hearty texture requires thorough chewing, promoting satiety hormones and appetite control.'
        },
        {
          title: 'Rich in Essential Minerals',
          desc: 'Retains copper, manganese, and potassium crucial for cellular antioxidant enzymes.'
        }
      ],
      macronutrients: [
        { label: 'Resistant Carbs', value: '62 - 70g' },
        { label: 'Fats (without Sauce)', value: '< 1g' },
        { label: 'Potassium', value: '680mg' },
        { label: 'Satiety Score', value: 'High' }
      ],
      preparationTips:
        'Pair with native palm oil pepper sauce with chopped Utazi leaves for bitter digestive enzyme stimulation.',
      bestPairings: 'Native Palm Oil Pepper Sauce, Utazi Leaf Sauce, Fried Fish, or Roasted Groundnuts.'
    }
  },
  {
    id: 'yam-egg-sauce',
    name: 'Yam & Egg Sauce',
    nativeAlias: 'Boiled Yam with Scrambled Tomato & Pepper Egg Sauce',
    category: 'Yam & Plantain Delicacies',
    calories: '410 - 540 kcal / plate',
    nutritionSummary: 'Choline, Complete Protein, Lutein, Lycopene, Potassium, Vitamin B12',
    benefit: 'Nutritionally complete powerhouse; delivers choline for memory recall, complete protein, and complex carbs.',
    badgeColor: '#F59E0B',
    tag: 'Choline Brain Power & Protein',
    fullDetails: {
      tagline: 'The Ultimate Balanced Breakfast for Brain Power and Muscle Repair',
      healthTalk:
        'Yam & Egg Sauce is a beloved Nigerian staple combining tender boiled yam with a vibrant, savory scrambled sauce of eggs, fresh plum tomatoes, red peppers, and onions. Eggs deliver complete protein and abundant choline—the essential brain nutrient required for memory retention and neurotransmitter synthesis.',
      benefits: [
        {
          title: 'Choline for Brain & Memory Power',
          desc: 'Egg yolks are the richest dietary source of choline, vital for student memory recall and cognitive sharpness.'
        },
        {
          title: 'Complete High-Biological Value Protein',
          desc: 'Eggs provide all 9 essential amino acids in perfect biological ratios, promoting muscle repair and cell growth.'
        },
        {
          title: 'Eye Protection (Lutein & Zeaxanthin)',
          desc: 'Egg antioxidants protect retinas from blue light radiation and reduce visual fatigue.'
        },
        {
          title: 'Balanced Glycemic Index',
          desc: 'Protein and healthy fats in the egg sauce slow down yam starch digestion, maintaining steady all-day stamina.'
        }
      ],
      macronutrients: [
        { label: 'Complete Protein', value: '18 - 24g' },
        { label: 'Complex Carbs', value: '58 - 66g' },
        { label: 'Choline', value: '250mg' },
        { label: 'Healthy Fats', value: '14 - 18g' }
      ],
      preparationTips:
        'Scramble eggs in minimal olive or vegetable oil with abundant onions and tomatoes. Include both egg whites and yolks.',
      bestPairings: 'Boiled Yam, Boiled Plantain, or Boiled Sweet Potatoes.'
    }
  },
  {
    id: 'plantain-porridge',
    name: 'Plantain Porridge',
    nativeAlias: 'Stewed Plantain Pottage / Ukodo Style Plantain',
    category: 'Yam & Plantain Delicacies',
    calories: '360 - 480 kcal / bowl',
    nutritionSummary: 'Potassium, Resistant Starch, Beta-Carotene, Vitamin A, Smoked Fish Iron',
    benefit: 'Rich in potassium and digestive fiber; nourishes heart health and supports steady metabolic vitality.',
    badgeColor: '#65A30D',
    tag: 'Potassium & Colon Wellness',
    fullDetails: {
      tagline: 'Hearty Stewed Plantain Pottage for Colon and Blood Pressure Health',
      healthTalk:
        'Plantain Porridge is made by simmering diced ripe or semi-ripe plantains with palm oil, fresh peppers, ground crayfish, smoked fish, and leafy greens. It provides high potassium to assist in sodium regulation and delivers soluble fiber that supports gut health.',
      benefits: [
        {
          title: 'Potassium Blood Pressure Defense',
          desc: 'High potassium counterbalances dietary salt, promoting smooth arterial blood flow and heart health.'
        },
        {
          title: 'Digestive & Bowel Integrity',
          desc: 'Soluble plantain fiber nourishes the gut barrier and encourages smooth, regular bowel movements.'
        },
        {
          title: 'Vitamin A & Immune Cellular Health',
          desc: 'Red palm oil and plantain carotenes combine to reinforce immune white blood cell production.'
        },
        {
          title: 'Long-Lasting Gentle Energy',
          desc: 'Provides steady, slow-releasing energy without creating heaviness or sluggishness.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '62 - 70g' },
        { label: 'Potassium', value: '720mg' },
        { label: 'Dietary Fiber', value: '6 - 9g' },
        { label: 'Protein (with Fish)', value: '16 - 22g' }
      ],
      preparationTips:
        'Mix semi-ripe with unripe plantains for lower sugar and higher resistant starch. Add fresh scent leaf or Ugwu at the end.',
      bestPairings: 'Smoked Catfish, Dried Fish, Peppered Goat Meat, or Boiled Eggs.'
    }
  },
  {
    id: 'fried-plantain-dodo',
    name: 'Fried Plantain (Dodo)',
    nativeAlias: 'Dodo / Golden Sweet Fried Plantain',
    category: 'Yam & Plantain Delicacies',
    calories: '280 - 390 kcal / serving',
    nutritionSummary: 'Natural Fruit Glucose, Potassium, Vitamin A, Vitamin B6, Magnesium',
    benefit: 'Nigeria’s most cherished side dish; provides instant mood elevation, potassium, and rapid energy.',
    badgeColor: '#F59E0B',
    tag: 'Mood Booster & Instant Energy',
    fullDetails: {
      tagline: 'West Africa’s Beloved Golden Delicacy for Energy and Instant Joy',
      healthTalk:
        'Fried Plantain (Dodo) is ripe sweet plantain sliced and fried to a deep golden, caramelized sweetness. It is rich in natural fruit sugars, Vitamin A, and potassium, serving as a celebrated mood elevator and instant energy provider.',
      benefits: [
        {
          title: 'Instant Physical & Mental Refueling',
          desc: 'Naturally caramelized fruit sugars rapidly replenish depleted energy during long, exhausting days.'
        },
        {
          title: 'Endorphin & Mood Elevation',
          desc: 'The sensory delight of sweet dodo stimulates natural dopamine pathways, improving mental wellness.'
        },
        {
          title: 'Potassium Electrolyte Balance',
          desc: 'Provides bioavailable potassium that prevents muscle cramps and sustains cellular hydration.'
        },
        {
          title: 'Vitamin A & Beta-Carotene',
          desc: 'Yellow ripe plantains supply carotenoids that support vision and epithelial skin integrity.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '54 - 64g' },
        { label: 'Healthy Lipids', value: '10 - 15g' },
        { label: 'Potassium', value: '580mg' },
        { label: 'Vitamin A', value: 'Moderate' }
      ],
      preparationTips:
        'Fry in clean, high smoke-point vegetable oil (or air-fry with a light olive oil spray) to minimize excess oil absorption.',
      bestPairings: 'Jollof Rice, Fried Rice, Beans & Stew, Egusi Soup, or Grilled Chicken.'
    }
  },
  {
    id: 'boiled-plantain',
    name: 'Boiled Plantain',
    nativeAlias: 'Steamed Ripe / Unripe Plantain Slices',
    category: 'Yam & Plantain Delicacies',
    calories: '210 - 290 kcal / serving',
    nutritionSummary: 'Zero Added Fat, Potassium, Vitamin B6, Soluble Fiber, Vitamin C',
    benefit: 'Oil-free steamed plantain; supports cardiovascular health, regulates fluids, and aids weight management.',
    badgeColor: '#84CC16',
    tag: 'Oil-Free & Low Calorie',
    fullDetails: {
      tagline: 'Pure Steamed Plantain for Clean Potassium Delivery and Heart Wellness',
      healthTalk:
        'Boiled Plantain (whether ripe, semi-ripe, or green) is prepared by gently boiling sliced plantains in water. With zero added cooking oil, it delivers pure potassium, Vitamin B6, and dietary fiber in their most natural, easily absorbable form.',
      benefits: [
        {
          title: '100% Zero Added Oil & Low Calorie',
          desc: 'Delivers full plantain nutrition with 40% fewer calories than fried dodo, ideal for fat-loss goals.'
        },
        {
          title: 'Fluid & Electrolyte Regulation',
          desc: 'Rich in potassium to assist kidneys in flushing out excess sodium and reducing water retention.'
        },
        {
          title: 'Neurotransmitter Vitamin B6',
          desc: 'Provides Vitamin B6 to support cardiovascular health and reduce plasma homocysteine levels.'
        },
        {
          title: 'Digestive Fiber Matrix',
          desc: 'Gentle soluble fiber prevents intestinal stagnation without irritating sensitive bowels.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '48 - 56g' },
        { label: 'Fat Content', value: '< 0.4g' },
        { label: 'Potassium', value: '620mg' },
        { label: 'Calories', value: 'Low (~240 kcal)' }
      ],
      preparationTips:
        'Boil unripe or semi-ripe plantains with their skin on to lock in heat-sensitive minerals, then peel and serve.',
      bestPairings: 'Vegetable Stew (Efo Riro), Fish Pepper Soup, Egg Sauce, or Garden Egg Sauce.'
    }
  },
  {
    id: 'roasted-plantain-boli',
    name: 'Roasted Plantain (Boli)',
    nativeAlias: 'Boli / Charcoal-Grilled Plantain with Groundnuts / Pepper Sauce',
    category: 'Yam & Plantain Delicacies',
    calories: '240 - 340 kcal / serving',
    nutritionSummary: 'Resistant Starch, Potassium, Vitamin A, Zero Frying Oil, Dietary Fiber',
    benefit: 'Charcoal-grilled street delicacy; oil-free, rich in potassium, and delivers sustained low-GI energy.',
    badgeColor: '#78350F',
    tag: 'Charcoal-Grilled & Oil-Free',
    fullDetails: {
      tagline: 'Authentic Charcoal-Grilled Plantain for Clean, Smoky Nutrition',
      healthTalk:
        'Roasted Plantain (Boli) is grilled slowly over open charcoal embers until caramelized and slightly charred. It contains zero cooking oil while preserving natural potassium, carotenoids, and resistant fiber, making it one of Nigeria’s healthiest street foods.',
      benefits: [
        {
          title: 'Zero Cooking Oil Nutrition',
          desc: 'Grilling on charcoal eliminates the need for frying fats, keeping caloric density clean and heart-friendly.'
        },
        {
          title: 'Potassium & Heart Defense',
          desc: 'Supplies high potassium that relaxes blood vessels and assists in blood pressure management.'
        },
        {
          title: 'Low Glycemic Charcoal Caramelization',
          desc: 'Dry heat grilling preserves fiber structure, preventing erratic blood sugar spikes.'
        },
        {
          title: 'Balanced Protein Pairing with Groundnuts/Fish',
          desc: 'Pairing with roasted peanuts or grilled fish creates a complete balance of complex carbs, protein, and healthy fats.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '52 - 60g' },
        { label: 'Fats (without Peanuts)', value: '< 1g' },
        { label: 'Potassium', value: '640mg' },
        { label: 'Satiety Score', value: 'Very High' }
      ],
      preparationTips:
        'Pair ripe or semi-ripe Boli with roasted groundnuts or grilled peppered fish and Utazi pepper sauce.',
      bestPairings: 'Roasted Groundnuts, Grilled Peppered Fish, Pepper Sauce, or Smoked Catfish.'
    }
  },
  {
    id: 'plantain-chips',
    name: 'Plantain Chips',
    nativeAlias: 'Crispy Sliced Plantain Snack (Ripe & Unripe)',
    category: 'Yam & Plantain Delicacies',
    calories: '220 - 310 kcal / 50g pack',
    nutritionSummary: 'Dietary Fiber, Potassium, Vitamin A, Vitamin C, Iron',
    benefit: 'Crunchy on-the-go snack; unripe variety provides resistant fiber and minerals without refined sugars.',
    badgeColor: '#EAB308',
    tag: 'Crunchy Snack & Energy',
    fullDetails: {
      tagline: 'Crispy Sliced Whole-Fruit Snack for On-the-Go Campus Stamina',
      healthTalk:
        'Plantain Chips are thinly sliced green or ripe plantains fried to a light, crispy crunch. Unripe green plantain chips provide clean resistant starch and potassium with zero added refined sugars, making them a superior alternative to artificial potato chips.',
      benefits: [
        {
          title: '100% Real Whole-Fruit Snack',
          desc: 'Made from real whole plantains rather than reconstituted flours or ultra-processed potato pastes.'
        },
        {
          title: 'Zero Added Refined Sugar (Unripe)',
          desc: 'Green plantain chips contain natural complex starches with no refined sugars or high-fructose corn syrups.'
        },
        {
          title: 'Potassium for Muscle Function',
          desc: 'Supplies natural electrolytes to keep muscle tissues hydrated during long commutes and study sessions.'
        },
        {
          title: 'Convenient Clean Energy',
          desc: 'A shelf-stable, portable snack that staves off hunger during busy lectures or travel.'
        }
      ],
      macronutrients: [
        { label: 'Carbohydrates', value: '32 - 38g / 50g' },
        { label: 'Fats', value: '10 - 14g' },
        { label: 'Potassium', value: '380mg' },
        { label: 'Fiber', value: '3 - 5g' }
      ],
      preparationTips:
        'Choose unripened green plantain chips seasoned simply with a pinch of sea salt and chili pepper.',
      bestPairings: 'Fresh Citrus Juice, Zobo Drink, Roasted Peanuts, or Yogurt.'
    }
  },
  {
    id: 'unripe-plantain-porridge',
    name: 'Unripe Plantain Porridge',
    nativeAlias: 'Green Plantain Pottage / Diabetic-Friendly Plantain Porridge',
    category: 'Yam & Plantain Delicacies',
    calories: '310 - 420 kcal / bowl',
    nutritionSummary: 'Resistant Starch Type 2, Potassium, Iron, Magnesium, Leafy Green Chlorophyll',
    benefit: 'The medical benchmark for blood sugar stabilization and ulcer healing; zero added sugar.',
    badgeColor: '#15803D',
    tag: 'Diabetic Benchmark & Ulcer Healing',
    fullDetails: {
      tagline: 'The Ultimate Therapeutic Green Plantain Pottage for Blood Sugar and Gut Healing',
      healthTalk:
        'Unripe Plantain Porridge is cooked by simmering green unripe plantains with palm oil, crayfish, dry fish, scent leaves, and green vegetables. Packed with Type 2 resistant starch and natural leucocyanidin (a flavonoid scientifically proven to accelerate stomach ulcer healing), it is the ultimate therapeutic dish.',
      benefits: [
        {
          title: 'Scientific Ulcer Healing (Leucocyanidin)',
          desc: 'Unripe plantains contain leucocyanidin flavonoids that thicken stomach mucous membranes and heal peptic ulcers.'
        },
        {
          title: 'Maximum Blood Sugar Stabilization',
          desc: 'Resistant starches do not spike insulin, keeping post-prandial blood sugar steady throughout the day.'
        },
        {
          title: 'Potassium Blood Pressure Defense',
          desc: 'High potassium content aids in relaxing blood vessel walls and relieving cardiovascular tension.'
        },
        {
          title: 'Gut Microbiome Colon Restoration',
          desc: 'Ferments in the colon to produce butyrate, supporting gut wall integrity and reducing inflammation.'
        }
      ],
      macronutrients: [
        { label: 'Resistant Starch', value: '16 - 22g' },
        { label: 'Potassium', value: '820mg' },
        { label: 'Seafood Protein', value: '18 - 24g' },
        { label: 'Sugar Content', value: '0g (Zero Added)' }
      ],
      preparationTips:
        'Simmer with plenty of ground crayfish, dry catfish, and fresh scent leaves. Avoid over-cooking to preserve resistant starch.',
      bestPairings: 'Smoked Catfish, Dried Fish, Scent Leaves, or Steamed Snails.'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. PROTEINS, MEATS & GRILLS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'suya-beef',
    name: 'Suya (Beef Suya)',
    nativeAlias: 'Northern Nigerian Skewered Spiced Beef / Yaji Barbecue',
    category: 'Proteins, Meats & Grills',
    calories: '240 - 330 kcal / 100g',
    nutritionSummary: 'High Lean Protein, Yaji Spice (Ginger, Garlic, Chili, Peanut), Heme Iron, Zinc',
    benefit: 'Thinly sliced grilled lean beef; packed with anti-inflammatory Yaji ginger and bioavailable protein.',
    badgeColor: '#DC2626',
    tag: 'High Protein & Yaji Anti-Inflammatory',
    fullDetails: {
      tagline: 'Smoky Northern Barbecue Skewers Packed with Yaji Bioactives and Lean Protein',
      healthTalk:
        'Suya is thinly sliced lean beef marinated in Yaji spice (a traditional blend of dry ginger, garlic, chili pepper, cloves, and defatted peanut powder) and grilled over glowing charcoal embers. The potent ginger and garlic in Yaji provide intense anti-inflammatory and cardiovascular benefits.',
      benefits: [
        {
          title: 'Complete Lean Muscle Protein',
          desc: 'Supplies high concentrations of essential amino acids required for muscle hypertrophy and tissue repair.'
        },
        {
          title: 'Yaji Ginger & Garlic Bioactives',
          desc: 'Gingerol and allicin in Yaji seasoning reduce systemic inflammation, clear sinuses, and stimulate circulation.'
        },
        {
          title: 'Bioavailable Heme Iron & Zinc',
          desc: 'Prevents iron-deficiency anemia and boosts testosterone, immune function, and cellular vitality.'
        },
        {
          title: 'Low Fat Charcoal Grilling',
          desc: 'Open flame grilling allows excess fats to drip away, leaving lean, high-density protein.'
        }
      ],
      macronutrients: [
        { label: 'Lean Protein', value: '28 - 34g / 100g' },
        { label: 'Total Fats', value: '8 - 12g' },
        { label: 'Heme Iron', value: '3.4mg' },
        { label: 'Carbohydrates', value: '< 2g' }
      ],
      preparationTips:
        'Always consume with abundant fresh sliced red onions and cabbage, which provide dietary fiber and quercetin.',
      bestPairings: 'Fresh Sliced Onions, Tomatoes, Cabbage, Masa, or Cold Zobo Drink.'
    }
  },
  {
    id: 'asun-goat-meat',
    name: 'Asun (Spicy Smoked Goat Meat)',
    nativeAlias: 'Peppered Smoked Goat Meat Cuts',
    category: 'Proteins, Meats & Grills',
    calories: '260 - 350 kcal / 100g',
    nutritionSummary: 'Lean Red Meat Protein, Capsaicin, Vitamin B12, CLA (Conjugated Linoleic Acid)',
    benefit: 'Smoked goat meat tossed in spicy peppers; naturally leaner than beef and boosts metabolic thermogenesis.',
    badgeColor: '#B91C1C',
    tag: 'Lean Red Meat & Thermogenesis',
    fullDetails: {
      tagline: 'Aromatic Smoked Goat Meat with Fiery Capsaicin for Metabolic Power',
      healthTalk:
        'Asun is slow-smoked, fire-roasted goat meat chopped into bite-sized pieces and sautéed with crushed habanero peppers (rodo) and onions. Goat meat is naturally leaner with lower saturated fat and cholesterol than beef or pork, while fiery scotch bonnets accelerate calorie burning.',
      benefits: [
        {
          title: 'Naturally Leaner than Beef & Pork',
          desc: 'Contains lower saturated fat and cholesterol while delivering equal or higher protein and iron.'
        },
        {
          title: 'Capsaicin Metabolic Thermogenesis',
          desc: 'Fiery scotch bonnet peppers trigger heat production, boosting metabolic rate and burning calories.'
        },
        {
          title: 'Conjugated Linoleic Acid (CLA)',
          desc: 'Grass-fed goat meat is rich in CLA, a fatty acid associated with fat loss and cancer protection.'
        },
        {
          title: 'Vitamin B12 & Muscle Vitality',
          desc: 'Vital for red blood cell synthesis, neurological integrity, and preventing daytime fatigue.'
        }
      ],
      macronutrients: [
        { label: 'Lean Protein', value: '27 - 33g / 100g' },
        { label: 'Saturated Fat', value: 'Low (4 - 7g)' },
        { label: 'Vitamin B12', value: '100% DV' },
        { label: 'Iron & Zinc', value: 'High' }
      ],
      preparationTips:
        'Opt for roasting over charcoal without deep-frying in oil. Sauté with plenty of fresh onions to add antioxidant quercetin.',
      bestPairings: 'Fried Plantains (Dodo), Jollof Rice, Fried Yam, or Cold Drinks.'
    }
  },
  {
    id: 'peppered-goat-meat',
    name: 'Peppered Goat Meat',
    nativeAlias: 'Stewed Peppered Goat Meat Bites',
    category: 'Proteins, Meats & Grills',
    calories: '250 - 340 kcal / 100g',
    nutritionSummary: 'High Protein, Capsaicin, Potassium, Iron, Zinc, Vitamin B-Complex',
    benefit: 'Savory stewed goat meat in red pepper reduction; fuels muscle recovery and clears nasal airways.',
    badgeColor: '#DC2626',
    tag: 'High Protein & Satiety',
    fullDetails: {
      tagline: 'Tender Stewed Goat Meat in Rich Pepper Glaze for Strength and Stamina',
      healthTalk:
        'Peppered Goat Meat is boiled with aromatic herbs (thyme, curry, garlic, ginger) until tender and coated in a reduced sauce of blended red bell peppers, scotch bonnets, and onions. It delivers concentrated animal protein and essential minerals that nourish muscles and support high stamina.',
      benefits: [
        {
          title: 'Complete Amino Acid Profile',
          desc: 'Provides all 9 essential amino acids required for tissue repair, collagen synthesis, and enzyme production.'
        },
        {
          title: 'Anemia & Fatigue Prevention',
          desc: 'Rich in bioavailable heme iron that supports hemoglobin production and oxygen transport to working muscles.'
        },
        {
          title: 'Immune Zinc & Selenium',
          desc: 'Essential trace minerals stimulate active white blood cells and reinforce immune barriers.'
        },
        {
          title: 'Low Carbohydrate & Keto Friendly',
          desc: 'Virtually zero carbohydrates, making it ideal for low-carb, keto, or high-protein dietary protocols.'
        }
      ],
      macronutrients: [
        { label: 'Protein', value: '26 - 32g / 100g' },
        { label: 'Iron', value: '3.1mg' },
        { label: 'Fat', value: '7 - 11g' },
        { label: 'Carbs', value: '< 1g' }
      ],
      preparationTips:
        'Boil in spiced broth until completely tender before tossing in pepper glaze. Avoid deep-frying to keep fats low.',
      bestPairings: 'Fried Rice, Jollof Rice, Boiled Plantains, or White Rice.'
    }
  },
  {
    id: 'peppered-beef',
    name: 'Peppered Beef',
    nativeAlias: 'Stewed Peppered Beef Cuts',
    category: 'Proteins, Meats & Grills',
    calories: '240 - 320 kcal / 100g',
    nutritionSummary: 'Heme Iron, Creatine, Vitamin B12, High Biological Value Protein',
    benefit: 'Rich in heme iron and natural creatine; accelerates athletic recovery and enhances physical power.',
    badgeColor: '#B91C1C',
    tag: 'Creatine & Athletic Power',
    fullDetails: {
      tagline: 'High-Creatine Lean Beef Glazed in Savory Red Pepper Sauce',
      healthTalk:
        'Peppered Beef is prepared from tender cuts of lean beef simmered in natural seasonings and glazed in a spicy red tomato-pepper reduction. Beef is nature’s richest dietary source of creatine and heme iron, supporting muscle strength, ATP energy generation, and mental focus.',
      benefits: [
        {
          title: 'Natural Creatine for Anaerobic Power',
          desc: 'Directly replenishes muscle phosphocreatine reserves, increasing power output during athletic and physical tasks.'
        },
        {
          title: 'Heme Iron for Blood Vitality',
          desc: 'Provides high-absorption heme iron that eliminates chronic fatigue and bolsters mental stamina.'
        },
        {
          title: 'Muscle Synthesis & Hypertrophy',
          desc: 'Dense in branched-chain amino acids (leucine, isoleucine, valine) that trigger muscle protein synthesis.'
        },
        {
          title: 'Vitamin B12 Neural Health',
          desc: 'Critical for nervous system integrity, mood stability, and red blood cell proliferation.'
        }
      ],
      macronutrients: [
        { label: 'Protein', value: '28 - 34g / 100g' },
        { label: 'Creatine', value: 'Natural High' },
        { label: 'Heme Iron', value: '3.2mg' },
        { label: 'Fats', value: '6 - 10g' }
      ],
      preparationTips:
        'Select lean beef cuts (top round or sirloin). Grill or oven-bake rather than frying in oil.',
      bestPairings: 'Jollof Rice, Fried Rice, Boiled Yam, or Steamed Veggies.'
    }
  },
  {
    id: 'nkwobi',
    name: 'Nkwobi',
    nativeAlias: 'Traditional Igbo Spicy Cow Foot Delicacy with Utazi',
    category: 'Proteins, Meats & Grills',
    calories: '320 - 440 kcal / bowl',
    nutritionSummary: 'Bioavailable Collagen, Glycine, Proline, Calcium, Utazi Leaf Bitters',
    benefit: 'Spicy cow foot in palm oil-potash sauce; packed with collagen to repair joints, tendons, and skin.',
    badgeColor: '#D97706',
    tag: 'Joint Collagen & Tendon Repair',
    fullDetails: {
      tagline: 'Traditional Southeastern Collagen Powerhouse for Joint and Skin Longevity',
      healthTalk:
        'Nkwobi is a revered Southeastern Nigerian delicacy prepared from tenderly cooked cow foot pieces mixed into a thick, spicy palm oil and native potash (ngwo) emulsion, garnished with shredded Utazi leaves and sliced onions. Cow foot is one of the richest whole-food sources of natural bioavailable collagen, glycine, and proline.',
      benefits: [
        {
          title: 'Joint Cartilage & Tendon Regeneration',
          desc: 'Dense collagen peptides reinforce connective tissues, reduce joint friction, and support cartilage recovery.'
        },
        {
          title: 'Skin Elasticity & Anti-Wrinkle Defense',
          desc: 'Bioavailable collagen stimulates internal fibroblast cells to rebuild the dermal extracellular matrix.'
        },
        {
          title: 'Glycine for Restful Sleep & Gut Lining',
          desc: 'Rich in glycine, an amino acid that repairs the intestinal lining and promotes deep, restorative sleep.'
        },
        {
          title: 'Utazi Digestive Stimulation',
          desc: 'Bitter Utazi leaf garnish stimulates bile flow and aids in the smooth digestion of the rich sauce.'
        }
      ],
      macronutrients: [
        { label: 'Collagen Protein', value: '24 - 30g' },
        { label: 'Healthy Lipids', value: '18 - 24g' },
        { label: 'Glycine & Proline', value: 'Very High' },
        { label: 'Carbs', value: '< 3g' }
      ],
      preparationTips:
        'Cook cow foot slowly until gelatinous and tender. Garnish generously with fresh, thinly shredded Utazi leaves.',
      bestPairings: 'Fresh Sliced Onions, Palm Wine, Cold Drinks, or eaten as an evening delicacy.'
    }
  },
  {
    id: 'isi-ewu',
    name: 'Isi Ewu',
    nativeAlias: 'Spicy Goat Head Delicacy with Brain Sauce & Utazi',
    category: 'Proteins, Meats & Grills',
    calories: '340 - 460 kcal / bowl',
    nutritionSummary: 'Phospholipids, DHA, Bioavailable Collagen, Iron, Zinc, Utazi Herbal Bitters',
    benefit: 'Traditional spiced goat head delicacy; delivers natural phospholipids for brain health and collagen.',
    badgeColor: '#B45309',
    tag: 'Brain Phospholipids & Collagen',
    fullDetails: {
      tagline: 'Celebrated Southeastern Cultural Delicacy Rich in Phospholipids and Collagen',
      healthTalk:
        'Isi Ewu (Spicy Goat Head) is an iconic cultural specialty cooked with tender goat head meat folded into a velvety palm oil emulsion made with traditional potash and pureed brain sauce, topped with Utazi leaves and rings of white onions. It supplies rich dietary phospholipids, iron, and connective tissue collagen.',
      benefits: [
        {
          title: 'Brain Phospholipids & Cell Membranes',
          desc: 'Naturally occurring phospholipids support neuron membrane fluidity, memory retention, and cognitive function.'
        },
        {
          title: 'Collagenous Connective Repair',
          desc: 'Rich in natural gelatin and collagen that nourish joint cartilage and skin integrity.'
        },
        {
          title: 'Bioavailable Heme Iron & Zinc',
          desc: 'Prevents anemia, strengthens cellular immunity, and accelerates post-workout recovery.'
        },
        {
          title: 'Utazi Herbal Digestion Boost',
          desc: 'Bitter Utazi leaves stimulate stomach enzymes to break down rich lipids smoothly.'
        }
      ],
      macronutrients: [
        { label: 'Protein & Collagen', value: '26 - 32g' },
        { label: 'Phospholipids', value: 'High' },
        { label: 'Fats', value: '20 - 26g' },
        { label: 'Carbohydrates', value: '< 2g' }
      ],
      preparationTips:
        'Ensure the goat head is thoroughly singed, cleaned, and pressure-cooked until completely tender. Serve piping hot with Utazi.',
      bestPairings: 'Sliced White Onions, Utazi Leaves, Palm Wine, or Chilled Drinks.'
    }
  },
  {
    id: 'goat-meat-pepper-soup',
    name: 'Goat Meat Pepper Soup',
    nativeAlias: 'Spicy Goat Meat Herbal Broth',
    category: 'Proteins, Meats & Grills',
    calories: '220 - 310 kcal / bowl',
    nutritionSummary: 'Lean Goat Protein, Capsaicin, Uda, Ehuru, Uziza, Scent Leaf Eugenol',
    benefit: 'Clears sinuses, accelerates metabolism, relieves respiratory congestion, and revitalizes recovery.',
    badgeColor: '#DC2626',
    tag: 'Airway Relief & Metabolism',
    fullDetails: {
      tagline: 'Therapeutic Warm Broth for Respiratory Health and Rapid Recuperation',
      healthTalk:
        'Goat Meat Pepper Soup is prepared by simmering tender cuts of goat meat in a clear, oil-free broth infused with native medicinal spices (Uda, Ehuru, Uziza, and Scent leaves). Widely used in traditional medicine for cold relief and convalescence, it rapidly stimulates circulation and clears congested airways.',
      benefits: [
        {
          title: 'Respiratory Airway Decongestant',
          desc: 'Aromatic steam and bioactives (capsaicin, piperine) open blocked sinuses and soothe sore throat inflammation.'
        },
        {
          title: 'Metabolic Rate Acceleration',
          desc: 'Thermogenic spices elevate core body temperature and promote active calorie burning.'
        },
        {
          title: 'Postpartum & Convalescent Healing',
          desc: 'Bioactive Uda and Uziza compounds stimulate internal cleansing, tissue recovery, and maternal vitality.'
        },
        {
          title: 'High Lean Protein Delivery',
          desc: 'Supplies high-grade animal protein without excess fat or heavy carbohydrates.'
        }
      ],
      macronutrients: [
        { label: 'Lean Protein', value: '26 - 32g' },
        { label: 'Fat Content', value: 'Low (5 - 8g)' },
        { label: 'Medicinal Spices', value: 'Potent' },
        { label: 'Calories', value: 'Low (~250 kcal)' }
      ],
      preparationTips:
        'Prepare oil-free with freshly ground whole spices. Add generous amounts of freshly shredded scent leaves at the finish.',
      bestPairings: 'Boiled White Rice, Boiled Yam, Boiled Plantain, or enjoyed solo as a restorative broth.'
    }
  },
  {
    id: 'chicken-pepper-soup',
    name: 'Chicken Pepper Soup',
    nativeAlias: 'Local / Broiler Chicken Spicy Broth',
    category: 'Proteins, Meats & Grills',
    calories: '190 - 270 kcal / bowl',
    nutritionSummary: 'Lean Poultry Protein, Tryptophan, Scent Leaf Eugenol, Piperine, Iron',
    benefit: 'Light, restorative chicken broth; boosts immune defenses, eases colds, and supports stress recovery.',
    badgeColor: '#F59E0B',
    tag: 'Immune Defense & Cold Relief',
    fullDetails: {
      tagline: 'Gentle Restorative Chicken Broth for Immune Resilience and Stress Relief',
      healthTalk:
        'Chicken Pepper Soup combines lean chicken cuts simmered in a light, spiced herbal broth seasoned with uziza seeds, calabash nutmeg, and fresh scent leaves. Lighter on the stomach than red meat broths, it delivers easy-to-digest amino acids and electrolytes to combat colds and physical stress.',
      benefits: [
        {
          title: 'Immune Resilience & Cold Relief',
          desc: 'Warm poultry broth thins respiratory mucus and delivers bioavailable cysteine to support lung health.'
        },
        {
          title: 'Tryptophan & Stress Recovery',
          desc: 'High tryptophan converts into serotonin, reducing stress and promoting calm, restful sleep.'
        },
        {
          title: 'Gentle on Sensitive Digestive Tracts',
          desc: 'Extremely light and easy to absorb, making it the perfect restorative meal during illness.'
        },
        {
          title: 'Low Calorie & High Lean Protein',
          desc: 'Provides pure muscle-building amino acids with negligible saturated fats.'
        }
      ],
      macronutrients: [
        { label: 'Lean Protein', value: '24 - 30g' },
        { label: 'Fat Content', value: '3 - 6g' },
        { label: 'Electrolytes', value: 'High' },
        { label: 'Calories', value: 'Low (~220 kcal)' }
      ],
      preparationTips:
        'Remove chicken skin before simmering to keep fats low. Use local chicken for deeper herbal flavor and mineral density.',
      bestPairings: 'Boiled White Rice, Boiled Yam, Boiled Unripe Plantain, or served solo.'
    }
  },
  {
    id: 'catfish-pepper-soup',
    name: 'Catfish Pepper Soup (Point & Kill)',
    nativeAlias: 'Point & Kill Fresh Catfish Pepper Soup',
    category: 'Proteins, Meats & Grills',
    calories: '180 - 260 kcal / bowl',
    nutritionSummary: 'Omega-3 Fatty Acids (EPA/DHA), Lean Marine Protein, Vitamin D, Selenium, Uziza',
    benefit: 'Fresh live catfish in spicy broth; supercharges brain focus, clears airways, and reduces inflammation.',
    badgeColor: '#0284C7',
    tag: 'Omega-3s & Brain Clarity',
    fullDetails: {
      tagline: 'The Legendary Delta Point & Kill Broth for Cognitive Focus and Heart Defense',
      healthTalk:
        'Catfish Pepper Soup is the quintessential Nigerian lounge and riverine delicacy made from freshly harvested live catfish simmered in a fragrant broth of Uziza, Uda, and scent leaves. The tender, flaky fish is packed with marine Omega-3 fatty acids that fight inflammation and boost brain power.',
      benefits: [
        {
          title: 'Brain Synaptic Membrane Fuel (DHA)',
          desc: 'High DHA omega-3 fatty acids nourish brain cells, improving mental concentration and memory recall.'
        },
        {
          title: 'Cardiovascular Plaque Reduction',
          desc: 'Omega-3s help lower blood triglycerides and support healthy vascular endothelial elasticity.'
        },
        {
          title: 'Anti-Inflammatory Joint Relief',
          desc: 'Suppresses inflammatory prostaglandins, relieving joint stiffness and muscle soreness.'
        },
        {
          title: 'Thyroid & Metabolic Selenium',
          desc: 'Rich in dietary selenium and Vitamin D, vital for active thyroid hormone conversion and immunity.'
        }
      ],
      macronutrients: [
        { label: 'Marine Protein', value: '22 - 28g' },
        { label: 'Omega-3 Fats', value: '1.8g' },
        { label: 'Fat Content', value: '5 - 8g' },
        { label: 'Calories', value: 'Low (~210 kcal)' }
      ],
      preparationTips:
        'Wash catfish with hot water or alum to remove slime. Simmer gently on low heat to keep the tender fish whole.',
      bestPairings: 'Boiled White Rice, Boiled Yam, Boiled Plantain, or Cold Drinks.'
    }
  },
  {
    id: 'snail-pepper-soup',
    name: 'Snail Pepper Soup',
    nativeAlias: 'Giant African Land Snail Herbal Pepper Soup',
    category: 'Proteins, Meats & Grills',
    calories: '160 - 240 kcal / bowl',
    nutritionSummary: 'High Ortho-Protein, Zero Saturated Fat, Iron, Magnesium, Selenium, Zinc',
    benefit: 'Giant land snail in spicy broth; ultra-low fat, exceptionally high in iron, and promotes heart health.',
    badgeColor: '#059669',
    tag: 'Ultra-Low Fat & High Iron',
    fullDetails: {
      tagline: 'Premium Giant Land Snail Broth for Cardiovascular Health and Blood Vitality',
      healthTalk:
        'Snail Pepper Soup is prepared with Giant African Land Snails (Achatina fulica) simmered in an aromatic pepper soup broth. Snail meat is one of the leanest animal proteins on earth—virtually devoid of saturated fats and cholesterol while delivering extraordinary concentrations of bioavailable iron and magnesium.',
      benefits: [
        {
          title: 'Virtually Zero Saturated Fat',
          desc: 'Contains less than 1% fat, making it the most cardiovascular-friendly meat choice for hypertensive diets.'
        },
        {
          title: 'Blood-Building Iron Powerhouse',
          desc: 'Supplies high concentrations of organic iron, rapidly reversing iron-deficiency anemia and fatigue.'
        },
        {
          title: 'Magnesium for Muscle & Heart Relaxation',
          desc: 'Rich in magnesium, which calms the nervous system, supports heart rhythm, and relaxes arterial walls.'
        },
        {
          title: 'High Satiety Ortho-Protein',
          desc: 'Firm, satisfying texture delivers prolonged satiety while keeping caloric intake exceptionally light.'
        }
      ],
      macronutrients: [
        { label: 'Lean Protein', value: '22 - 28g' },
        { label: 'Saturated Fat', value: '< 0.5g' },
        { label: 'Iron & Magnesium', value: 'Peak' },
        { label: 'Calories', value: 'Very Low (~180 kcal)' }
      ],
      preparationTips:
        'Clean snails thoroughly with lime, alum, or salt to remove all slime before simmering in spiced pepper broth.',
      bestPairings: 'Boiled Yam, Boiled Unripe Plantain, White Rice, or enjoyed solo.'
    }
  },
  {
    id: 'fresh-fish-stew',
    name: 'Fresh Fish Stew',
    nativeAlias: 'Obe Eja Tutu / Fresh Catfish & Croaker Tomato Stew',
    category: 'Proteins, Meats & Grills',
    calories: '260 - 370 kcal / bowl',
    nutritionSummary: 'Marine Protein, Lycopene, Omega-3s, Vitamin D, Potassium, Beta-Carotene',
    benefit: 'Fresh fish poached in savory tomato-pepper sauce; delivers cooked lycopene and heart-protective Omega-3s.',
    badgeColor: '#0284C7',
    tag: 'Lycopene & Marine Omega-3s',
    fullDetails: {
      tagline: 'Poached Fresh Fish in Rich Tomato Sauce for Cardiovascular and Skin Health',
      healthTalk:
        'Fresh Fish Stew is a classic Nigerian delicacy where fresh cuts of catfish, croaker, or tilapia are poached in a seasoned reduction of fresh plum tomatoes, red peppers, and onions. The combination of marine Omega-3 fatty acids and heat-activated tomato lycopene provides dual cardiovascular and anti-aging protection.',
      benefits: [
        {
          title: 'Cardiovascular Arterial Defense',
          desc: 'Omega-3 fatty acids and bioavailable lycopene synergistically protect blood vessel walls from lipid oxidation.'
        },
        {
          title: 'Skin Elasticity & Cellular Radiance',
          desc: 'Rich in Vitamin C, lycopene, and marine proteins that stimulate skin collagen synthesis.'
        },
        {
          title: 'Light Digestibility & Low Saturated Fat',
          desc: 'Poached fish is tender and light on digestion, avoiding the heavy saturated fats of fried red meats.'
        },
        {
          title: 'Thyroid & Immune Support',
          desc: 'Provides organic iodine and selenium that regulate metabolic rate and immune vigor.'
        }
      ],
      macronutrients: [
        { label: 'Marine Protein', value: '24 - 30g' },
        { label: 'Omega-3 Fats', value: '1.6g' },
        { label: 'Lycopene', value: 'High' },
        { label: 'Total Fats', value: '10 - 15g' }
      ],
      preparationTips:
        'Poach fresh fish directly in the simmering stew rather than deep-frying first to preserve delicate Omega-3 fatty acids.',
      bestPairings: 'Boiled White Rice, Boiled Yam, Boiled Plantains, or Eba.'
    }
  },
  {
    id: 'bush-meat',
    name: 'Bush Meat (Grasscutter / Game Meat)',
    nativeAlias: 'Grasscutter / Antelope / Native Game Meat',
    category: 'Proteins, Meats & Grills',
    calories: '210 - 300 kcal / 100g',
    nutritionSummary: 'Ultra-Lean Protein, Low Saturated Fat, High Heme Iron, Zinc, Vitamin B-Complex',
    benefit: 'Wild grass-fed game meat; naturally lean with zero growth hormones or artificial feed additives.',
    badgeColor: '#78350F',
    tag: '100% Wild Grass-Fed & Ultra-Lean',
    fullDetails: {
      tagline: 'Wild Free-Range African Game Meat for Hormone-Free Lean Muscle Nutrition',
      healthTalk:
        'Bush Meat (such as Grasscutter/Cane Rat or Antelope) is wild-harvested game meat cherished across Delta and Nigerian native kitchens. Because these animals forage exclusively on wild grasses and herbs in nature, their meat is ultra-lean, free from artificial hormones or antibiotics, and packed with bioavailable minerals.',
      benefits: [
        {
          title: '100% Wild & Hormone-Free Protein',
          desc: 'Free from synthetic growth hormones, antibiotic residues, or industrial feeds found in factory farming.'
        },
        {
          title: 'Ultra-Low Fat & High Lean Density',
          desc: 'Wild foraging creates exceptionally lean muscle tissue with lower saturated fat than commercial livestock.'
        },
        {
          title: 'Rich in Heme Iron & Zinc',
          desc: 'Delivers high concentrations of organic iron to maintain high stamina and prevent anemia.'
        },
        {
          title: 'Natural Anti-Inflammatory Fatty Acid Profile',
          desc: 'Wild grass diets promote a healthier Omega-6 to Omega-3 ratio in animal muscle tissue.'
        }
      ],
      macronutrients: [
        { label: 'Wild Protein', value: '28 - 35g / 100g' },
        { label: 'Saturated Fat', value: 'Very Low (2 - 5g)' },
        { label: 'Heme Iron', value: '3.6mg' },
        { label: 'Purity Score', value: 'Wild Grass-Fed' }
      ],
      preparationTips:
        'Ensure bush meat is thoroughly cooked, boiled, or smoked from clean, certified culinary sources.',
      bestPairings: 'Banga Soup, Owo Soup, Egusi Soup, or Pepper Soup.'
    }
  },
  {
    id: 'ponmo-cow-skin',
    name: 'Ponmo (Cow Skin / Kpomo)',
    nativeAlias: 'Kpomo / Soft Boiled Cow Skin',
    category: 'Proteins, Meats & Grills',
    calories: '110 - 180 kcal / 100g',
    nutritionSummary: 'Structural Collagen, Zero Sugar, Low Calorie, Dietary Gelatin',
    benefit: 'Ultra-low calorie culinary delicacy; provides collagenous chew and satisfies appetite without carb load.',
    badgeColor: '#64748B',
    tag: 'Low Calorie & Dietary Collagen',
    fullDetails: {
      tagline: 'Lightweight Collagen-Rich Delicacy for Low-Calorie Satiety',
      healthTalk:
        'Ponmo (Cow Skin / Kpomo) is thoroughly cleaned and boiled cow skin enjoyed across Nigerian soups and peppered sauces. While lower in essential amino acids than muscle meat, it is exceptionally low in calories and fat, providing a satisfying, chewy texture and collagenous gelatin that aids appetite control.',
      benefits: [
        {
          title: 'Ultra-Low Calorie Food Choice',
          desc: 'Contains very few calories per serving (~140 kcal), making it an excellent volume food for weight management.'
        },
        {
          title: 'Natural Collagen & Gelatin',
          desc: 'Supplies dietary gelatin that soothes the gut lining and supports digestive motility.'
        },
        {
          title: 'Zero Sugar & Zero Starch',
          desc: 'Contains zero carbohydrates or glycemic load, fitting seamlessly into keto and low-carb meal plans.'
        },
        {
          title: 'Culinary Satisfaction & Satiety',
          desc: 'Chewy texture promotes thorough mastication, helping trigger natural brain satiety signals.'
        }
      ],
      macronutrients: [
        { label: 'Caloric Density', value: 'Very Low (~140 kcal)' },
        { label: 'Collagen Protein', value: '14 - 18g' },
        { label: 'Fat Content', value: '2 - 4g' },
        { label: 'Carbohydrates', value: '0g' }
      ],
      preparationTips:
        'Purchase naturally processed ponmo (boiled/soaked white/brown) free from chemical treatments. Boil thoroughly in seasoned broth.',
      bestPairings: 'Efo Riro, Egusi Soup, Peppered Ponmo Sauce, or Okro Soup.'
    }
  },
  {
    id: 'shaki-tripe',
    name: 'Shaki (Beef Tripe)',
    nativeAlias: 'Beef Tripe / Assorted Meat Rumen',
    category: 'Proteins, Meats & Grills',
    calories: '130 - 200 kcal / 100g',
    nutritionSummary: 'Lean Protein, Zinc, Vitamin B12, Calcium, Phosphorus, Low Fat',
    benefit: 'Nutrient-dense organ meat; rich in immune zinc and Vitamin B12 with very low saturated fat.',
    badgeColor: '#475569',
    tag: 'Immune Zinc & Low Calorie',
    fullDetails: {
      tagline: 'High-Zinc, Low-Fat Organ Meat for Cellular Immunity and Stamina',
      healthTalk:
        'Shaki (beef tripe) is the edible muscular lining of cattle stomach compartments. It is a prized component of Nigerian assorted meat soups, celebrated by nutritionists for being extremely lean while delivering dense amounts of dietary zinc, Vitamin B12, and bioavailable calcium.',
      benefits: [
        {
          title: 'Immune Zinc Powerhouse',
          desc: 'Supplies substantial zinc, essential for white blood cell function, enzyme synthesis, and wound repair.'
        },
        {
          title: 'Very Low Fat & Lean Protein',
          desc: 'Delivers high protein with less than 4g of fat per serving, ideal for lean body composition.'
        },
        {
          title: 'Vitamin B12 Neural Support',
          desc: 'Assists in red blood cell generation, nervous system balance, and fatigue reduction.'
        },
        {
          title: 'Bioavailable Calcium & Phosphorus',
          desc: 'Strengthens bone matrix and dental health without heavy caloric intake.'
        }
      ],
      macronutrients: [
        { label: 'Protein', value: '19 - 24g / 100g' },
        { label: 'Fat Content', value: 'Low (3 - 5g)' },
        { label: 'Zinc', value: 'High' },
        { label: 'Carbohydrates', value: '0g' }
      ],
      preparationTips:
        'Clean thoroughly and pressure cook until tender before adding to native soups or pepper sauce reductions.',
      bestPairings: 'Egusi Soup, Banga Soup, Efo Riro, or Pepper Soup.'
    }
  },
  {
    id: 'liver-beef-poultry',
    name: 'Liver (Beef & Chicken Liver)',
    nativeAlias: 'Beef / Poultry Liver Cuts',
    category: 'Proteins, Meats & Grills',
    calories: '170 - 240 kcal / 100g',
    nutritionSummary: 'Preformed Vitamin A (Retinol), Heme Iron, Vitamin B12, Folate, Choline, CoQ10',
    benefit: 'Nature’s premier multivitamin; unmatched concentrations of bioavailable iron, Vitamin A, and B12.',
    badgeColor: '#991B1B',
    tag: 'Nature’s Super-Multivitamin',
    fullDetails: {
      tagline: 'The Most Micronutrient-Dense Superfood on Earth for Blood & Vitality',
      healthTalk:
        'Liver is scientifically recognized as the most nutrient-dense organ meat in existence. A single modest serving delivers over 100% of daily requirements for bioavailable Vitamin A (retinol), Vitamin B12, folate, riboflavin, and heme iron, making it the supreme natural remedy for anemia and cellular fatigue.',
      benefits: [
        {
          title: 'Supreme Anemia Reversal (Heme Iron)',
          desc: 'Provides the most readily absorbed iron known in nutrition, rapidly elevating hemoglobin levels.'
        },
        {
          title: 'Active Preformed Vitamin A (Retinol)',
          desc: 'Directly supports vision, epithelial skin cell renewal, and immune antibody generation.'
        },
        {
          title: 'Vitamin B12 & DNA Cellular Synthesis',
          desc: 'Crucial for cognitive sharpness, nerve myelination, and active energy metabolism.'
        },
        {
          title: 'CoQ10 & Mitochondrial Energy',
          desc: 'Rich in Coenzyme Q10, which powers heart muscle cellular mitochondria and fights cellular oxidation.'
        }
      ],
      macronutrients: [
        { label: 'Heme Iron', value: 'Peak (6.5mg)' },
        { label: 'Vitamin A (Retinol)', value: 'Exceeds 100% DV' },
        { label: 'Vitamin B12', value: 'Exceeds 200% DV' },
        { label: 'Protein', value: '26 - 30g' }
      ],
      preparationTips:
        'Do not over-cook liver to preserve its delicate vitamins and tender texture. Sauté with onions, peppers, and garlic.',
      bestPairings: 'Nigerian Fried Rice, Jollof Rice, Boiled Plantains, or Peppered Liver Sauce.'
    }
  },
  {
    id: 'kidney-beef',
    name: 'Kidney (Beef / Goat Kidney)',
    nativeAlias: 'Beef & Goat Kidney Cuts',
    category: 'Proteins, Meats & Grills',
    calories: '140 - 210 kcal / 100g',
    nutritionSummary: 'Selenium, Vitamin B12, High-Quality Protein, Iron, Riboflavin (B2)',
    benefit: 'Organ meat superfood; exceptional selenium and Vitamin B12 content supports thyroid and cellular health.',
    badgeColor: '#831843',
    tag: 'Selenium Powerhouse & Thyroid Support',
    fullDetails: {
      tagline: 'Selenium-Rich Organ Meat for Active Thyroid Metabolism and Immunity',
      healthTalk:
        'Kidney is a nutrient-packed organ meat rich in complete protein, iron, and an extraordinary concentration of dietary selenium—a trace mineral required by the thyroid gland to produce active metabolic hormones and protect cells against oxidative damage.',
      benefits: [
        {
          title: 'Unrivaled Selenium Concentration',
          desc: 'A single serving delivers over 150% DV of selenium, crucial for thyroid metabolism and antioxidant enzymes.'
        },
        {
          title: 'Vitamin B12 & Brain Stamina',
          desc: 'Maintains healthy red blood cells, combats mental fog, and boosts physical energy.'
        },
        {
          title: 'Lean High-Density Protein',
          desc: 'High protein-to-fat ratio that aids in muscle maintenance and cellular tissue regeneration.'
        },
        {
          title: 'Riboflavin (B2) Cellular Energy',
          desc: 'Assists enzymes in breaking down fats, proteins, and carbohydrates into active ATP energy.'
        }
      ],
      macronutrients: [
        { label: 'Selenium', value: 'Exceeds 150% DV' },
        { label: 'Protein', value: '24 - 28g' },
        { label: 'Vitamin B12', value: 'Very High' },
        { label: 'Fats', value: 'Low (4 - 7g)' }
      ],
      preparationTips:
        'Soak in lightly salted water with lemon juice before cooking. Sauté with tomatoes, onions, and curry spices.',
      bestPairings: 'Fried Rice, Jollof Rice, Boiled Yam, or Peppered Organ Stew.'
    }
  },
  {
    id: 'stockfish-okporoko',
    name: 'Stockfish (Okporoko)',
    nativeAlias: 'Okporoko / Air-Dried Atlantic Cod',
    category: 'Proteins, Meats & Grills',
    calories: '290 - 370 kcal / 100g (dry)',
    nutritionSummary: 'Concentrated Pure Protein (80%+ dry weight), Calcium, Iron, Vitamin B12, Iodine',
    benefit: 'Over 80% pure protein by dry weight; virtually fat-free and infuses soups with rich calcium and umami.',
    badgeColor: '#0369A1',
    tag: '80%+ Pure Protein & Calcium',
    fullDetails: {
      tagline: 'The Legendary Air-Dried Cod Super-Protein of West African Soups',
      healthTalk:
        'Stockfish (Okporoko) is wild Atlantic cod naturally cured and air-dried on wooden racks by ocean winds. Because all water is removed while preserving cellular nutrients, it is over 80% pure protein by weight with virtually zero fat, delivering rich calcium, iron, and deep savory flavor to native Nigerian soups.',
      benefits: [
        {
          title: '80%+ Pure Protein Concentration',
          desc: 'One of the most concentrated whole-food sources of pure protein on earth, rapidly rebuilding muscle tissues.'
        },
        {
          title: 'Virtually 0% Saturated Fat',
          desc: 'Supplies concentrated protein and minerals without adding any saturated fat or cholesterol to soups.'
        },
        {
          title: 'Bone-Strengthening Calcium & Phosphorus',
          desc: 'Natural fish bone and cartilage breakdown infuses soups with bioavailable calcium for strong skeletal health.'
        },
        {
          title: 'Deep Natural Umami Flavor',
          desc: 'Naturally occurring glutamates enhance soup flavor without the need for excessive artificial sodium cubes.'
        }
      ],
      macronutrients: [
        { label: 'Pure Protein', value: '78 - 84g / 100g dry' },
        { label: 'Total Fats', value: '< 1g' },
        { label: 'Calcium', value: 'High' },
        { label: 'Iodine & Iron', value: 'Rich' }
      ],
      preparationTips:
        'Soak in warm water overnight or pressure-boil until soft and flaky before adding to soups.',
      bestPairings: 'Egusi Soup, Banga Soup, Oha Soup, Bitterleaf Soup, or Ogbono.'
    }
  },
  {
    id: 'dry-fish-smoked-catfish',
    name: 'Dry Fish (Smoked Mangala / Catfish)',
    nativeAlias: 'Mangala / Smoked Mudfish & Catfish',
    category: 'Proteins, Meats & Grills',
    calories: '260 - 340 kcal / 100g',
    nutritionSummary: 'Omega-3 Fatty Acids, High Protein, Calcium, Iron, Potassium, Zinc',
    benefit: 'Sun-dried and smoked freshwater fish; dense in minerals, calcium, and anti-inflammatory Omega-3s.',
    badgeColor: '#B45309',
    tag: 'Mineral Dense & Omega-3 Rich',
    fullDetails: {
      tagline: 'Sun-Dried & Smoked River Fish Packed with Calcium and Heart-Smart Lipids',
      healthTalk:
        'Dry Fish (including Mangala and dried river catfish) is naturally smoked over hardwood fires to preserve its dense nutritional profile. It concentrates marine minerals, calcium from soft edible bones, and anti-inflammatory Omega-3 fatty acids that enrich traditional soups.',
      benefits: [
        {
          title: 'Bioavailable Calcium from Soft Bones',
          desc: 'Chewing soft smoked fish bones provides natural dietary calcium and phosphorus for bone density.'
        },
        {
          title: 'Omega-3 Fatty Acid Retention',
          desc: 'Retains essential fatty acids that support regular heart rhythm and arterial flexibility.'
        },
        {
          title: 'High Protein Density',
          desc: 'Provides dense, slow-digesting amino acids that sustain muscular stamina.'
        },
        {
          title: 'Immune Zinc & Selenium Delivery',
          desc: 'Supplies vital trace minerals that stimulate cellular immune defenses.'
        }
      ],
      macronutrients: [
        { label: 'Protein', value: '42 - 52g / 100g' },
        { label: 'Omega-3 Fats', value: '1.5g' },
        { label: 'Calcium', value: 'Very High' },
        { label: 'Total Fats', value: '8 - 12g' }
      ],
      preparationTips:
        'Debone large spines, soak in warm salted water to rinse surface soot, and simmer directly in soups for maximum flavor.',
      bestPairings: 'Banga Soup, Owo Soup, Okro Soup, Ogbono, or Yam Porridge.'
    }
  },
  {
    id: 'smoked-fish-titus',
    name: 'Smoked Fish (Titus / Mackerel)',
    nativeAlias: 'Smoked Mackerel / Bonga Fish',
    category: 'Proteins, Meats & Grills',
    calories: '240 - 320 kcal / 100g',
    nutritionSummary: 'High Omega-3s (EPA/DHA), Vitamin D, Selenium, Vitamin B12, High Protein',
    benefit: 'Smoked oily mackerel; premier source of heart-protecting Omega-3 fatty acids and Vitamin D.',
    badgeColor: '#0369A1',
    tag: 'Peak Omega-3s & Vitamin D',
    fullDetails: {
      tagline: 'Hardwood Smoked Oily Fish for Superior Cardiovascular and Immune Defense',
      healthTalk:
        'Smoked Mackerel (Titus) is an oily saltwater fish smoked to a deep golden-brown. Renowned as one of nature’s richest sources of Omega-3 fatty acids (EPA and DHA) and natural Vitamin D, it helps lower triglycerides, reduce joint inflammation, and strengthen immune resilience.',
      benefits: [
        {
          title: 'Peak EPA & DHA Omega-3 Content',
          desc: 'Oily mackerel provides the highest concentrations of Omega-3s, directly lowering blood triglycerides.'
        },
        {
          title: 'Natural Vitamin D Immune Fortification',
          desc: 'One of the few whole foods naturally rich in Vitamin D, crucial for calcium absorption and immunity.'
        },
        {
          title: 'Cardiovascular Arterial Elasticity',
          desc: 'Maintains flexible blood vessels and helps prevent dangerous arterial plaque accumulation.'
        },
        {
          title: 'Cognitive Health & Memory Retention',
          desc: 'DHA forms an essential component of brain tissue, supporting memory recall and cognitive sharpness.'
        }
      ],
      macronutrients: [
        { label: 'Omega-3 Fatty Acids', value: '2.5g / 100g' },
        { label: 'Protein', value: '26 - 32g' },
        { label: 'Vitamin D', value: 'High' },
        { label: 'Selenium', value: 'Rich' }
      ],
      preparationTips:
        'Rinse thoroughly in warm water. Flake into Jollof rice, vegetable soups, or native concoction rice.',
      bestPairings: 'Efo Riro, Jollof Rice, Banga Soup, Concoction Rice, or Okro Soup.'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. LEGUMES, BEANS & TRADITIONAL CAKES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'moi-moi',
    name: 'Moi Moi',
    nativeAlias: 'Steamed Bean Pudding / Elewe Style',
    category: 'Legumes, Beans & Traditional Cakes',
    calories: '220 - 310 kcal / wrap',
    nutritionSummary: 'High Plant Protein, Soluble Dietary Fiber, Folate, Iron, Low Glycemic Index',
    benefit: 'Steamed washed bean pudding; completely oil-manageable, gentle on the stomach, and stabilizes blood sugar.',
    badgeColor: '#EA580C',
    tag: 'Plant Protein & Blood Sugar Stability',
    fullDetails: {
      tagline: 'Steamed Honey Bean Pudding for Clean Plant Protein and Digestive Health',
      healthTalk:
        'Moi Moi is made from washed, peeled black-eyed or honey beans blended with red bell peppers, scotch bonnets, onions, crayfish, and oil, then steamed in eco-friendly banana leaves (Uma leaves) or containers. Steaming preserves heat-sensitive vitamins and delivers clean plant protein without frying.',
      benefits: [
        {
          title: 'Clean Plant Protein for Muscle Repair',
          desc: 'Supplies high-grade plant amino acids with zero heavy animal cholesterol, supporting lean muscle tone.'
        },
        {
          title: 'Low Glycemic Blood Sugar Balance',
          desc: 'Slow-digesting legume starches eliminate glucose spikes, making it an exceptional meal for diabetics.'
        },
        {
          title: 'Soluble Fiber Colon Cleanser',
          desc: 'High prebiotic fiber nourishes gut flora and promotes smooth, effortless bowel transit.'
        },
        {
          title: 'Folate (B9) for Cell Generation',
          desc: 'Packed with natural folate, vital for red blood cell formation and maternal fetal development.'
        }
      ],
      macronutrients: [
        { label: 'Plant Protein', value: '14 - 18g' },
        { label: 'Dietary Fiber', value: '7 - 10g' },
        { label: 'Healthy Fats', value: '6 - 10g' },
        { label: 'Glycemic Load', value: 'Very Low' }
      ],
      preparationTips:
        'Steam in traditional banana/uma leaves for authentic flavor and antioxidant infusion. Enrich with boiled eggs or fish.',
      bestPairings: 'Jollof Rice, Fried Rice, Pap (Akamu/Ogi), Warm Custard, or Boiled Plantains.'
    }
  },
  {
    id: 'akara',
    name: 'Akara (Bean Cakes / Kose)',
    nativeAlias: 'Crispy Fried Bean Fritters / Kose',
    category: 'Legumes, Beans & Traditional Cakes',
    calories: '240 - 340 kcal / 4 pieces',
    nutritionSummary: 'Plant Protein, Dietary Fiber, Iron, Potassium, Zero Cholesterol (when fried in vegetable oil)',
    benefit: 'Crispy on the outside, fluffy inside; high-protein vegetarian breakfast that fuels morning stamina.',
    badgeColor: '#D97706',
    tag: 'High Protein Breakfast & Energy',
    fullDetails: {
      tagline: 'Golden Crispy Bean Fritters for Morning Protein and Satiety',
      healthTalk:
        'Akara (Kose) is prepared by whipping peeled bean paste with finely chopped onions, peppers, and sea salt to incorporate air, then deep-frying spoonfuls until golden and fluffy. It is Nigeria’s favorite high-protein breakfast, delivering sustained energy and muscle-building amino acids.',
      benefits: [
        {
          title: 'High-Protein Morning Fuel',
          desc: 'Provides immediate and sustained plant protein to power through demanding morning classes or workouts.'
        },
        {
          title: 'Prebiotic Legume Fiber',
          desc: 'Keeps the digestive tract active and curbs mid-morning hunger pangs and sugary snack cravings.'
        },
        {
          title: 'Potassium & Heart Minerals',
          desc: 'Honey beans supply natural potassium to support fluid balance and muscular contraction.'
        },
        {
          title: '100% Vegetarian & Plant Powered',
          desc: 'A delicious source of complete vegetarian protein for plant-focused dietary regimens.'
        }
      ],
      macronutrients: [
        { label: 'Plant Protein', value: '12 - 16g / 4 pcs' },
        { label: 'Dietary Fiber', value: '6 - 8g' },
        { label: 'Fats', value: '10 - 14g' },
        { label: 'Satiety Duration', value: 'Long' }
      ],
      preparationTips:
        'Whip the bean paste vigorously with a mortar or mixer to incorporate air, which produces lighter, less oil-absorbent fritters.',
      bestPairings: 'Pap (Akamu / Ogi), Warm Custard, Fresh Bread (Agege), or Warm Oats.'
    }
  },
  {
    id: 'beans-porridge-ewa-riro',
    name: 'Beans Porridge (Ewa Riro)',
    nativeAlias: 'Ewa Oloyin / Stewed Sweet Honey Beans',
    category: 'Legumes, Beans & Traditional Cakes',
    calories: '340 - 460 kcal / plate',
    nutritionSummary: 'High Soluble Fiber, Plant Protein, Potassium, Magnesium, Folate, Iron',
    benefit: 'Stabilizes blood glucose, promotes heart health, and prevents midday energy crashes.',
    badgeColor: '#7C2D12',
    tag: 'Low-GI Energy & Heart Health',
    fullDetails: {
      tagline: 'The Ultimate High-Fiber Plant Protein Stew for Sustained Endurance',
      healthTalk:
        'Beans Porridge (Ewa Riro) is made from tender brown or honey beans (Oloyin) slowly simmered with palm oil, fresh peppers, onions, and smoked fish or crayfish. The combination of slow-digesting complex carbs and prebiotic fiber feeds beneficial gut bacteria and stabilizes blood sugar.',
      benefits: [
        {
          title: 'Rock-Solid Blood Sugar Stability',
          desc: 'Ultra-low glycemic index prevents insulin spikes and eliminates midday fatigue and mental drowsiness.'
        },
        {
          title: 'Gut Microbiome & Colon Health',
          desc: 'Prebiotic soluble fibers nourish healthy bifidobacteria in your colon, optimizing digestion and bowel regularity.'
        },
        {
          title: 'Potassium Blood Pressure Control',
          desc: 'High potassium in beans counterbalances dietary sodium, helping blood vessels relax.'
        },
        {
          title: 'Affordable Plant Protein Source',
          desc: 'Delivers high-quality vegetarian protein that sustains muscle maintenance and satiety for hours.'
        }
      ],
      macronutrients: [
        { label: 'Plant Protein', value: '16 - 22g' },
        { label: 'Dietary Fiber', value: '12 - 16g' },
        { label: 'Potassium', value: '680mg' },
        { label: 'Satiety Score', value: 'Maximum' }
      ],
      preparationTips:
        'Cook beans with plenty of onions and a slice of fresh ginger to reduce intestinal gas. Choose moderate palm oil.',
      bestPairings: 'Fried/Boiled Plantains (Dodo), Fried Fish, Boiled Eggs, or Warm Garri.'
    }
  },
  {
    id: 'adalu-beans-corn',
    name: 'Adalu (Beans & Corn Porridge)',
    nativeAlias: 'Adalu / Sweet Corn and Honey Beans Pottage',
    category: 'Legumes, Beans & Traditional Cakes',
    calories: '360 - 480 kcal / bowl',
    nutritionSummary: 'Complete Complementary Amino Acids, High Fiber, Lutein, Zeaxanthin, Folate',
    benefit: 'Synergistic pairing of legumes and whole grain corn; creates a complete protein with eye-protecting lutein.',
    badgeColor: '#CA8A04',
    tag: 'Complete Amino Acids & Eye Lutein',
    fullDetails: {
      tagline: 'The Perfect Nutritional Marriage of Legume and Whole-Grain Corn',
      healthTalk:
        'Adalu is a traditional Nigerian pottage combining sweet corn and brown honey beans simmered in a savory palm oil and pepper broth. The pairing of beans (rich in lysine) and corn (rich in methionine) creates a complete amino acid profile rivaling meat protein, while corn carotenoids defend eye health.',
      benefits: [
        {
          title: 'Complete Complementary Plant Protein',
          desc: 'Combines the limiting amino acids of grain and legume to form a complete protein for muscle building.'
        },
        {
          title: 'Dual Fiber Matrix (Soluble & Insoluble)',
          desc: 'Bean soluble fiber regulates blood sugar, while corn insoluble fiber accelerates digestive transit.'
        },
        {
          title: 'Macular Eye Protection (Lutein & Zeaxanthin)',
          desc: 'Yellow corn provides natural carotenoids that protect retinas against harmful UV and blue light.'
        },
        {
          title: 'Long-Lasting Hunger Satiation',
          desc: 'The dense dual-grain pottage keeps you completely satisfied for hours without afternoon fatigue.'
        }
      ],
      macronutrients: [
        { label: 'Complete Plant Protein', value: '18 - 24g' },
        { label: 'Combined Fiber', value: '14 - 18g' },
        { label: 'Lutein & Carotenoids', value: 'High' },
        { label: 'Potassium', value: '710mg' }
      ],
      preparationTips:
        'Use fresh or dry sweet corn boiled until tender before adding honey beans. Simmer with crayfish and smoked fish.',
      bestPairings: 'Fried Plantains (Dodo), Fried Fish, Smoked Catfish, or Boiled Eggs.'
    }
  },
  {
    id: 'ekuru-white-moi-moi',
    name: 'Ekuru (White Steamed Bean Cake)',
    nativeAlias: 'White Steamed Bean Pudding with Spicy Ata Dindin',
    category: 'Legumes, Beans & Traditional Cakes',
    calories: '200 - 290 kcal / serving',
    nutritionSummary: '100% Pure Plant Protein, Zero Added Salt in Cake, Prebiotic Fiber, Folate',
    benefit: 'Oil-free, salt-free steamed white bean cake; ideal for low-sodium and renal-friendly meal plans.',
    badgeColor: '#E2E8F0',
    tag: 'Salt-Free & Renal Friendly',
    fullDetails: {
      tagline: 'Pure, Unseasoned Steamed White Bean Cakes for Controlled Sodium and Protein Health',
      healthTalk:
        'Ekuru is prepared from 100% peeled bean paste whipped and steamed without added salt, oil, or pepper in the cake itself. Served with a separate spicy fried pepper sauce (Ata Dindin) and crushed with the hands, it allows precise control over salt and oil intake, making it suitable for low-sodium and cardiovascular diets.',
      benefits: [
        {
          title: 'Zero Added Sodium in Base Cake',
          desc: 'Allows complete control over dietary salt, making it an excellent choice for hypertensive individuals.'
        },
        {
          title: 'Pure Unadulterated Plant Protein',
          desc: 'Provides clean vegetarian amino acids to support muscle tone without processed additives.'
        },
        {
          title: 'Prebiotic Colon Cleanser',
          desc: 'High bean soluble fiber encourages healthy gut flora fermentation and smooth digestion.'
        },
        {
          title: 'Low Calorie & Highly Filling',
          desc: 'Delivers full gastric fullness with minimal caloric density, supporting healthy weight control.'
        }
      ],
      macronutrients: [
        { label: 'Plant Protein', value: '14 - 18g' },
        { label: 'Dietary Fiber', value: '8 - 11g' },
        { label: 'Sodium (Cake)', value: '0mg (Zero Added)' },
        { label: 'Fat (without Sauce)', value: '< 1g' }
      ],
      preparationTips:
        'Whip the bean paste thoroughly to create a light, crumbly texture. Pair with a moderate serving of Ata Dindin sauce.',
      bestPairings: 'Spicy Fried Pepper Sauce (Ata Dindin), Fried Fish, Eko (Agidi), or Fresh Onions.'
    }
  },
  {
    id: 'okpa-bambara-nut',
    name: 'Okpa (Bambara Groundnut Pudding)',
    nativeAlias: 'Lion Food / Igba Okpa / Vigna Subterranea Delicacy',
    category: 'Legumes, Beans & Traditional Cakes',
    calories: '310 - 430 kcal / wrap',
    nutritionSummary: 'Bambara Nut Protein, Calcium, Iron, Lysine, Methionine, Low GI',
    benefit: 'The "Lion Food" of the Southeast; naturally complete plant protein rich in calcium and lasting endurance.',
    badgeColor: '#EA580C',
    tag: 'Complete Amino Acids & Lion Stamina',
    fullDetails: {
      tagline: 'The Legendary Southeastern "Lion Food" Packed with Complete Plant Protein',
      healthTalk:
        'Okpa is made from finely milled Bambara groundnut flour (Vigna subterranea) mixed with warm water, palm oil, fresh scotch bonnets, and sea salt, then wrapped in banana leaves and boiled. Bambara nut is uniquely complete—unlike common beans, it contains naturally balanced proportions of both lysine and methionine.',
      benefits: [
        {
          title: 'Naturally Complete Legume Protein',
          desc: 'Delivers high concentrations of all essential amino acids in one single whole-food plant source.'
        },
        {
          title: 'High Bone-Building Calcium',
          desc: 'Contains significantly higher calcium and phosphorus than standard beans, fortifying bone mineral density.'
        },
        {
          title: 'Long-Lasting Physical Stamina',
          desc: 'Slow-digesting complex starches provide dense, multi-hour endurance for travelers and active workers.'
        },
        {
          title: 'Anemia & Iron Defense',
          desc: 'Supplies bioavailable iron and potassium, boosting blood oxygenation and energy vitality.'
        }
      ],
      macronutrients: [
        { label: 'Complete Protein', value: '16 - 22g' },
        { label: 'Calcium & Phosphorus', value: 'Very High' },
        { label: 'Complex Carbs', value: '48 - 56g' },
        { label: 'Healthy Fats', value: '10 - 15g' }
      ],
      preparationTips:
        'Wrap in authentic banana leaves (Uma leaves) to impart natural aroma and preserve moisture during boiling.',
      bestPairings: 'Pap (Akamu), Soft Drinks, Cold Zobo, or eaten as a standalone travel meal.'
    }
  },
  {
    id: 'agidi-eko',
    name: 'Agidi / Eko',
    nativeAlias: 'Steamed Fermented White Corn Gelatin / Eko Tutu',
    category: 'Legumes, Beans & Traditional Cakes',
    calories: '140 - 210 kcal / wrap',
    nutritionSummary: 'Lactic Acid Fermentation Probiotics, Light Starch, Zero Fat, Zero Gluten',
    benefit: 'Ultra-soothing fermented corn gelatin; easily digested, probiotic-friendly, and cooling on the stomach.',
    badgeColor: '#F8FAFC',
    tag: 'Probiotic Cooling & Ulcer Friendly',
    fullDetails: {
      tagline: 'Silky Fermented Corn Gelatin for Cooling Digestive Relief and Hydration',
      healthTalk:
        'Agidi (Eko) is crafted from wet-milled fermented white corn starch cooked into a thick, glossy pap and wrapped in banana leaves to cool into a smooth, gelatinous pudding. The lactic acid fermentation creates probiotic benefits while delivering ultra-light carbohydrates that soothe inflamed stomachs.',
      benefits: [
        {
          title: 'Stomach Cooling & Acid Reflux Relief',
          desc: 'The smooth, cool gelatinous starch coats irritated stomach walls and immediately calms acid reflux and gastritis.'
        },
        {
          title: 'Fermentation Probiotic Ease',
          desc: 'Lactic acid fermentation breaks down starches, making it effortless to digest and gentle on intestinal flora.'
        },
        {
          title: '100% Zero Fat & Zero Gluten',
          desc: 'Contains zero added fat, zero cholesterol, and zero gluten, serving as a clean, light meal base.'
        },
        {
          title: 'Hydrating & Easy to Consume',
          desc: 'High water content aids cellular hydration and provides gentle nourishment during illness or recovery.'
        }
      ],
      macronutrients: [
        { label: 'Digestible Carbs', value: '32 - 40g' },
        { label: 'Fat Content', value: '< 0.2g' },
        { label: 'Calories', value: 'Low (~160 kcal)' },
        { label: 'Gluten', value: '0% (Free)' }
      ],
      preparationTips:
        'Pair traditionally with rich bean dishes (Akara, Moi Moi) or pepper soup to create a balanced meal.',
      bestPairings: 'Akara, Moi Moi, Catfish Pepper Soup, or Goat Meat Pepper Soup.'
    }
  }
];
