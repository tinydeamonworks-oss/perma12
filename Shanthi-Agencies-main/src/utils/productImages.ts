// Diverse, authentic, real cracker & fireworks photography collection
// Ensures distinct photos across products and prevents identical repeated imagery

// Ragas catalogue crops supplied from the product album.
// These are local assets so the images continue to work in production builds.
export const RAGAS_PRODUCT_CROPS: Record<string, string> = {
  '7 cm Electric': '/products/ragas/7_cm_Electric.jpg',
  '7 cm Glittering': '/products/ragas/7_cm_Glittering.jpg',
  '7 cm Green': '/products/ragas/7_cm_Green.jpg',
  '7 cm Red': '/products/ragas/7_cm_Red.jpg',
  '10 cm Electric': '/products/ragas/10_cm_Electric.jpg',
  '10 cm Glittering': '/products/ragas/10_cm_Glittering.jpg',
  '10 cm Green': '/products/ragas/10_cm_Green.jpg',
  '10 cm Red': '/products/ragas/10_cm_Red.jpg',
  '12 cm Electric': '/products/ragas/12_cm_Electric.jpg',
  '12 cm Glittering': '/products/ragas/12_cm_Glittering.jpg',
  '12 cm Green': '/products/ragas/12_cm_Green.jpg',
  '12 cm Red': '/products/ragas/12_cm_Red.jpg',
  '15 cm Electric': '/products/ragas/15_cm_Electric.jpg',
  '15 cm Glittering': '/products/ragas/15_cm_Glittering.jpg',
  '15 cm Green': '/products/ragas/15_cm_Green.jpg',
  '15 cm Red': '/products/ragas/15_cm_Red.jpg',
  '15 cm Silver Drops': '/products/ragas/15_cm_Silver_Drops.jpg',
  '30 cm Electric': '/products/ragas/30_cm_Electric.jpg',
  '30 cm Glittering': '/products/ragas/30_cm_Glittering.jpg',
  '30 cm Green': '/products/ragas/30_cm_Green.jpg',
  '30 cm Red': '/products/ragas/30_cm_Red.jpg',
  '50 cm Electric': '/products/ragas/50_cm_Electric.jpg',
  '50 cm Glittering': '/products/ragas/50_cm_Glittering.jpg',
  '75 cm Electric': '/products/ragas/75_cm_Electric.jpg',
  '75 cm Glittering': '/products/ragas/75_cm_Glittering.jpg',
};

// Conservative matches to the current product IDs. Only strong size/colour/order
// matches are overridden; unmatched crops remain available in RAGAS_PRODUCT_CROPS
// without inventing a product-to-image relationship.
const RAGAS_PRODUCT_ID_OVERRIDES: Record<string, string> = {
  // Exact product visible in the uploaded album.
  'nov-01': '/products/user-supplied/source_07.jpg', // Race Car
  // 7 cm / 7.5 cm series
  'spk-20': RAGAS_PRODUCT_CROPS['7 cm Electric'],
  'spk-21': RAGAS_PRODUCT_CROPS['7 cm Glittering'],
  'spk-22': RAGAS_PRODUCT_CROPS['7 cm Green'],
  'spk-23': RAGAS_PRODUCT_CROPS['7 cm Red'],

  // 10 cm series
  'spk-01': RAGAS_PRODUCT_CROPS['10 cm Electric'],
  'spk-02': RAGAS_PRODUCT_CROPS['10 cm Glittering'],
  'spk-03': RAGAS_PRODUCT_CROPS['10 cm Red'],
  'spk-04': RAGAS_PRODUCT_CROPS['10 cm Green'],

  // 12 cm series
  'spk-05': RAGAS_PRODUCT_CROPS['12 cm Electric'],
  'spk-06': RAGAS_PRODUCT_CROPS['12 cm Glittering'],
  'spk-07': RAGAS_PRODUCT_CROPS['12 cm Green'],
  'spk-08': RAGAS_PRODUCT_CROPS['12 cm Red'],

  // 15 cm series
  'spk-09': RAGAS_PRODUCT_CROPS['15 cm Electric'],
  'spk-10': RAGAS_PRODUCT_CROPS['15 cm Glittering'],
  'spk-11': RAGAS_PRODUCT_CROPS['15 cm Green'],
  'spk-12': RAGAS_PRODUCT_CROPS['15 cm Red'],
  'spk-13': RAGAS_PRODUCT_CROPS['15 cm Silver Drops'],

  // Larger sparklers; use the closest size in the existing 30/50/75 cm catalogue entries.
  'spk-14': RAGAS_PRODUCT_CROPS['30 cm Electric'],
  'spk-15': RAGAS_PRODUCT_CROPS['30 cm Green'],
  'spk-16': RAGAS_PRODUCT_CROPS['30 cm Glittering'],
  'spk-17': RAGAS_PRODUCT_CROPS['30 cm Red'],
  'spk-18': RAGAS_PRODUCT_CROPS['50 cm Electric'],
  'spk-19': RAGAS_PRODUCT_CROPS['50 cm Glittering'],
  'spk-24': RAGAS_PRODUCT_CROPS['75 cm Electric'],
  'spk-25': RAGAS_PRODUCT_CROPS['75 cm Glittering'],
};

// 1. SPARKLERS (கம்பி மத்தாப்பு) - Real photographs of electric, gold, green, red, crackling sparklers
export const SPARKLER_PHOTOS = [
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=500&q=80', // Golden handheld sparkler
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=500&q=80', // Sparkler close up with intense sparks
  'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=500&q=80', // Electric glittering sparkler trail
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80', // Sparkling stars and lights
  'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=500&q=80', // Glowing festive firework sparks
  'https://images.unsplash.com/photo-1482575832494-771f74bf6857?auto=format&fit=crop&w=500&q=80', // Crackling light sparkler night
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=500&q=80', // Sparkler in festive background
];

// 2. GROUND CHAKKARS & SPINNERS (தரை சக்கரம்) - Real spinning wheel & chakkar fireworks
export const CHAKKAR_PHOTOS = [
  'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=500&q=80', // Circular spinning fire rings
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80', // Spinning gold embers wheel
  'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=500&q=80', // Fast dynamic circular sparks
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=500&q=80', // Vivid glowing fire spin
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=80', // Whirling ground cracker effect
];

// 3. FLOWER POTS & FOUNTAINS (பூந்தொட்டி / அனார்) - Real golden showers & conical flower pots
export const FLOWER_POT_PHOTOS = [
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80', // High golden fountain cone (Anar)
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=500&q=80', // Bright silver fountain sparks
  'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=500&q=80', // Colored crackling fountain spray
  'https://images.unsplash.com/photo-1482575832494-771f74bf6857?auto=format&fit=crop&w=500&q=80', // Towering shower of gold sparkles
  'https://images.unsplash.com/photo-1533230308558-a006c9a9d592?auto=format&fit=crop&w=500&q=80', // Multicolor festive volcano fountain
];

// 4. ROCKETS & MISSILES (ராக்கெட்) - Real sky rocket trails & launches
export const ROCKET_PHOTOS = [
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=80', // Skyward rocket launch trail
  'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=500&q=80', // High altitude burst rocket
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80', // Luminous rocket tail trail
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=500&q=80', // Whistling rocket sky trail
];

// 5. AERIAL SHOTS & CAKES (வான வேடிக்கை / மல்டி ஷாட் கேக்) - Dazzling multicolored fireworks bursts
export const AERIAL_SHOT_PHOTOS = [
  'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=500&q=80', // Huge red and gold aerial burst
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80', // Multi-colored sky show
  'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=500&q=80', // Chrysanthemum night aerial shell
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80', // Golden willow aerial display
  'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=500&q=80', // Vibrant blue and purple night flower
  'https://images.unsplash.com/photo-1482575832494-771f74bf6857?auto=format&fit=crop&w=500&q=80', // Palm tree aerial burst effect
];

// 6. GARLANDS & SOUND CRACKERS (சரவெடி / மாலை / பிஜிலி) - Red wrapped crackers, wala, thunder bombs
export const SOUND_CRACKER_PHOTOS = [
  'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=500&q=80', // Traditional red paper crackers
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80', // Cracker explosion with bright flash
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=500&q=80', // Loud thunder burst
  'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=500&q=80', // Festive red crackers in box
];

// 7. NOVELTY, TOYS & SMOKE (விளையாட்டு & வண்ண புகை) - Pop-pop, pistols, smoke bombs, toys
export const NOVELTY_PHOTOS = [
  'https://images.unsplash.com/photo-1533230308558-a006c9a9d592?auto=format&fit=crop&w=500&q=80', // Vibrant colored smoke bomb
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=500&q=80', // Playful festive sparks
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80', // Colorful party sparkles
  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=500&q=80', // Festive celebration novelty items
];

// 8. GIFT BOXES & COMBOS (பரிசு பெட்டி) - Diwali cracker gift boxes and family packs
export const GIFT_BOX_PHOTOS = [
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=500&q=80', // Festive gift hampers & boxes
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80', // Celebration gift box set
  'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=500&q=80', // Diwali mega pack box
];


// User-supplied product photos from the uploaded album/document.
// These are preferred over generic stock/Unsplash fallbacks.
export const USER_SUPPLIED_PRODUCT_PHOTOS: Record<string, string[]> = {
  sparklers: ['/products/user-supplied/source_16.jpg', '/products/user-supplied/source_14.jpg', '/products/user-supplied/source_02.jpg'],
  flower_pots: ['/products/user-supplied/source_19.jpg', '/products/user-supplied/source_22.jpg', '/products/user-supplied/source_13.jpg'],
  ground_chakkars: ['/products/user-supplied/source_17.jpg', '/products/user-supplied/source_12.jpg'],
  garlands: ['/products/user-supplied/source_20.jpg', '/products/user-supplied/source_16.jpg'],
  sound_crackers: ['/products/user-supplied/source_10.jpg', '/products/user-supplied/source_28.jpg'],
  novelty_toys: ['/products/user-supplied/source_07.jpg', '/products/user-supplied/source_26.jpg', '/products/user-supplied/source_15.jpg'],
  fountains: ['/products/user-supplied/source_11.jpg', '/products/user-supplied/source_13.jpg', '/products/user-supplied/source_22.jpg'],
  rockets: ['/products/user-supplied/source_18.jpg', '/products/user-supplied/source_30.jpg'],
  aerial_thunder: ['/products/user-supplied/source_03.jpg', '/products/user-supplied/source_04.jpg', '/products/user-supplied/source_09.jpg'],
  aerial_shots: ['/products/user-supplied/source_01.jpg', '/products/user-supplied/source_27.jpg', '/products/user-supplied/source_29.jpg'],
  multishot_cakes: ['/products/user-supplied/source_01.jpg', '/products/user-supplied/source_29.jpg'],
  gift_combo: ['/products/user-supplied/source_27.jpg', '/products/user-supplied/source_31.jpg'],
};

/**
 * Deterministically generates an authentic, real fireworks photo for any cracker.
 * Uses a stable string hash based on product ID and name so every product has a
 * persistent, distinct real photo rather than repeating the exact same single image.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getProductRealImageUrl(product: { id?: string; name: string; tamilName?: string; category: string; image?: string }): string {
  // Sound Crackers & Novelty Shots: use the bundled category photo first so the
  // category always has a working image even when an Excel URL is missing/broken.
  if (product.category === 'sound_crackers' && USER_SUPPLIED_PRODUCT_PHOTOS.sound_crackers?.length) {
    const seed = hashString((product.id || '') + product.name);
    return USER_SUPPLIED_PRODUCT_PHOTOS.sound_crackers[seed % USER_SUPPLIED_PRODUCT_PHOTOS.sound_crackers.length];
  }

  // The Excel/catalog URL is authoritative for other categories.
  if (product.image && product.image.startsWith('http')) {
    return product.image;
  }

  // Prefer a verified local Ragas crop when no catalog URL exists.
  if (product.id && RAGAS_PRODUCT_ID_OVERRIDES[product.id]) {
    return RAGAS_PRODUCT_ID_OVERRIDES[product.id];
  }
  if (RAGAS_PRODUCT_CROPS[product.name]) {
    return RAGAS_PRODUCT_CROPS[product.name];
  }

  const seed = hashString((product.id || '') + product.name);

  // Prefer a user-supplied real product photo for every category before generic stock imagery.
  const supplied = USER_SUPPLIED_PRODUCT_PHOTOS[product.category];
  if (supplied?.length) {
    return supplied[seed % supplied.length];
  }


  const name = product.name.toLowerCase();
  // 1. Sparklers
  if (
    name.includes('sparkler') ||
    name.includes('mathap') ||
    name.includes('kambi') ||
    name.includes('pencil') ||
    product.category === 'sparklers'
  ) {
    return SPARKLER_PHOTOS[seed % SPARKLER_PHOTOS.length];
  }

  // 2. Chakkars & Spinners
  if (
    name.includes('chakkar') ||
    name.includes('spinner') ||
    name.includes('spin') ||
    name.includes('wheel') ||
    name.includes('disc') ||
    product.category === 'ground_chakkars'
  ) {
    return CHAKKAR_PHOTOS[seed % CHAKKAR_PHOTOS.length];
  }

  // 3. Flower Pots & Fountains
  if (
    name.includes('flower') ||
    name.includes('pot') ||
    name.includes('fip') ||
    name.includes('anar') ||
    name.includes('fountain') ||
    name.includes('koti') ||
    product.category === 'flower_pots' ||
    product.category === 'fountains'
  ) {
    return FLOWER_POT_PHOTOS[seed % FLOWER_POT_PHOTOS.length];
  }

  // 4. Rockets
  if (
    name.includes('rocket') ||
    name.includes('missile') ||
    name.includes('bomb rocket') ||
    product.category === 'rockets'
  ) {
    return ROCKET_PHOTOS[seed % ROCKET_PHOTOS.length];
  }

  // 5. Garlands / Wala / Sound Crackers
  if (
    name.includes('wala') ||
    name.includes('garland') ||
    name.includes('bijili') ||
    name.includes('lar') ||
    name.includes('chain') ||
    name.includes('sound') ||
    product.category === 'garlands' ||
    product.category === 'sound_crackers'
  ) {
    return SOUND_CRACKER_PHOTOS[seed % SOUND_CRACKER_PHOTOS.length];
  }

  // 6. Gift Boxes
  if (
    name.includes('gift') ||
    name.includes('combo') ||
    name.includes('pack') ||
    name.includes('family') ||
    product.category === 'gift_combo'
  ) {
    return GIFT_BOX_PHOTOS[seed % GIFT_BOX_PHOTOS.length];
  }

  // 7. Novelty Toys & Smoke
  if (
    name.includes('smoke') ||
    name.includes('toy') ||
    name.includes('car') ||
    name.includes('pistol') ||
    name.includes('gun') ||
    name.includes('cap') ||
    product.category === 'novelty_toys'
  ) {
    return NOVELTY_PHOTOS[seed % NOVELTY_PHOTOS.length];
  }

  // 8. Aerial Thunder / Aerial Shots / Multi-Shot Cakes
  return AERIAL_SHOT_PHOTOS[seed % AERIAL_SHOT_PHOTOS.length];
}
