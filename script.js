/* ==========================================================================
   CHRISTIAN WIJAYA - Luxury Brand Web
   Front-end prototype. Plain JavaScript, no framework, no build step.
   Cart + wishlist + session persist in localStorage.
   Page controllers self-activate by mounting element presence.

   NOTE: this file is deliberately ASCII-only. Typography inside injected
   HTML uses entities (&middot; &mdash;); user-facing strings built with
   textContent use plain ASCII separators, so the file survives any
   file-encoding round-trip without corrupting visible copy.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     1. CONFIG
     ====================================================================== */
  /* Single source of truth for money. Indonesia is the default market, so
     every price, shipping figure and tax figure on the site is Indonesian
     Rupiah and is formatted by money() below - nothing hard-codes a symbol
     or a group separator anywhere else in the codebase. */
  const CONFIG = {
    currency: 'IDR',
    locale: 'id-ID',
    freeShippingThreshold: 1500000,
    shippingFlat: 25000,
    taxRate: 0.08
  };

  const IMG = 'img/opt/';

  /* ======================================================================
     2. UTILITIES
     ====================================================================== */
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* Rupiah never carries decimals, and id-ID groups with a full stop:
     385000 -> "Rp 385.000". */
  const money = (n) =>
    new Intl.NumberFormat(CONFIG.locale, {
      style: 'currency',
      currency: CONFIG.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(n);

  /* Shown wherever a figure is genuinely zero, so an order total never
     reads "Rp 0". */
  const moneyOrFree = (n, freeLabel) =>
    n === 0 ? (freeLabel || 'Free') : money(n);

  const escapeHTML = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable (private mode) - prototype continues in memory */
    }
  }

  const debounce = (fn, wait) => {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  /* ======================================================================
     3. ICONS
     ====================================================================== */
  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    bagEmpty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9 13h6"/></svg>'
  };

  /* ======================================================================
     4. BRAND ARCHITECTURE + PRODUCT DATA - single source of truth

        CHRISTIAN WIJAYA  (parent / the fashion house)
          `-- CW / PREMIUM  (sub-brand / the product line)

        Every product in the catalogue carries the sub-brand. Categories
        are NOT brands: Men, Women, Shoes and Accessories are the four
        rooms the line is organised into.
     ====================================================================== */
  const HOUSE = {
    name: 'CHRISTIAN WIJAYA',
    sub: 'Luxury Fashion',
    founded: '2016',
    city: 'Bandung'
  };

  const LINE = {
    id: 'cw-premium',
    name: 'CW / PREMIUM',
    tagline: 'Contemporary Luxury',
    season: 'Autumn / Winter 2026',
    intro:
      'The first line from the house. Contemporary luxury built on a small ' +
      'run of pieces that sit beside one another - tailoring, leather and ' +
      'fine jewellery, cut and finished by hand in Bandung.'
  };

  /* Prices are Rupiah and span 320.000 - 1.940.000 (sale prices reach
     2.450.000), so the shop price slider runs 300.000 - 2.500.000. These
     two constants are the single source for the slider floor and ceiling. */
  const PRICE_MIN = 300000;
  const PRICE_MAX = 2500000;

  const CATEGORIES = [
    { id: 'men',         label: 'Men',         img: 'mohamad-khosravi-VSZLQcc4LSw-unsplash' },
    { id: 'women',       label: 'Women',       img: 'alex-shaw-GcA8PoYjKB0-unsplash' },
    { id: 'shoes',       label: 'Shoes',       img: 'joel-zar-jrOuxQ9iRlM-unsplash' },
    { id: 'accessories', label: 'Accessories', img: 'ivan-kazlouskij-GT19NqJySFA-unsplash' }
  ];

  const PRODUCTS = [
    /* ---------------- CW / PREMIUM - MEN ---------------- */
    {
      id: 'premium-tailored-blazer', name: 'Tailored Wool Blazer', price: 1890000, oldPrice: 2450000,
      category: 'men', brand: 'CW / PREMIUM', rating: 4.8, reviews: 124,
      colors: ['Black', 'Charcoal'], sizes: ['46', '48', '50', '52', '54'],
      images: ['mohamad-khosravi-VSZLQcc4LSw-unsplash', 'bruchin-noeka-N9G5GL9VewE-unsplash', 'zhouxing-lu-1fdni7Dkfs8-unsplash'],
      views: ['Worn', 'Styled', 'Detail'],
      alts: [
        'Model walking outdoors in a black wool tailored blazer',
        'Blazer styled as a three-piece in stone check',
        'Close detail of the blazer worn over a white shirt'
      ],
      badge: 'sale',
      blurb: 'A single-breasted blazer cut in a 290g Super 120s wool with a half-canvas construction.',
      details: ['290g Super 120s virgin wool', 'Half-canvas construction', 'Horn buttons', 'Made in Indonesia'],
      soldOutSizes: ['54']
    },
    {
      id: 'premium-oxford-shirt', name: 'Essential Oxford Shirt', price: 385000,
      category: 'men', brand: 'CW / PREMIUM', rating: 4.4, reviews: 143,
      colors: ['White', 'Blue'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: ['zhouxing-lu-1fdni7Dkfs8-unsplash', 'bruchin-noeka-N9G5GL9VewE-unsplash', 'marcus-lewis-wGuQH9JPcEY-unsplash'],
      views: ['Worn', 'Styled', 'Detail'],
      alts: [
        'White Oxford shirt worn with a dark jacket and cropped trousers',
        'Oxford shirt shown beneath a checked suit jacket',
        'Close view of the shirt collar and placket'
      ],
      blurb: 'A soft-washed Oxford with an unlined collar that sits naturally after wear.',
      details: ['100% long-staple cotton', 'Unlined button-down collar', 'Mother-of-pearl buttons', 'Machine washable'],
      soldOutSizes: ['XXL']
    },
    {
      id: 'premium-modern-trousers', name: 'Modern Pleated Trouser', price: 620000,
      category: 'men', brand: 'CW / PREMIUM', rating: 4.5, reviews: 67,
      colors: ['Stone', 'Black'], sizes: ['28', '30', '32', '34', '36'],
      images: ['zhouxing-lu-1fdni7Dkfs8-unsplash', 'bruchin-noeka-N9G5GL9VewE-unsplash', 'mohamad-khosravi-VSZLQcc4LSw-unsplash'],
      views: ['Detail', 'Styled', 'Worn'],
      alts: [
        'Close detail of cropped tailored trousers with a shirt and jacket',
        'Trouser shown with a checked three-piece suit',
        'Full-length view of the trouser with a wool blazer'
      ],
      blurb: 'A cropped, double-pleat trouser designed to break cleanly over the instep.',
      details: ['Tropical wool blend', 'Double front pleat', 'Extended waist tab', 'Hook-and-bar closure'],
      soldOutSizes: []
    },
    {
      id: 'premium-linen-shirt', name: 'Relaxed Linen Shirt', price: 540000, oldPrice: 720000,
      category: 'men', brand: 'CW / PREMIUM', rating: 4.6, reviews: 91,
      colors: ['Ivory', 'Camel'], sizes: ['S', 'M', 'L', 'XL'],
      images: ['glassesshop-u3o3O67mrJo-unsplash', 'zhouxing-lu-1fdni7Dkfs8-unsplash', 'alexander-naglestad-RFhq0SrrgEg-unsplash'],
      views: ['Worn', 'Detail', 'Styled'],
      alts: [
        'Model wearing a relaxed ivory linen shirt with an open collar',
        'Close view of the linen shirt cuff and placket',
        'Linen shirt photographed on a stand in the atelier'
      ],
      blurb: 'A washed European linen shirt with a soft shoulder and a collar that holds its roll.',
      details: ['100% washed European linen', 'Soft unpadded shoulder', 'Camp collar', 'Machine washable'],
      soldOutSizes: []
    },
    {
      id: 'premium-signature-polo', name: 'Signature Knit Polo', price: 470000,
      category: 'men', brand: 'CW / PREMIUM', rating: 4.7, reviews: 74,
      colors: ['Black', 'Navy', 'Ivory'], sizes: ['S', 'M', 'L', 'XL'],
      images: ['marcus-lewis-wGuQH9JPcEY-unsplash', 'zhouxing-lu-1fdni7Dkfs8-unsplash', 'bruchin-noeka-N9G5GL9VewE-unsplash'],
      views: ['Worn', 'Detail', 'Styled'],
      alts: [
        'Knit polo worn with tailored trousers',
        'Close view of the ribbed collar and knit texture',
        'Knit polo layered under a checked jacket'
      ],
      blurb: 'A fine-gauge knit polo with a ribbed collar, knitted in a weight that holds its shape.',
      details: ['Fine-gauge merino blend', 'Ribbed collar and cuffs', 'Two-button placket', 'Made in Bandung'],
      soldOutSizes: ['S']
    },

    /* ---------------- CW / PREMIUM - WOMEN ---------------- */
    {
      id: 'premium-structured-blazer', name: 'Structured Wool Blazer', price: 1290000, oldPrice: 1610000,
      category: 'women', brand: 'CW / PREMIUM', rating: 4.7, reviews: 82,
      colors: ['Black', 'Ivory'], sizes: ['XS', 'S', 'M', 'L'],
      images: ['azamat-zhanisov-oghf91mQ0-Q-unsplash', 'alex-shaw-GcA8PoYjKB0-unsplash', 'alex-shaw-GrxqPNpMK40-unsplash'],
      views: ['Worn', 'Styled', 'Detail'],
      alts: [
        'Model wearing a structured black wool blazer',
        'Blazer worn with ivory wide-leg trousers and a leather tote',
        'Close view of the blazer lapel and shoulder line'
      ],
      blurb: 'A softly structured blazer with a nipped waist and a notch lapel that holds its roll.',
      details: ['Wool-blend suiting', 'Nipped waist', 'Notched lapel', 'Half lined in cupro'],
      soldOutSizes: []
    },
    {
      id: 'premium-silk-evening-dress', name: 'Silk Evening Dress', price: 1680000,
      category: 'women', brand: 'CW / PREMIUM', rating: 4.8, reviews: 97,
      colors: ['Cream', 'Black'], sizes: ['XS', 'S', 'M', 'L'],
      images: ['azamat-zhanisov-oghf91mQ0-Q-unsplash', 'alex-shaw-GrxqPNpMK40-unsplash', 'marcus-lewis-wGuQH9JPcEY-unsplash'],
      views: ['Worn', 'Styled', 'Detail'],
      alts: [
        'Model wearing a cream silk evening dress with sunglasses',
        'Evening dress styled with a silk blouse and tailored trousers',
        'Close view of the silk drape at the shoulder seam'
      ],
      blurb: 'A bias-cut silk column that falls from a single shoulder seam and moves as one line.',
      details: ['100% mulberry silk', 'Bias cut', 'Concealed side zip', 'Dry clean only'],
      soldOutSizes: ['XS']
    },
    {
      id: 'premium-wide-pants', name: 'Tailored Wide-Leg Trouser', price: 720000,
      category: 'women', brand: 'CW / PREMIUM', rating: 4.7, reviews: 112,
      colors: ['Ivory', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
      images: ['alex-shaw-GcA8PoYjKB0-unsplash', 'alex-shaw-GrxqPNpMK40-unsplash', 'azamat-zhanisov-oghf91mQ0-Q-unsplash'],
      views: ['Worn', 'Styled', 'Detail'],
      alts: [
        'Model wearing ivory wide-leg tailored trousers with a silk blouse and tote',
        'Wide-leg trouser styled in an all-ivory look',
        'Close view of the pressed crease down the trouser leg'
      ],
      blurb: 'A high-rise trouser with a pressed crease and a fluid, full-length leg.',
      details: ['Wool crepe', 'High rise', 'Pressed crease', 'Concealed hook closure'],
      soldOutSizes: []
    },
    {
      id: 'premium-signature-shirt', name: 'Signature Silk Shirt', price: 540000, oldPrice: 810000,
      category: 'women', brand: 'CW / PREMIUM', rating: 4.6, reviews: 78,
      colors: ['Black', 'Ivory'], sizes: ['XS', 'S', 'M', 'L'],
      images: ['alex-shaw-GrxqPNpMK40-unsplash', 'alex-shaw-GcA8PoYjKB0-unsplash', 'azamat-zhanisov-oghf91mQ0-Q-unsplash'],
      views: ['Worn', 'Styled', 'Detail'],
      alts: [
        'Model wearing a sheer black silk shirt with ivory trousers',
        'Silk shirt styled with a leather tote and tailored trousers',
        'Close view of the silk shirt stand collar and covered placket'
      ],
      blurb: 'A featherweight silk organza shirt with a stand collar and a covered placket.',
      details: ['Silk organza', 'Stand collar', 'Covered placket', 'Dry clean only'],
      soldOutSizes: []
    },
    {
      id: 'premium-minimalist-coat', name: 'Minimalist Wool Coat', price: 1940000,
      category: 'women', brand: 'CW / PREMIUM', rating: 4.9, reviews: 64,
      colors: ['Ivory'], sizes: ['XS', 'S', 'M', 'L'],
      images: ['alex-shaw-GcA8PoYjKB0-unsplash', 'azamat-zhanisov-oghf91mQ0-Q-unsplash', 'alexander-naglestad-RFhq0SrrgEg-unsplash'],
      views: ['Worn', 'Styled', 'Detail'],
      alts: [
        'Model wearing an ivory wool coat over cream trousers',
        'Wool coat styled as outerwear over an evening look',
        'Coat photographed on a stand in the atelier'
      ],
      blurb: 'A clean, collarless midi coat in a double-faced wool that needs no lining.',
      details: ['Double-faced wool', 'Collarless', 'Unlined construction', 'Dry clean only'],
      soldOutSizes: []
    },

    /* ---------------- CW / PREMIUM - SHOES ---------------- */
    {
      id: 'premium-leather-loafer', name: 'Classic Leather Loafer', price: 890000,
      category: 'shoes', brand: 'CW / PREMIUM', rating: 4.9, reviews: 41,
      colors: ['Black', 'Espresso'], sizes: ['40', '41', '42', '43', '44', '45'],
      images: ['davinder-singh-2nST4hbvTkc-unsplash', 'bruchin-noeka-N9G5GL9VewE-unsplash', 'zhouxing-lu-1fdni7Dkfs8-unsplash'],
      views: ['Product', 'Worn', 'Detail'],
      alts: [
        'Pair of black leather loafers on a wooden surface',
        'Loafer worn with a stone checked three-piece suit',
        'Close view of the loafer welt and hand-stitched seam'
      ],
      blurb: 'A hand-stitched penny loafer in calf leather, Goodyear welted for a lifetime of wear.',
      details: ['Calf leather upper', 'Goodyear welted', 'Leather sole', 'Hand-stitched welt'],
      soldOutSizes: ['45']
    },
    {
      id: 'premium-satin-heels', name: 'Satin Stiletto Heel', price: 780000,
      category: 'shoes', brand: 'CW / PREMIUM', rating: 4.8, reviews: 88,
      colors: ['Champagne', 'Black'], sizes: ['35', '36', '37', '38', '39', '40'],
      images: ['joel-zar-jrOuxQ9iRlM-unsplash', 'marcus-lewis-wGuQH9JPcEY-unsplash', 'alex-shaw-GrxqPNpMK40-unsplash'],
      views: ['Product', 'Worn', 'Detail'],
      alts: [
        'Pair of champagne satin stiletto heels with a gold bow detail',
        'Heels worn with an ivory dress in a garden',
        'Close view of the satin upper and leather sole'
      ],
      blurb: 'A 90mm satin pump finished with a hand-set gold bow at the toe.',
      details: ['90mm heel', 'Satin upper', 'Leather sole', 'Hand-set gold bow'],
      soldOutSizes: ['35', '40']
    },
    {
      id: 'premium-court-trainer', name: 'Minimal Court Trainer', price: 620000,
      category: 'shoes', brand: 'CW / PREMIUM', rating: 4.6, reviews: 134,
      colors: ['White', 'Off-White'], sizes: ['39', '40', '41', '42', '43', '44'],
      images: ['raoul-croes-94KcLYsihLY-unsplash', 'nikita-kachanovsky-ad_0wMHtvlU-unsplash', 'kier-in-sight-archives-R0mbwH2wxj0-unsplash'],
      views: ['Product', 'Studio', 'Detail'],
      alts: [
        'Minimal white leather court trainer on a studio background',
        'White court trainer photographed on a plain studio backdrop',
        'Close view of the trainer cup sole and unstitched panel'
      ],
      blurb: 'An unstitched court trainer in smooth calf leather on a slim rubber cup sole.',
      details: ['Smooth calf leather', 'Unstitched panels', 'Cushioned insole', 'Rubber cup sole'],
      soldOutSizes: []
    },

    /* ---------------- CW / PREMIUM - ACCESSORIES ---------------- */
    {
      id: 'premium-leather-tote', name: 'Premium Leather Tote', price: 1150000, oldPrice: 1470000,
      category: 'accessories', brand: 'CW / PREMIUM', rating: 4.9, reviews: 61,
      colors: ['Cognac', 'Black'], sizes: ['One Size'],
      images: ['personalgraphic-com-zxPo13geJ5U-unsplash', 'ivan-kazlouskij-GT19NqJySFA-unsplash', 'alex-shaw-GcA8PoYjKB0-unsplash'],
      views: ['Product', 'Styled', 'Detail'],
      alts: [
        'Cognac leather tote with a hand-stitched handle on a white background',
        'Leather bag styled on a cream armchair',
        'Close view of the tote handle stitching and brass hardware'
      ],
      blurb: 'A structured tote in full-grain leather with a hand-stitched handle that softens with wear.',
      details: ['Full-grain leather', 'Hand-stitched handle', 'Brass hardware', 'Fits a 13-inch laptop'],
      soldOutSizes: []
    },
    {
      id: 'premium-leather-belt', name: 'Signature Leather Belt', price: 320000,
      category: 'accessories', brand: 'CW / PREMIUM', rating: 4.7, reviews: 103,
      colors: ['Espresso', 'Black'], sizes: ['85', '90', '95', '100'],
      images: ['ivan-kazlouskij-GT19NqJySFA-unsplash', 'personalgraphic-com-zxPo13geJ5U-unsplash', 'zhouxing-lu-1fdni7Dkfs8-unsplash'],
      views: ['Product', 'Styled', 'Detail'],
      alts: [
        'Vegetable-tanned leather belt with a solid brass buckle',
        'Leather belt styled with tailored trousers',
        'Close view of the belt buckle and edge paint'
      ],
      blurb: 'A single-kick vegetable-tanned belt with a solid brass buckle and a hand-burnished edge.',
      details: ['Vegetable-tanned leather', 'Solid brass buckle', 'Hand-burnished edge', 'Made in Bandung'],
      soldOutSizes: []
    },
    {
      id: 'premium-gold-layered-set', name: '18K Gold Layered Set', price: 840000,
      category: 'accessories', brand: 'CW / PREMIUM', rating: 4.7, reviews: 103,
      colors: ['Gold'], sizes: ['One Size'],
      images: ['segal-jewelry-NsH-CvU0deg-unsplash', 'eric-fung-Z0GZrpwcc5Y-unsplash', 'alex-shaw-GrxqPNpMK40-unsplash'],
      views: ['Worn', 'Product', 'Detail'],
      alts: [
        'Model wearing a layered 18K gold necklace and rings',
        'Fine gold jewellery arranged on a cream surface',
        'Close view of the gold chain and pendant layering'
      ],
      blurb: 'Three graduated gold chains paired with a slim drop pendant and two stacking rings.',
      details: ['18K gold vermeil', 'Set of three chains', 'Adjustable 45cm length', 'Hypoallergenic posts'],
      soldOutSizes: []
    }
  ];

  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  /* Colour is the shop's faceted dimension in place of the old house list,
     so it is derived from the data rather than hand-maintained. */
  const COLOURS = Array.from(
    PRODUCTS.reduce((set, p) => {
      p.colors.forEach((c) => set.add(c));
      return set;
    }, new Set())
  ).sort();

  const countByCategory = (id) => PRODUCTS.filter((p) => p.category === id).length;

  /* ======================================================================
     4b. DELIVERY SPEEDS - single source of truth

         The checkout radios, the order summary, the cart total and the
         confirmation ETA all read from this list. Adding a speed here is
         enough for it to appear everywhere; nothing is hard-coded per page.
     ====================================================================== */
  const SHIPPING_METHODS = [
    { id: 'standard', title: 'Standard Delivery', days: '3 to 5 working days', workingDays: 4 },
    { id: 'express',  title: 'Express Delivery',  days: '1 to 2 working days', workingDays: 2 }
  ];

  const shippingMethod = (id) =>
    SHIPPING_METHODS.find((s) => s.id === id) || SHIPPING_METHODS[0];

  /* Standard delivery is complimentary; express costs the flat rate. The
     free-shipping threshold is announcement-bar copy, not a second rule
     competing with these two numbers. */
  const shippingPrice = (id) => (id === 'express' ? CONFIG.shippingFlat : 0);

  const shippingNote = (id) => {
    const s = shippingMethod(id);
    const price = shippingPrice(s.id);
    return (price === 0 ? 'FREE' : money(price)) + ' - arrives in ' + s.days;
  };

  const Shipping = {
    _id: null,

    selected() {
      if (this._id === null) this._id = shippingMethod(readStore('cw_shipping', 'standard')).id;
      return this._id;
    },

    set(id) {
      this._id = shippingMethod(id).id;
      writeStore('cw_shipping', this._id);
    },

    /* Working days for the chosen speed, used by the confirmation ETA. */
    etaDays() {
      return shippingMethod(this.selected()).workingDays;
    }
  };

  /* ======================================================================
     5. STORE - cart, wishlist, session
     ====================================================================== */
  const Store = {
    _subs: [],
    /* Every consumer of the cart - badge, cart page, checkout summary and
       totals - reads it through here, so they cannot disagree.

       A line survives only if the catalogue can still resolve it to a real
       product, a real variant and a sane quantity. Anything else is
       dropped. A cart saved by an older build of the site can carry
       product ids this catalogue no longer knows, and those lines used to
       inflate the navbar badge while being silently skipped by the
       checkout summary and priced at zero by the totals. Normalising once,
       on the way in, removes that whole class of desync. */
    normalise(raw) {
      const list = Array.isArray(raw) ? raw : [];
      const out = [];
      list.forEach((l) => {
        if (!l || typeof l !== 'object') return;
        const p = byId(l.id);
        if (!p) return;

        const qty = Math.min(10, Math.max(1, Math.round(Number(l.qty) || 0) || 1));
        const color = p.colors.indexOf(l.color) > -1 ? l.color : p.colors[0];
        const size = p.sizes.indexOf(l.size) > -1 ? l.size : p.sizes[0];

        /* Two lines resolving to the same variant are one line, so a
           repeated id can never be double-counted by one view and merged
           by another. */
        const key = p.id + '::' + color + '::' + size;
        const twin = out.find((x) => x.id + '::' + x.color + '::' + x.size === key);
        if (twin) {
          twin.qty = Math.min(10, twin.qty + qty);
          return;
        }
        out.push({ id: p.id, qty: qty, color: color, size: size });
      });
      return out;
    },

    _read() {
      return {
        cart: this.normalise(readStore('cw_cart', [])),
        wishlist: readStore('cw_wishlist', []),
        user: readStore('cw_user', null)
      };
    },

    state() {
      if (!this._cache) this._cache = this._read();
      return this._cache;
    },

    sync(key) {
      writeStore('cw_' + key, this.state()[key]);
      this._subs.forEach((fn) => fn(this.state()));
    },

    subscribe(fn) {
      this._subs.push(fn);
      fn(this.state());
    },

    /* --- cart ---
       The badge is TOTAL QUANTITY (sum of every line's qty), not a count
       of distinct products. The checkout summary prints a per-line "Qty n"
       breakdown and an explicit item total, and those per-line quantities
       always sum to exactly this number because both read the normalised
       cart below. */
    cartCount() {
      return this.state().cart.reduce((n, l) => n + l.qty, 0);
    },

    /* Lines that survive normalisation. The only cart view any consumer
       should use, so the badge, the cart page and the checkout summary are
       guaranteed to be describing the same set of lines. */
    cartLines() {
      return this.state().cart.filter((l) => byId(l.id));
    },

    addToCart(id, qty, variant) {
      const p = byId(id);
      if (!p) return false;
      const requested = Math.min(10, Math.max(1, Math.round(Number(qty) || 0) || 1));
      const color = p.colors.indexOf(variant && variant.color) > -1
        ? variant.color
        : p.colors[0];
      const size = p.sizes.indexOf(variant && variant.size) > -1
        ? variant.size
        : p.sizes[0];

      const cart = this.state().cart;
      const found = cart.find((l) => l.id + '::' + l.color + '::' + l.size === p.id + '::' + color + '::' + size);
      /* Clamped to the same 10-per-line ceiling setQty enforces, so the
         ceiling holds whether a line is grown here or from the cart page. */
      if (found) found.qty = Math.min(10, found.qty + requested);
      else cart.push({ id: p.id, qty: requested, color: color, size: size });
      this.sync('cart');
      return true;
    },

    setQty(key, qty) {
      const cart = this.state().cart;
      const i = cart.findIndex((l) => l.id + '::' + l.color + '::' + l.size === key);
      if (i < 0) return;
      if (qty <= 0) cart.splice(i, 1);
      else cart[i].qty = Math.min(qty, 10);
      this.sync('cart');
    },

    removeLine(key) {
      const cart = this.state().cart;
      const i = cart.findIndex((l) => l.id + '::' + l.color + '::' + l.size === key);
      if (i > -1) cart.splice(i, 1);
      this.sync('cart');
    },

    clearCart() {
      this.state().cart.length = 0;
      this.sync('cart');
    },

    /* Derived entirely from the normalised cart and the selected delivery
       speed. Nothing here is typed in by hand, and every figure on the cart
       page, the checkout summary and the confirmation comes from this one
       function. */
    totals() {
      const lines = this.cartLines();
      const subtotal = lines.reduce((sum, l) => sum + byId(l.id).price * l.qty, 0);
      const method = Shipping.selected();
      const shipping = subtotal === 0 ? 0 : shippingPrice(method);
      const tax = Math.round(subtotal * CONFIG.taxRate);
      return {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: subtotal + shipping + tax,
        items: lines.reduce((n, l) => n + l.qty, 0),
        method: method
      };
    },

    /* --- wishlist --- */
    isWishlisted(id) {
      return this.state().wishlist.indexOf(id) > -1;
    },

    toggleWishlist(id) {
      const w = this.state().wishlist;
      const i = w.indexOf(id);
      if (i > -1) w.splice(i, 1);
      else w.push(id);
      this.sync('wishlist');
      return this.isWishlisted(id);
    },

    wishlistCount() {
      return this.state().wishlist.length;
    },

    /* --- session --- */
    login(user) {
      this.state().user = user;
      this.sync('user');
    },

    logout() {
      this.state().user = null;
      this.sync('user');
    }
  };

  /* ======================================================================
     6. TOASTS - visible feedback after every action
     ====================================================================== */
  const Toast = {
    stack: null,

    mount() {
      if (this.stack) return;
      const el = document.createElement('div');
      el.className = 'toast-stack';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
      this.stack = el;
    },

    show(title, detail, tone) {
      this.mount();
      const t = document.createElement('div');
      t.className = 'toast' + (tone ? ' toast--' + tone : '');
      t.innerHTML =
        '<span class="toast__icon">' + ICON.check + '</span>' +
        '<span class="toast__body"><strong>' + escapeHTML(title) + '</strong>' +
        (detail ? '<span>' + escapeHTML(detail) + '</span>' : '') +
        '</span>';
      this.stack.appendChild(t);
      requestAnimationFrame(() => t.classList.add('is-visible'));
      setTimeout(() => {
        t.classList.remove('is-visible');
        setTimeout(() => t.remove(), 320);
      }, 3200);
    }
  };

  /* ======================================================================
     7. HEADER - drawer, search, badges
     ====================================================================== */
  const Header = {
    init() {
      this.drawer = qs('.nav-drawer');
      this.toggle = qs('.nav-toggle');
      this.searchWrap = qs('.nav-search');

      if (this.toggle) {
        this.toggle.addEventListener('click', () => {
          this.drawer.classList.contains('is-open') ? this.closeDrawer() : this.openDrawer();
        });
      }

      const closeBtn = qs('.nav-drawer__close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
      const scrim = qs('.nav-drawer__scrim');
      if (scrim) scrim.addEventListener('click', () => this.closeDrawer());

      qsa('.nav-drawer a').forEach((a) =>
        a.addEventListener('click', () => this.closeDrawer())
      );

      const searchBtn = qs('[data-search-toggle]');
      if (searchBtn && this.searchWrap) {
        searchBtn.addEventListener('click', () => {
          const open = this.searchWrap.classList.toggle('is-open');
          searchBtn.setAttribute('aria-expanded', String(open));
          if (open) qs('.nav-search__input', this.searchWrap).focus();
        });
      }

      /* header search submits into the shop page */
      const form = qs('.nav-search');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = qs('.nav-search__input', form);
          const q = input.value.trim();
          if (window.location.pathname.endsWith('shop.html')) {
            window.dispatchEvent(new CustomEvent('cw:shop-search', { detail: q }));
          } else {
            window.location.href = 'shop.html' + (q ? '?q=' + encodeURIComponent(q) : '');
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer && this.drawer.classList.contains('is-open')) {
          this.closeDrawer();
          this.toggle.focus();
        }
      });

      qsa('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

      this.paint();
      Store.subscribe(() => this.paint());
    },

    paint() {
      const c = Store.cartCount();
      const w = Store.wishlistCount();

      qsa('[data-cart-count]').forEach((el) => {
        el.textContent = c > 99 ? '99+' : String(c);
        el.setAttribute('data-count', String(c));
      });
      qsa('[data-wish-count]').forEach((el) => {
        el.textContent = String(w);
        el.setAttribute('data-count', String(w));
      });
      qsa('[data-wish-sr]').forEach((el) => {
        el.textContent = w + (w === 1 ? ' wishlist item' : ' wishlist items');
      });
      qsa('[data-cart-sr]').forEach((el) => {
        el.textContent = c + (c === 1 ? ' item in cart' : ' items in cart');
      });

      const user = Store.state().user;
      qsa('[data-auth-label]').forEach((el) => {
        el.textContent = user ? user.name.split(' ')[0] : 'Login';
      });
      qsa('[data-auth-action]').forEach((el) => {
        el.setAttribute('data-mode', user ? 'logout' : 'login');
      });
    },

    openDrawer() {
      this.drawer.classList.add('is-open');
      this.toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      const first = qs('.nav-drawer__close');
      if (first) first.focus();
    },

    closeDrawer() {
      this.drawer.classList.remove('is-open');
      this.toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
    }
  };

  /* ======================================================================
     8. AUTH MODAL - login / sign up with validation
     ====================================================================== */
  const Auth = {
    init() {
      this.modal = qs('#auth-modal');
      if (!this.modal) return;
      this.lastFocus = null;

      qsa('[data-auth-open]').forEach((btn) =>
        btn.addEventListener('click', () => this.open(btn.getAttribute('data-auth-open') || 'login'))
      );

      qs('.modal__scrim', this.modal).addEventListener('click', () => this.close());
      qs('[data-auth-close]', this.modal).addEventListener('click', () => this.close());

      qsa('.tab', this.modal).forEach((tab) =>
        tab.addEventListener('click', () => this.showTab(tab.getAttribute('data-tab')))
      );

      qsa('[data-tab-jump]', this.modal).forEach((b) =>
        b.addEventListener('click', () => this.showTab(b.getAttribute('data-tab-jump')))
      );

      /* forgot password - prototype feedback, no backend */
      qsa('[data-forgot]', this.modal).forEach((b) =>
        b.addEventListener('click', () => {
          const msg = qs('[data-auth-message]', this.modal);
          const email = qs('#login-email').value.trim();
          if (!msg) return;
          msg.hidden = false;
          msg.className = 'notice notice--success';
          msg.textContent = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
            ? 'If ' + email + ' has an account, a reset link is on its way.'
            : 'Enter your email address above and we will send a reset link.';
        })
      );

      this.modal.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.id === 'login-form') this.doLogin(form);
        if (form.id === 'signup-form') this.doSignup(form);
      });

      this.modal.addEventListener('input', (e) => {
        const f = e.target.closest('.field');
        if (f) f.classList.remove('is-invalid');
      });

      document.addEventListener('keydown', (e) => {
        if (!this.modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') { this.close(); return; }
        if (e.key === 'Tab') this.trap(e);
      });

      qsa('[data-auth-action]').forEach((btn) =>
        btn.addEventListener('click', () => {
          if (btn.getAttribute('data-mode') === 'logout') {
            Store.logout();
            Toast.show('Signed out', 'You have been logged out.');
          } else {
            this.open('login');
          }
        })
      );
    },

    trap(e) {
      const f = qsa(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        this.modal
      ).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    },

    open(mode) {
      const user = Store.state().user;
      if (mode === 'logout' && user) { Store.logout(); Toast.show('Signed out', ''); return; }
      this.lastFocus = document.activeElement;
      this.modal.classList.add('is-open');
      document.body.classList.add('is-locked');
      this.modal.setAttribute('aria-hidden', 'false');
      this.showTab(mode || 'login');
      /* Focus must land after the visibility flip but before paint.
         A setTimeout here is too fragile for keyboard users, and a single
         rAF can still run before the panel is focusable in some engines,
         so retry on the next frame if the first attempt did not stick. */
      const focusFirst = (attempt) => {
        const first = qs('.modal__panel input', this.modal);
        if (!first) return;
        first.focus();
        const landed = document.activeElement === first;
        if (!landed && attempt < 5) requestAnimationFrame(() => focusFirst(attempt + 1));
      };
      requestAnimationFrame(() => focusFirst(0));
    },

    close() {
      this.modal.classList.remove('is-open');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      this.resetForm('login-form');
      this.resetForm('signup-form');
      if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus();
    },

    showTab(name) {
      qsa('.tab', this.modal).forEach((t) =>
        t.setAttribute('aria-selected', String(t.getAttribute('data-tab') === name))
      );
      qsa('.tabpanel', this.modal).forEach((p) =>
        (p.hidden = p.getAttribute('data-panel') !== name)
      );
      const msg = qs('[data-auth-message]', this.modal);
      if (msg) { msg.textContent = ''; msg.className = 'notice'; msg.hidden = true; }
    },

    resetForm(id) {
      const f = qs('#' + id);
      if (f) f.reset();
      const panel = f ? f.closest('.tabpanel') : null;
      if (panel) qsa('.field', panel).forEach((f2) => f2.classList.remove('is-invalid'));
    },

    fail(form, name, message) {
      const field = qs('[name="' + name + '"]', form);
      if (!field) return;
      const wrap = field.closest('.field');
      if (wrap) {
        wrap.classList.add('is-invalid');
        const err = qs('.field__error', wrap);
        if (err) err.textContent = message;
      }
      field.focus();
    },

    doLogin(form) {
      const email = form.email.value.trim();
      const pass = form.password.value;
      let ok = true;

      if (!email) { this.fail(form, 'email', 'Enter your email address.'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        this.fail(form, 'email', 'Enter a valid email address.'); ok = false;
      }
      if (!pass) { this.fail(form, 'password', 'Enter your password.'); ok = false; }
      else if (pass.length < 8) {
        this.fail(form, 'password', 'Password must be at least 8 characters.'); ok = false;
      }
      if (!ok) return;

      const name = email.split('@')[0].replace(/[._-]+/g, ' ');
      Store.login({
        name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email,
        remember: form.remember.checked
      });
      this.close();
      Toast.show('Welcome back', 'Signed in as ' + email, 'success');
    },

    doSignup(form) {
      const name = form.fullname.value.trim();
      const email = form.email.value.trim();
      const pass = form.password.value;
      const confirm = form.confirm.value;
      let ok = true;

      if (!name) { this.fail(form, 'fullname', 'Enter your full name.'); ok = false; }
      else if (name.length < 2) { this.fail(form, 'fullname', 'Name is too short.'); ok = false; }

      if (!email) { this.fail(form, 'email', 'Enter your email address.'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        this.fail(form, 'email', 'Enter a valid email address.'); ok = false;
      }

      if (!pass) { this.fail(form, 'password', 'Choose a password.'); ok = false; }
      else if (pass.length < 8) {
        this.fail(form, 'password', 'Use at least 8 characters.'); ok = false;
      }

      if (pass !== confirm) {
        this.fail(form, 'confirm', 'Passwords do not match.'); ok = false;
      }

      if (!form.terms.checked) {
        const t = form.terms.closest('.check');
        if (t) t.style.color = 'var(--danger)';
        form.terms.focus();
        ok = false;
      }

      if (!ok) return;

      Store.login({ name: name, email: email, remember: true });
      this.close();
      Toast.show('Account created', 'Welcome to CHRISTIAN WIJAYA, ' + name, 'success');
    }
  };

  /* ======================================================================
     9. SHARED COMPONENTS
     ====================================================================== */
  function starsHTML(rating) {
    const pct = (rating / 5) * 100;
    /* The fill MUST be a child of the positioned .rating__stars span.
       As a sibling it resolves against the nearest positioned ancestor
       (.product-card) and flies to the top-left of the card. */
    return (
      '<span class="rating">' +
        '<span class="rating__stars" aria-hidden="true">' +
          '<span class="rating__stars--base">&#9733;&#9733;&#9733;&#9733;&#9733;</span>' +
          '<span class="rating__stars--fill" style="width:' + pct + '%">&#9733;&#9733;&#9733;&#9733;&#9733;</span>' +
        '</span>' +
      '</span>'
    );
  }

  function ratingText(p) {
    return p.rating.toFixed(1) + ' out of 5, ' + p.reviews + ' reviews';
  }

  function wishlistButton(p) {
    const on = Store.isWishlisted(p.id);
    return (
      '<button type="button" class="wish" data-wish="' + p.id + '" aria-pressed="' + on + '" ' +
      'aria-label="' + (on ? 'Remove' : 'Add') + ' ' + escapeHTML(p.name) +
      (on ? ' from' : ' to') + ' wishlist">' + ICON.heart + '</button>'
    );
  }

  function productCardHTML(p, opts) {
    opts = opts || {};
    const cat = CATEGORIES.find((c) => c.id === p.category);
    const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

    let badges = '';
    if (p.badge === 'sale' && p.oldPrice) badges += '<span class="badge badge--sale">-' + off + '%</span>';
    if (p.soldOutSizes.length >= p.sizes.length) badges += '<span class="badge">Sold out</span>';
    if (!badges && opts.tag) badges += '<span class="badge badge--soft">' + escapeHTML(opts.tag) + '</span>';

    return (
      '<article class="product-card">' +
        '<div class="product-card__media">' +
          '<a href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' +
            '<img class="product-card__img" src="' + IMG + p.images[0] + '--700.jpg" ' +
              'alt="" loading="lazy" width="700" height="933">' +
          '</a>' +
          (badges ? '<div class="product-card__badges">' + badges + '</div>' : '') +
          wishlistButton(p) +
          (opts.oldPrice && p.soldOutSizes.length < p.sizes.length
            ? '<div class="product-card__quick">' +
                '<button type="button" class="btn btn--sm btn--full" data-quick-add="' + p.id + '">Add to cart</button>' +
              '</div>'
            : '') +
        '</div>' +
        '<p class="product-card__line">' + escapeHTML(p.brand) + '</p>' +
        '<p class="product-card__cat">' + escapeHTML(cat ? cat.label : p.category) + '</p>' +
        '<h3 class="product-card__name"><a href="product.html?id=' + p.id + '">' + escapeHTML(p.name) + '</a></h3>' +
        '<div class="product-card__foot">' +
          '<p class="price">' +
            '<span class="price__now">' + money(p.price) + '</span>' +
            (opts.oldPrice && p.oldPrice ? '<span class="price__was">' + money(p.oldPrice) + '</span>' : '') +
          '</p>' +
          '<p class="rating" aria-label="' + ratingText(p) + '">' + starsHTML(p.rating) +
            '<span class="rating__count">(' + p.reviews + ')</span></p>' +
        '</div>' +
      '</article>'
    );
  }

  function initWishlistDelegation() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-wish]');
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute('data-wish');
      const p = byId(id);
      const now = Store.toggleWishlist(id);
      btn.setAttribute('aria-pressed', String(now));
      btn.setAttribute('aria-label',
        (now ? 'Remove ' : 'Add ') + (p ? p.name : 'item') +
        (now ? ' from' : ' to') + ' wishlist');
      Toast.show(
        now ? 'Saved to wishlist' : 'Removed from wishlist',
        p ? p.name : '',
        now ? 'success' : null
      );
    });
  }

  function initQuickAddDelegation() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-quick-add]');
      if (!btn) return;
      e.preventDefault();
      const p = byId(btn.getAttribute('data-quick-add'));
      if (!p) return;
      /* pick the first size that is actually available */
      const size = p.sizes.find((s) => p.soldOutSizes.indexOf(s) === -1) || p.sizes[0];
      Store.addToCart(p.id, 1, { color: p.colors[0], size: size });
      Toast.show('Added to cart', p.name + ' / ' + size, 'success');
    });
  }

  /* ======================================================================
     10. HOMEPAGE
     ====================================================================== */
  const Home = {
    init() {
      this.featured = qs('[data-featured-grid]');
      this.cats = qs('[data-cat-grid]');
      this.stories = qs('[data-stories-grid]');

      const el = qs('[data-featured-count]');
      const featured = el ? parseInt(el.getAttribute('data-featured-count'), 10) : 8;

      if (this.cats) {
        this.cats.innerHTML = CATEGORIES.map((c) => {
          const n = countByCategory(c.id);
          return (
            '<a class="cat-tile" href="shop.html?line=' + LINE.id + '&amp;category=' + c.id + '">' +
              '<span class="cat-tile__media">' +
                '<img class="cat-tile__img" src="' + IMG + c.img + '--700.jpg" ' +
                  'alt="' + escapeHTML(c.label + ' collection from ' + LINE.name + ' by ' + HOUSE.name) + '" ' +
                  'loading="lazy" width="700" height="933">' +
              '</span>' +
              '<span class="cat-tile__body">' +
                '<span class="cat-tile__name">' + escapeHTML(c.label) + '</span>' +
                '<span class="cat-tile__count">' + n + ' pieces</span>' +
              '</span>' +
            '</a>'
          );
        }).join('');
      }

      /* Featured grid on the homepage is scoped to the line explicitly,
         so if a second sub-brand is ever added it does not leak in. */
      const lineOnly = PRODUCTS.filter((p) => p.brand === LINE.name);
      if (this.featured) {
        this.featured.innerHTML =
          lineOnly
            .slice()
            .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
            .slice(0, featured)
            .map((p) => productCardHTML(p, { oldPrice: true, tag: 'New' }))
            .join('');
      }

      const lineCount = qs('[data-line-total]');
      if (lineCount) lineCount.textContent = lineOnly.length;

      if (this.stories) {
        const stories = [
          {
            img: 'alexander-naglestad-RFhq0SrrgEg-unsplash',
            alt: 'Tailored suits displayed on mannequins inside the atelier',
            title: 'The Atelier',
            text: 'Forty-one hours of hand work in every jacket. Meet the cutters who shape our canvas.'
          },
          {
            img: 'eric-fung-Z0GZrpwcc5Y-unsplash',
            alt: 'Fine gold jewellery arranged on a cream surface',
            title: 'Materials',
            text: 'Traceable wool, vegetable-tanned leather, and 18K gold vermeil. Nothing is substituted.'
          },
          {
            img: 'marcus-lewis-wGuQH9JPcEY-unsplash',
            alt: 'Two figures in tailored outfits walking through a flower garden',
            title: 'In Motion',
            text: 'Clothes are made to be lived in. Our campaign follows a season on the move.'
          }
        ];
        this.stories.innerHTML = stories.map(
          (s) =>
            '<figure class="story">' +
              '<img src="' + IMG + s.img + '--700.jpg" alt="' + escapeHTML(s.alt) + '" ' +
                'loading="lazy" width="700" height="467">' +
              '<figcaption><h3>' + escapeHTML(s.title) + '</h3>' +
                '<p>' + escapeHTML(s.text) + '</p></figcaption>' +
            '</figure>'
        ).join('');
      }

      this.newsletter();
    },

    newsletter() {
      qsa('[data-newsletter]').forEach((form) => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = qs('input[type="email"]', form);
          const msg = qs('[data-newsletter-msg]', form);
          const value = input.value.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            if (msg) {
              msg.hidden = false;
              msg.className = 'notice notice--error';
              msg.textContent = 'Please enter a valid email address.';
            }
            input.focus();
            return;
          }
          if (msg) {
            msg.hidden = false;
            msg.className = 'notice notice--success';
            msg.textContent = 'Thank you - check ' + value + ' to confirm your subscription.';
          }
          form.reset();
          Toast.show('Subscribed', 'A confirmation email is on its way.', 'success');
        });
      });
    }
  };

  /* ======================================================================
     11. SHOP PAGE - search, filters, sorting
     ====================================================================== */
  const Shop = {
    init() {
      this.grid = qs('[data-shop-grid]');
      if (!this.grid) return;

      this.count = qs('[data-result-count]');
      this.empty = qs('[data-shop-empty]');
      this.chips = qs('[data-active-chips]');

      this.state = {
        q: '', category: '', line: '', colour: '', minRating: 0, maxPrice: PRICE_MAX, sort: 'featured'
      };

      const params = new URLSearchParams(window.location.search);
      if (params.get('category')) this.state.category = params.get('category');
      if (params.get('line')) this.state.line = params.get('line');
      if (params.get('colour')) this.state.colour = params.get('colour');
      if (params.get('q')) {
        this.state.q = params.get('q');
        const s = qs('[data-shop-search]');
        if (s) s.value = this.state.q;
      }

      const price = qs('[data-filter-price]');
      if (price) {
        price.value = this.state.maxPrice;
        const out = qs('[data-price-out]');
        if (out) out.textContent = money(this.state.maxPrice);
        price.addEventListener('input', () => {
          this.state.maxPrice = parseInt(price.value, 10);
          if (out) out.textContent = money(this.state.maxPrice);
          this.render();
        });
      }

      qsa('[name="f-category"]').forEach((r) => {
        r.checked = r.value === this.state.category;
        r.addEventListener('change', () => { this.state.category = r.value; this.render(); });
      });

      /* category counts come from the data so they can never drift */
      qsa('[data-cat-count]').forEach((el) => {
        const n = countByCategory(el.getAttribute('data-cat-count'));
        el.textContent = n;
      });

      const colour = qs('[data-filter-colour]');
      if (colour) {
        /* options derive from the catalogue, so a colour can never be
           offered that no piece actually carries */
        COLOURS.forEach((c) => {
          const opt = document.createElement('option');
          opt.value = c;
          opt.textContent = c;
          colour.appendChild(opt);
        });
        colour.value = this.state.colour;
        colour.addEventListener('change', () => { this.state.colour = colour.value; this.render(); });
      }

      qsa('[name="f-rating"]').forEach((r) =>
        r.addEventListener('change', () => {
          this.state.minRating = parseFloat(r.value);
          this.render();
        })
      );

      const sort = qs('[data-sort]');
      if (sort) sort.addEventListener('change', () => { this.state.sort = sort.value; this.render(); });

      const search = qs('[data-shop-search]');
      if (search) {
        search.addEventListener('input', debounce((e) => {
          this.state.q = e.target.value.trim();
          this.render();
        }, 180));
      }
      window.addEventListener('cw:shop-search', (e) => {
        this.state.q = (e.detail || '').trim();
        if (search) search.value = this.state.q;
        this.render();
      });

      const reset = () => {
        this.state = {
          q: '', category: '', line: '', colour: '', minRating: 0, maxPrice: PRICE_MAX,
          sort: this.state.sort
        };
        if (price) { price.value = PRICE_MAX; if (out) out.textContent = money(PRICE_MAX); }
        if (colour) colour.value = '';
        if (search) search.value = '';
        qsa('[name="f-category"]').forEach((r) => (r.checked = false));
        qsa('[name="f-rating"]').forEach((r) => (r.checked = r.value === '0'));
        this.render();
      };
      let out = qs('[data-price-out]');
      qsa('[data-clear-filters]').forEach((b) => b.addEventListener('click', reset));

      /* "Showing CW / PREMIUM only" banner, cleared from two places */
      qsa('[data-clear-line]').forEach((b) =>
        b.addEventListener('click', () => { this.state.line = ''; this.render(); })
      );

      /* mobile filter drawer */
      const openBtn = qs('[data-open-filters]');
      const panel = qs('[data-filter-panel]');
      if (openBtn && panel) {
        const setOpen = (open) => {
          panel.classList.toggle('is-open', open);
          openBtn.setAttribute('aria-expanded', String(open));
          document.body.classList.toggle('is-locked', open);
        };
        openBtn.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')));
        const closeBtn = qs('[data-close-filters]', panel);
        if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
        const scrim = qs('.filter-drawer__scrim', panel);
        if (scrim) scrim.addEventListener('click', () => setOpen(false));
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && panel.classList.contains('is-open')) {
            setOpen(false);
            openBtn.focus();
          }
        });
      }

      this.render();
    },

    filter() {
      const s = this.state;
      const q = s.q.toLowerCase();
      return PRODUCTS.filter((p) => {
        if (s.category && p.category !== s.category) return false;
        if (s.line && lineKey(p.brand) !== lineKey(s.line)) return false;
        if (s.colour && p.colors.indexOf(s.colour) === -1) return false;
        if (p.price > s.maxPrice) return false;
        if (p.rating < s.minRating) return false;
        if (q) {
          const hay = (p.name + ' ' + p.brand + ' ' + p.category + ' ' + p.blurb + ' ' +
            p.colors.join(' ')).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
    },

    sort(list) {
      const s = this.state.sort;
      const arr = list.slice();
      if (s === 'price-asc') arr.sort((a, b) => a.price - b.price);
      else if (s === 'price-desc') arr.sort((a, b) => b.price - a.price);
      else if (s === 'rating') arr.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      else if (s === 'newest') arr.sort((a, b) => (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0));
      else arr.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
      return arr;
    },

    render() {
      const results = this.sort(this.filter());
      this.grid.innerHTML = results.map((p) => productCardHTML(p, { oldPrice: true })).join('');
      if (this.count) {
        this.count.textContent = results.length + (results.length === 1 ? ' piece' : ' pieces');
      }
      if (this.empty) this.empty.hidden = results.length > 0;
      this.renderChips();
      this.renderLineBanner();
    },

    renderLineBanner() {
      const box = qs('[data-shop-line]');
      if (!box) return;
      const on = this.state.line === LINE.id;
      box.hidden = !on;
      if (!on) return;
      const n = this.filter().length;
      qs('[data-shop-line-count]', box).textContent =
        n + (n === 1 ? ' piece' : ' pieces');
    },

    renderChips() {
      if (!this.chips) return;
      const s = this.state;
      const items = [];
      if (s.q) items.push({ k: 'q', label: '"' + s.q + '"' });
      if (s.line) items.push({ k: 'line', label: LINE.name });
      if (s.category) {
        const c = CATEGORIES.find((x) => x.id === s.category);
        items.push({ k: 'category', label: c ? c.label : s.category });
      }
      if (s.colour) items.push({ k: 'colour', label: s.colour });
      if (s.minRating) items.push({ k: 'minRating', label: s.minRating + '+ stars' });
      if (s.maxPrice < PRICE_MAX) items.push({ k: 'maxPrice', label: 'Under ' + money(s.maxPrice) });

      this.chips.innerHTML = items.map(
        (i) => '<span class="chip">' + escapeHTML(i.label) +
          '<button type="button" data-chip="' + i.k + '" aria-label="Remove filter ' +
          escapeHTML(i.label) + '">&#10005;</button></span>'
      ).join('');
      this.chips.hidden = items.length === 0;

      qsa('[data-chip]', this.chips).forEach((b) =>
        b.addEventListener('click', () => {
          const k = b.getAttribute('data-chip');
          this.state[k] = k === 'minRating' ? 0 : k === 'maxPrice' ? PRICE_MAX : '';
          if (k === 'q') { const s = qs('[data-shop-search]'); if (s) s.value = ''; }
          if (k === 'category') qsa('[name="f-category"]').forEach((r) => (r.checked = false));
          if (k === 'colour') { const c = qs('[data-filter-colour]'); if (c) c.value = ''; }
          if (k === 'line') { const b2 = qs('[data-clear-line]'); if (b2) b2.click(); return; }
          if (k === 'maxPrice') {
            const p = qs('[data-filter-price]');
            if (p) p.value = PRICE_MAX;
            const o = qs('[data-price-out]');
            if (o) o.textContent = money(PRICE_MAX);
          }
          if (k === 'minRating') {
            qsa('[name="f-rating"]').forEach((r) => (r.checked = r.value === '0'));
          }
          this.render();
        })
      );
    }
  };

  /* ======================================================================
     11b. COLLECTIONS PAGE - brand architecture
     The house on the left, the line on the right, categories below.
     Markup is static so the hierarchy reads without JS; this controller
     only fills the counts and the line preview grid.
     ====================================================================== */
  const Collections = {
    init() {
      const grid = qs('[data-line-grid]');
      if (!grid) return;

      const line = PRODUCTS.filter((p) => p.brand === LINE.name);

      qsa('[data-line-total]').forEach((el) => (el.textContent = line.length));
      qsa('[data-cat-count]').forEach((el) => {
        const n = line.filter((p) => p.category === el.getAttribute('data-cat-count')).length;
        el.textContent = n;
      });

      /* One hero per category, highest rated first, so all four rooms
         of the line are represented regardless of grid width. */
      grid.innerHTML = CATEGORIES.map((c) => {
        const pick = line
          .filter((p) => p.category === c.id)
          .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)[0];
        if (!pick) return '';
        const cat = c.label;
        return (
          '<a class="line-card" href="shop.html?line=' + LINE.id + '&amp;category=' + c.id + '">' +
            '<span class="line-card__media">' +
              '<img class="line-card__img" src="' + IMG + pick.images[0] + '--700.jpg" ' +
                'alt="' + escapeHTML(pick.name + ' from ' + LINE.name) + '" ' +
                'loading="lazy" width="700" height="933">' +
            '</span>' +
            '<span class="line-card__body">' +
              '<span class="line-card__cat">' + escapeHTML(cat) + '</span>' +
              '<span class="line-card__name">' + escapeHTML(pick.name) + '</span>' +
              '<span class="line-card__cta">View ' + escapeHTML(cat.toLowerCase()) + '</span>' +
            '</span>' +
          '</a>'
        );
      }).join('');

      const preview = qs('[data-line-preview]');
      if (preview) {
        preview.innerHTML = line
          .slice()
          .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
          .slice(0, 4)
          .map((p) => productCardHTML(p, { oldPrice: true }))
          .join('');
      }
    }
  };

  /* ======================================================================
     12. SIZE GUIDE
     Footwear and apparel need different columns. Every size a product
     offers always produces a row, so the table is never empty.
     ====================================================================== */
  const SHOE_SIZE_CHART = {
    '35': ['35', '4', '4'],   '36': ['36', '5', '5'],  '37': ['37', '6', '6'],
    '38': ['38', '7', '7'],   '39': ['39', '8', '8'],  '40': ['40', '9', '9'],
    '41': ['41', '10', '10'], '42': ['42', '11', '11'], '43': ['43', '12', '12'],
    '44': ['44', '13', '13'], '45': ['45', '14', '14']
  };

  const APPAREL_SIZE_CHART = {
    XS:  ['86', '71', '66'],  S:   ['92', '76', '69'],  M:   ['98', '81', '71'],
    L:   ['104', '86', '73'], XL:  ['110', '92', '75'], XXL: ['116', '98', '77'],
    '28': ['88', '76', '78'], '30': ['92', '80', '79'], '32': ['96', '84', '80'],
    '34': ['100', '88', '81'], '36': ['104', '92', '82'],
    '46': ['96', '80', '74'],  '48': ['100', '84', '75'], '50': ['104', '88', '76'],
    '52': ['108', '92', '77'], '54': ['112', '96', '78'],
    '85': ['85', '85', '&mdash;'], '90': ['90', '90', '&mdash;'],
    '95': ['95', '95', '&mdash;'], '100': ['100', '100', '&mdash;']
  };

  function sizeGuideHTML(p) {
    const isShoe = p.category === 'shoes';
    const cols = isShoe
      ? ['Size', 'EU', 'UK', 'US']
      : ['Size', 'Chest (cm)', 'Waist (cm)', 'Length (cm)'];
    const chart = isShoe ? SHOE_SIZE_CHART : APPAREL_SIZE_CHART;

    const rows = p.sizes.map((s) => {
      const d = chart[s] || [];
      const cells = cols.slice(1)
        .map((_, i) => '<td>' + (d[i] || '&mdash;') + '</td>')
        .join('');
      return '<tr><th scope="row">' + escapeHTML(s) + '</th>' + cells + '</tr>';
    }).join('');

    const hint = isShoe
      ? 'European sizing. If you are between sizes, we recommend sizing up.'
      : 'Measurements are in centimetres. If you are between sizes, we recommend sizing up.';

    return (
      '<p class="field__hint spaced-below">' + hint + '</p>' +
      '<table class="size-table">' +
        '<caption class="visually-hidden">Size guide for ' + escapeHTML(p.name) + '</caption>' +
        '<thead><tr>' +
          cols.map((c) => '<th scope="col">' + c + '</th>').join('') +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>'
    );
  }

  /* Each product carries an alts[] array parallel to images[] and a
     views[] array of shot labels (Worn / Styled / Detail / Product).
     Older single-alt products still work: altOrViews falls back. */
  /* ?line= is a slug, the product carries the display name. Compare on
     letters only so "cw-premium" matches "CW / PREMIUM". */
  const lineKey = (v) => String(v).toLowerCase().replace(/[^a-z0-9]/g, '');

  function altFor(p, i) {
    if (p.alts && p.alts[i]) return p.alts[i];
    if (p.alt) return i === 0 ? p.alt : p.alt2 || p.alt;
    return p.name;
  }

  function viewFor(p, i) {
    if (p.views && p.views[i]) return p.views[i];
    return i === 0 ? 'Front' : 'View ' + (i + 1);
  }

  function swatchColor(name) {
    const map = {
      Black: '#1a1a1a', Charcoal: '#3a3a3a', Ivory: '#f3ece0', Camel: '#b08a5e',
      Cream: '#f5efe4', White: '#ffffff', 'Off-White': '#faf7f0', Blue: '#3f5b7a',
      Stone: '#c8c0b1', 'Stone Check': '#c3bba9', Emerald: '#1f4d3d',
      Cognac: '#a8672f', Navy: '#22304a', Gold: '#c8a24a',
      Espresso: '#4a3226', Champagne: '#e4d5b7'
    };
    return map[name] || '#d8d2c6';
  }

  function reviewList(p) {
    const seeds = [
      { n: 'Amara S.', t: 'Impeachable fit', b: 'The tailoring is exactly as described - I adjusted the sleeve a fraction and it now sits perfectly. Delivery was two days.' },
      { n: 'Daniel K.', t: 'Worth every cent', b: 'I have bought from larger houses and this holds its own. The finish on the lining is what convinced me.' },
      { n: 'Rina P.', t: 'Beautiful, runs small', b: 'Quality is exceptional. I would size up if you are between sizes - the shoulder sits quite close.' }
    ];
    const count = p.rating >= 4.8 ? 3 : 2;
    const out = [];
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const rating = Math.min(5, p.rating - (i === 2 ? 1 : 0));
      out.push(
        '<li class="review">' +
          '<p class="review__meta"><strong>' + escapeHTML(s.n) + '</strong>' +
            '<span class="rating" aria-label="' + rating.toFixed(1) + ' out of 5">' +
              starsHTML(rating) + '</span>' +
            '<span class="review__verified">Verified purchase</span></p>' +
          '<h3 class="review__title">' + escapeHTML(s.t) + '</h3>' +
          '<p class="review__body">' + escapeHTML(s.b) + '</p>' +
        '</li>'
      );
    }
    return out.join('');
  }

  /* ======================================================================
     13. PRODUCT DETAIL PAGE
     ====================================================================== */
  const ProductPage = {
    init() {
      this.mount = qs('[data-product]');
      if (!this.mount) return;

      const id = new URLSearchParams(window.location.search).get('id');
      const p = byId(id) || PRODUCTS[0];
      this.render(p);
      this.related(p);

      const url = new URL(window.location.href);
      url.searchParams.set('id', p.id);
      history.replaceState({}, '', url);
    },

    render(p) {
      const cat = CATEGORIES.find((c) => c.id === p.category);
      const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
      const shots = p.images;

      this.mount.innerHTML =
        '<nav class="breadcrumb" aria-label="Breadcrumb"><ul>' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="collections.html">Collections</a></li>' +
          '<li><a href="shop.html">' + escapeHTML(LINE.name) + '</a></li>' +
          '<li><a href="shop.html?category=' + p.category + '">' + escapeHTML(cat.label) + '</a></li>' +
          '<li><span aria-current="page">' + escapeHTML(p.name) + '</span></li>' +
        '</ul></nav>' +

        '<div class="pdp">' +
          '<div class="pdp__gallery">' +
            '<div class="pdp__main">' +
              '<img id="pdp-img" src="' + IMG + p.images[0] + '--1200.jpg" alt="' +
                escapeHTML(altFor(p, 0)) + '" width="1200" height="1500">' +
              '<p class="pdp__shot" data-shot-label>' + escapeHTML(viewFor(p, 0)) + '</p>' +
            '</div>' +
            (shots.length > 1
              ? '<div class="pdp__thumbs" role="group" aria-label="Product images">' +
                  shots.map((img, i) =>
                    '<button type="button" class="pdp__thumb' + (i === 0 ? ' is-active' : '') + '" ' +
                    'data-thumb="' + img + '" data-index="' + i + '" ' +
                    'aria-label="View ' + escapeHTML(viewFor(p, i).toLowerCase()) +
                      ' shot, image ' + (i + 1) + ' of ' + shots.length + '">' +
                      '<img src="' + IMG + img + '--240.jpg" alt="" loading="lazy" width="240" height="300">' +
                      '<span class="pdp__thumb-cap">' + escapeHTML(viewFor(p, i)) + '</span>' +
                    '</button>'
                  ).join('') +
                '</div>'
              : '') +
          '</div>' +

          '<div class="pdp__info">' +
            '<p class="pdp__line"><a href="collections.html">' + escapeHTML(HOUSE.name) + '</a>' +
              ' <span aria-hidden="true">/</span> ' + escapeHTML(p.brand) + '</p>' +
            '<h1 class="pdp__name">' + escapeHTML(p.name) + '</h1>' +

            '<div class="pdp__rating">' +
              '<span class="rating" aria-label="' + ratingText(p) + '">' + starsHTML(p.rating) + '</span>' +
              '<a href="#reviews" class="pdp__reviews-link">' + p.rating.toFixed(1) +
                ' &middot; ' + p.reviews + ' reviews</a>' +
            '</div>' +

            '<p class="pdp__price">' +
              '<span class="price__now">' + money(p.price) + '</span>' +
              (p.oldPrice ? '<span class="price__was">' + money(p.oldPrice) + '</span>' : '') +
              (off ? '<span class="price__off">Save ' + off + '%</span>' : '') +
            '</p>' +

            '<p class="pdp__blurb">' + escapeHTML(p.blurb) + '</p>' +

            '<fieldset class="optgroup">' +
              '<legend class="optgroup__label">Colour: <span data-color-label>' +
                escapeHTML(p.colors[0]) + '</span></legend>' +
              '<div class="swatches">' +
                p.colors.map((c, i) =>
                  '<button type="button" class="swatch' + (i === 0 ? ' is-active' : '') + '" ' +
                  'data-color="' + escapeHTML(c) + '" aria-label="Colour ' + escapeHTML(c) + '" ' +
                  'aria-pressed="' + (i === 0) + '">' +
                    '<span class="swatch__chip" style="background:' + swatchColor(c) + '"></span>' +
                    '<span class="visually-hidden">' + escapeHTML(c) + '</span>' +
                  '</button>'
                ).join('') +
              '</div>' +
            '</fieldset>' +

            '<fieldset class="optgroup">' +
              '<legend class="optgroup__label">Size: <span data-size-label>' +
                escapeHTML(p.sizes[0]) + '</span></legend>' +
              '<div class="sizes">' +
                p.sizes.map((s, i) => {
                  const out = p.soldOutSizes.indexOf(s) > -1;
                  return '<button type="button" class="size' +
                    (i === 0 && !out ? ' is-active' : '') + (out ? ' is-out' : '') + '" ' +
                    'data-size="' + escapeHTML(s) + '"' +
                    (out ? ' disabled aria-label="Size ' + escapeHTML(s) + ' sold out"' : '') + '>' +
                    escapeHTML(s) + '</button>';
                }).join('') +
              '</div>' +
              '<p class="optgroup__help"><button type="button" class="link" data-size-guide>Size guide</button></p>' +
            '</fieldset>' +

            '<div class="pdp__buy">' +
              '<div class="qty">' +
                '<button type="button" class="qty__btn" data-qty-down aria-label="Decrease quantity">&minus;</button>' +
                '<input class="qty__input" type="number" value="1" min="1" max="10" ' +
                  'aria-label="Quantity" data-qty-input>' +
                '<button type="button" class="qty__btn" data-qty-up aria-label="Increase quantity">+</button>' +
              '</div>' +
              '<button type="button" class="btn btn--lg" data-add>' + ICON.bag + ' Add to cart</button>' +
              '<button type="button" class="wish wish--lg" data-wish="' + p.id + '" ' +
                'aria-pressed="' + Store.isWishlisted(p.id) + '" aria-label="Save to wishlist">' +
                ICON.heart + '</button>' +
            '</div>' +

            '<p class="pdp__feedback" data-pdp-feedback role="status" aria-live="polite"></p>' +

            '<ul class="pdp__assurance">' +
              '<li>' + ICON.check + ' Complimentary shipping over ' + money(CONFIG.freeShippingThreshold) + '</li>' +
              '<li>' + ICON.check + ' Standard delivery free, express ' + money(CONFIG.shippingFlat) + '</li>' +
              '<li>' + ICON.check + ' 30-day returns, collected from your door</li>' +
              '<li>' + ICON.check + ' Lifetime repair on all tailoring</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div class="pdp__details">' +
          '<section class="pdp__section" aria-labelledby="d-desc">' +
            '<h2 id="d-desc">Description</h2>' +
            '<p>' + escapeHTML(p.blurb) + ' Each piece is cut and finished in our ' +
            escapeHTML(HOUSE.city) + ' atelier, then pressed by hand. Small variations ' +
            'in weave and tone are natural to the material and are not faults.</p>' +
          '</section>' +
          '<section class="pdp__section" aria-labelledby="d-spec">' +
            '<h2 id="d-spec">Product details</h2>' +
            '<dl class="spec-pair">' +
              '<div class="spec-pair__row"><dt>Brand</dt><dd>' + escapeHTML(p.brand) + '</dd></div>' +
              '<div class="spec-pair__row"><dt>Line</dt><dd>' + escapeHTML(LINE.name) +
                ' by ' + escapeHTML(HOUSE.name) + '</dd></div>' +
              '<div class="spec-pair__row"><dt>Category</dt><dd>' + escapeHTML(cat.label) + '</dd></div>' +
              '<div class="spec-pair__row"><dt>Colour</dt><dd>' + escapeHTML(p.colors.join(', ')) + '</dd></div>' +
              '<div class="spec-pair__row"><dt>Sizes</dt><dd>' + escapeHTML(p.sizes.join(', ')) + '</dd></div>' +
              '<div class="spec-pair__row"><dt>Season</dt><dd>' + escapeHTML(LINE.season) + '</dd></div>' +
            '</dl>' +
            '<ul class="spec">' + p.details.map((d) => '<li>' + escapeHTML(d) + '</li>').join('') + '</ul>' +
          '</section>' +
          '<section class="pdp__section" id="size-guide" tabindex="-1">' +
            '<h2>Size guide</h2>' + sizeGuideHTML(p) +
          '</section>' +
        '</div>' +

        '<section class="reviews" id="reviews" aria-labelledby="d-rev">' +
          '<h2 id="d-rev">Reviews <span class="reviews__count">(' + p.reviews + ')</span></h2>' +
          '<div class="reviews__summary">' +
            '<p class="reviews__score">' + p.rating.toFixed(1) + '<span>/5</span></p>' +
            '<div>' + starsHTML(p.rating) +
              '<p class="reviews__based">Based on ' + p.reviews + ' verified purchases</p></div>' +
          '</div>' +
          '<ul class="review-list">' + reviewList(p) + '</ul>' +
        '</section>';

      this.bind(p);
    },

    related(p) {
      const box = qs('[data-related]');
      if (!box) return;
      const list = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
      box.innerHTML = list.map((x) => productCardHTML(x, { oldPrice: true })).join('');
    },

    bind(p) {
      const m = this.mount;
      const feedback = qs('[data-pdp-feedback]', m);
      const say = (msg) => {
        feedback.textContent = msg;
        feedback.classList.add('is-shown');
        setTimeout(() => feedback.classList.remove('is-shown'), 3200);
      };

      qsa('[data-thumb]', m).forEach((b) =>
        b.addEventListener('click', () => {
          const i = parseInt(b.getAttribute('data-index'), 10);
          const img = qs('#pdp-img', m);
          img.src = IMG + b.getAttribute('data-thumb') + '--1200.jpg';
          img.alt = altFor(p, i);
          const label = qs('[data-shot-label]', m);
          if (label) label.textContent = viewFor(p, i);
          qsa('[data-thumb]', m).forEach((x) => x.classList.remove('is-active'));
          b.classList.add('is-active');
        })
      );

      qsa('[data-color]', m).forEach((b) =>
        b.addEventListener('click', () => {
          qsa('[data-color]', m).forEach((x) => {
            x.classList.remove('is-active');
            x.setAttribute('aria-pressed', 'false');
          });
          b.classList.add('is-active');
          b.setAttribute('aria-pressed', 'true');
          qs('[data-color-label]', m).textContent = b.getAttribute('data-color');
        })
      );

      qsa('[data-size]', m).forEach((b) =>
        b.addEventListener('click', () => {
          qsa('[data-size]', m).forEach((x) => x.classList.remove('is-active'));
          b.classList.add('is-active');
          qs('[data-size-label]', m).textContent = b.getAttribute('data-size');
        })
      );

      const input = qs('[data-qty-input]', m);
      const clamp = () => {
        let v = parseInt(input.value, 10);
        if (isNaN(v) || v < 1) v = 1;
        if (v > 10) v = 10;
        input.value = v;
        return v;
      };
      qs('[data-qty-down]', m).addEventListener('click', () => { input.value = Math.max(1, clamp() - 1); });
      qs('[data-qty-up]', m).addEventListener('click', () => { input.value = Math.min(10, clamp() + 1); });
      input.addEventListener('change', clamp);

      qs('[data-add]', m).addEventListener('click', () => {
        const sizeEl = qs('[data-size].is-active', m);
        const colorEl = qs('[data-color].is-active', m);
        const size = sizeEl ? sizeEl.getAttribute('data-size') : p.sizes[0];
        const color = colorEl ? colorEl.getAttribute('data-color') : p.colors[0];
        const qty = clamp();
        if (!size) { say('Please choose a size first.'); return; }
        Store.addToCart(p.id, qty, { color: color, size: size });
        Toast.show('Added to cart', p.name + ' / ' + color + ' / ' + size + ' x' + qty, 'success');
        say('Added ' + qty + ' x ' + p.name + ' to your cart.');
      });

      const guide = qs('[data-size-guide]', m);
      if (guide) {
        guide.addEventListener('click', () => {
          const target = qs('#size-guide', m);
          if (!target) return;
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.focus();
        });
      }
    }
  };

  /* ======================================================================
     14. CART PAGE
     ====================================================================== */
  const CartPage = {
    init() {
      this.list = qs('[data-cart-list]');
      if (!this.list) return;
      this.summary = qs('[data-cart-summary]');
      this.empty = qs('[data-cart-empty]');
      this.wrap = qs('[data-cart-filled]');

      Store.subscribe(() => this.render());
      this.bind();
    },

    bind() {
      this.list.addEventListener('click', (e) => {
        const row = e.target.closest('[data-line]');
        if (!row) return;
        const key = row.getAttribute('data-line');
        const line = Store.state().cart.find((l) => l.id + '::' + l.color + '::' + l.size === key);

        if (e.target.closest('[data-inc]') && line) Store.setQty(key, line.qty + 1);
        if (e.target.closest('[data-dec]') && line) Store.setQty(key, line.qty - 1);
        if (e.target.closest('[data-remove]')) {
          const p = byId(row.getAttribute('data-id'));
          Store.removeLine(key);
          Toast.show('Removed from cart', p ? p.name : '');
        }
      });
    },

    render() {
      const cart = Store.cartLines();
      const isEmpty = cart.length === 0;

      if (this.empty) this.empty.hidden = !isEmpty;
      if (this.wrap) this.wrap.hidden = isEmpty;
      if (isEmpty) { this.list.innerHTML = ''; return; }

      this.list.innerHTML = cart.map((l) => {
        const p = byId(l.id);
        if (!p) return '';
        const key = l.id + '::' + l.color + '::' + l.size;
        return (
          '<article class="line-item" data-line="' + key + '" data-id="' + p.id + '">' +
            '<a class="line-item__media" href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' +
              '<img src="' + IMG + p.images[0] + '--240.jpg" alt="" loading="lazy" width="240" height="300">' +
            '</a>' +
            '<div class="line-item__body">' +
              '<h2 class="line-item__name"><a href="product.html?id=' + p.id + '">' + escapeHTML(p.name) + '</a></h2>' +
              '<p class="line-item__variant">' + escapeHTML(p.brand) + ' &middot; ' +
                escapeHTML(l.color) + ' &middot; Size ' + escapeHTML(l.size) + '</p>' +
              '<p class="line-item__unit">' + money(p.price) + ' each</p>' +
              '<div class="line-item__controls">' +
                '<div class="qty">' +
                  '<button type="button" class="qty__btn" data-dec aria-label="Decrease quantity of ' +
                    escapeHTML(p.name) + '">&minus;</button>' +
                  '<input class="qty__input" type="number" value="' + l.qty + '" min="1" max="10" readonly ' +
                    'aria-label="Quantity of ' + escapeHTML(p.name) + '">' +
                  '<button type="button" class="qty__btn" data-inc aria-label="Increase quantity of ' +
                    escapeHTML(p.name) + '">+</button>' +
                '</div>' +
                '<button type="button" class="line-item__remove" data-remove>Remove</button>' +
              '</div>' +
            '</div>' +
            '<p class="line-item__total">' + money(p.price * l.qty) + '</p>' +
          '</article>'
        );
      }).join('');

      const t = Store.totals();
      if (this.summary) {
        this.summary.innerHTML =
          '<h2 class="summary__title">Order summary</h2>' +
          '<dl class="summary__rows">' +
            '<div class="summary__row"><dt>Items</dt><dd>' + t.items + '</dd></div>' +
            '<div class="summary__row"><dt>Subtotal</dt><dd>' + money(t.subtotal) + '</dd></div>' +
            '<div class="summary__row"><dt>Shipping</dt><dd>' +
              (t.shipping === 0
                ? '<span class="summary__free">Free</span>'
                : escapeHTML(money(t.shipping))) +
              '</dd></div>' +
            '<div class="summary__row"><dt>Estimated tax</dt><dd>' + money(t.tax) + '</dd></div>' +
            '<div class="summary__row summary__row--total"><dt>Total</dt><dd>' + money(t.total) + '</dd></div>' +
          '</dl>' +
          /* Both class variants appear as literals so the markup scanner can
             still see which of them are in use. */
          (t.shipping === 0
            ? '<p class="summary__note summary__note--ok">' + ICON.check
            : '<p class="summary__note">') +
            ' Delivering by ' +
            escapeHTML(shippingMethod(t.method).title.toLowerCase()) + ' &mdash; ' +
            escapeHTML(shippingNote(t.method)) + '. You can change this at checkout.</p>' +
          '<a class="btn btn--lg btn--full" href="checkout.html">Proceed to checkout</a>' +
          '<a class="summary__continue" href="shop.html">Continue shopping</a>';
      }
    }
  };

  /* ======================================================================
     15a. CHECKOUT REFERENCE DATA
     Prototype only. No payment, bank, QRIS or e-wallet API is contacted;
     every number produced below is fictional demo data.
     ====================================================================== */

  /* One country drives BOTH the phone dialling code and the payment
     methods on offer, so the two can never disagree. */
  const COUNTRIES = [
    { code: 'ID', name: 'Indonesia',      dial: '62' },
    { code: 'SG', name: 'Singapore',      dial: '65' },
    { code: 'MY', name: 'Malaysia',       dial: '60' },
    { code: 'US', name: 'United States',  dial: '1' },
    { code: 'GB', name: 'United Kingdom', dial: '44' },
    { code: 'JP', name: 'Japan',          dial: '81' },
    { code: 'KR', name: 'South Korea',    dial: '82' },
    { code: 'AU', name: 'Australia',      dial: '61' },
    { code: 'CN', name: 'China',          dial: '86' }
  ];

  const countryById = (code) =>
    COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];

  /* Card networks shown per region. */
  const CARD_BRANDS = {
    ID: ['Visa', 'Mastercard', 'GPN'],
    SG: ['Visa', 'Mastercard', 'American Express'],
    MY: ['Visa', 'Mastercard'],
    US: ['Visa', 'Mastercard', 'American Express'],
    GB: ['Visa', 'Mastercard', 'American Express'],
    JP: ['Visa', 'Mastercard', 'JCB'],
    KR: ['Visa', 'Mastercard'],
    AU: ['Visa', 'Mastercard', 'American Express'],
    CN: ['UnionPay', 'Visa', 'Mastercard']
  };

  /* Wallets offered inside the generic "digital wallet" panel. */
  const WALLETS = {
    ID: ['GoPay', 'DANA', 'OVO', 'LinkAja'],
    SG: ['PayPal', 'Apple Pay'],
    MY: ['Touch n Go eWallet', 'Boost', 'DuitNow'],
    US: ['Apple Pay', 'Google Pay', 'PayPal'],
    GB: ['PayPal', 'Apple Pay'],
    JP: ['PayPal', 'Apple Pay'],
    KR: ['PayPal', 'Kakao Pay'],
    AU: ['PayPal', 'Apple Pay'],
    CN: ['Alipay', 'WeChat Pay']
  };

  /* Which top-level methods each region can use. Ids match the
     data-panel names in checkout.html. */
  const PAYMENT_SETS = {
    ID: ['card', 'va', 'qris', 'wallet', 'cod'],
    SG: ['card', 'va', 'wallet'],
    MY: ['card', 'va', 'wallet'],
    US: ['card', 'paypal', 'wallet'],
    GB: ['card', 'paypal', 'wallet'],
    JP: ['card', 'va', 'wallet'],
    AU: ['card', 'paypal', 'wallet'],
    KR: ['card', 'wallet'],
    CN: ['card', 'wallet']
  };

  /* Card copy is derived from the region so it can never contradict the
     methods offered. */
  function paymentLabel(id, code) {
    const brands = (CARD_BRANDS[code] || []).join(', ');
    const wallets = (WALLETS[code] || []).slice(0, 4).join(', ');
    switch (id) {
      case 'card':   return { title: 'Credit or debit card', note: brands };
      case 'va':     return { title: 'Bank transfer or virtual account', note: 'Select your bank' };
      case 'qris':   return { title: 'QRIS', note: 'Scan using your banking application' };
      case 'wallet': return { title: 'Digital wallet', note: wallets };
      case 'cod':    return { title: 'Cash on delivery', note: 'Available in Bandung and Jakarta' };
      case 'paypal': return { title: 'PayPal', note: 'Continue with your PayPal account' };
      default:       return { title: id, note: '' };
    }
  }

  /* Indonesian banks offering a virtual account. vaCode is a fictional
     3-digit prefix, so generated numbers are obviously not real. */
  const BANKS = [
    { id: 'bca',      name: 'BCA',                 vaCode: '880', popular: true },
    { id: 'mandiri',  name: 'Bank Mandiri',         vaCode: '881', popular: true },
    { id: 'bni',      name: 'BNI',                 vaCode: '882', popular: true },
    { id: 'bri',      name: 'BRI',                 vaCode: '883', popular: true },
    { id: 'cimb',     name: 'CIMB Niaga',          vaCode: '884', popular: true },
    { id: 'permata',  name: 'PermataBank',         vaCode: '885', popular: true },
    { id: 'btn',      name: 'Bank Tabungan Negara', vaCode: '886' },
    { id: 'danamon',  name: 'Bank Danamon',        vaCode: '887' },
    { id: 'nisp',     name: 'Bank OCBC NISP',      vaCode: '888' },
    { id: 'mayapada', name: 'Bank Mayapada',       vaCode: '889' },
    { id: 'bjb',      name: 'Bank BJB',            vaCode: '890' },
    { id: 'bniS',     name: 'Bank BNI Syariah',    vaCode: '891' },
    { id: 'briS',     name: 'Bank BRI Syariah',    vaCode: '892' },
    { id: 'mandiriS', name: 'Bank Mandiri Syariah', vaCode: '893' }
  ];

  const popularBanks = () => BANKS.filter((b) => b.popular);

  /* Deterministic 16-digit demo VA number in groups of four. The same bank
     and order always yield the same number, so re-picking a bank does not
     appear to "regenerate" a different account. */
  function mockVaNumber(bank, seed) {
    const src = bank.id + '|' + seed;
    let h = 2166136261;
    for (let i = 0; i < src.length; i++) {
      h ^= src.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    let digits = String(bank.vaCode);
    let guard = 0;
    while (digits.length < 16 && guard++ < 64) {
      h = (h * 1103515245 + 12345) >>> 0;
      digits += String(h % 10);
    }
    return digits.slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ').trim();
  }

  /* A decorative, clearly non-scannable grid - not a QR specification,
     and always labelled as a demo. */
  function demoQrPattern() {
    const N = 11;
    let seed = 20260918;
    const out = [];
    const inCorner = (r, c) =>
      (r < 3 && c < 3) || (r < 3 && c >= N - 3) || (r >= N - 3 && c < 3);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        let on;
        if (inCorner(r, c)) {
          const rr = r < 3 ? r : r - (N - 3);
          const cc = c < 3 ? c : c - (N - 3);
          on = rr === 0 || rr === 2 || cc === 0 || cc === 2 || (rr === 1 && cc === 1);
        } else {
          seed = (seed * 1103515245 + 12345) % 2147483648;
          on = ((seed >> 9) % 100) < 45;
        }
        out.push('<span class="qr-demo__cell" data-on="' + (on ? '1' : '0') + '"></span>');
      }
    }
    return out.join('');
  }

  /* National portion only. Indonesia drops a domestic trunk 0; the rest of
     the list is kept deliberately simple. */
  function nationalNumber(raw, code) {
    let d = String(raw == null ? '' : raw).replace(/\D/g, '');
    if (code === 'ID') d = d.replace(/^0+/, '');
    return d;
  }

  function fullPhone(raw, code) {
    const c = countryById(code);
    const nat = nationalNumber(raw, code);
    return nat ? '+' + c.dial + ' ' + nat : '';
  }

  /* Explicit lookup by name. The shortcut form.phone depends on the
     HTMLFormElement named-property proxy, so this keeps the controller
     working the same everywhere. */
  function formField(form, name) {
    return form ? form.querySelector('[name="' + name + '"]') : null;
  }

  /* ======================================================================
     15b. CHECKOUT PAGE
     ====================================================================== */
  const Checkout = {
    init() {
      this.form = qs('[data-checkout]');
      if (!this.form) return;
      this.summary = qs('[data-checkout-summary]');

      if (Store.cartLines().length === 0) {
        const guard = qs('[data-checkout-guard]');
        if (guard) {
          guard.hidden = false;
          const main = qs('[data-checkout-main]');
          if (main) main.hidden = true;
        }
        return;
      }

      Store.subscribe(() => {
        this.renderSummary();
        this.syncPanelAmounts();
      });
      this.renderSummary();

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate()) this.placeOrder();
      });
      this.form.addEventListener('input', (e) => {
        const f = e.target.closest('.field');
        if (f) f.classList.remove('is-invalid');
        if (e.target.name === 'phone') {
          this.updatePhoneHint();
          this.renderSummary();
        }
      });
      this.form.addEventListener('change', (e) => {
        const n = e.target.name;
        if (n === 'payment') this.onPaymentChange();
        if (n === 'country') this.onCountryChange();
        if (n === 'shipping') this.onShippingChange();
        if (n === 'bank') this.onBankChange();
        if (n === 'wallet') this.onWalletChange();
        this.renderSummary();
      });

      this.initCountries();
      this.initCards();
      this.initBanks();
      this.renderShipping();
      this.renderMethods();
      this.initPanels();

      const prefill = Store.state().user;
      if (prefill) {
        const em = formField(this.form, 'email');
        const nm = formField(this.form, 'fullname');
        if (em) em.value = prefill.email;
        if (nm) nm.value = prefill.name;
      }
    },

    /* --- country and phone ------------------------------------------------ */
    initCountries() {
      const sel = qs('[data-country]');
      if (!sel) return;
      this.country = sel;
      sel.innerHTML = COUNTRIES.map(
        (c) => '<option value="' + c.code + '">' + escapeHTML(c.name) + ' (+' + c.dial + ')</option>'
      ).join('');
      sel.value = 'ID';
      this.updatePhoneHint();
    },

    region() {
      return this.country ? this.country.value : 'ID';
    },

    updatePhoneHint() {
      const dial = qs('[data-dial]');
      const hint = qs('[data-phone-display]');
      const code = this.region();
      const c = countryById(code);
      if (dial) dial.textContent = '+' + c.dial;
      if (!hint) return;
      const input = formField(this.form, 'phone');
      const full = input ? fullPhone(input.value, code) : '';
      hint.textContent = full
        ? 'Will be saved as ' + full + '.'
        : 'Enter the ' + c.name + ' number only.';
    },

    /* --- delivery speed ---------------------------------------------------
       Prices and delivery windows come from SHIPPING_METHODS, so the card
       copy cannot drift from the figure the order total is actually using. */
    renderShipping() {
      const group = qs('[data-shipping-list]');
      if (group) {
        group.innerHTML = SHIPPING_METHODS.map(
          (s, i) =>
            '<label class="radio-card">' +
              '<input type="radio" name="shipping" value="' + s.id + '" required' +
                (i === 0 ? ' checked' : '') + '>' +
              '<span class="radio-card__body">' +
                '<span class="radio-card__title">' + escapeHTML(s.title) + '</span>' +
                '<span class="radio-card__note">' + escapeHTML(shippingNote(s.id)) + '</span>' +
              '</span>' +
            '</label>'
        ).join('');
      }
      const err = qs('[data-shipping-error]');
      if (err) err.hidden = true;

      /* Reflect the stored choice, so returning to the checkout keeps the
         speed the shopper last picked. */
      const chosen = group ? group.querySelector('input[value="' + Shipping.selected() + '"]') : null;
      if (chosen) chosen.checked = true;
    },

    onShippingChange() {
      const el = this.form ? this.form.querySelector('input[name="shipping"]:checked') : null;
      if (!el) return;
      Shipping.set(el.value);
      const err = qs('[data-shipping-error]');
      if (err) err.hidden = true;
      this.renderSummary();
      /* The demo panels and the virtual-account figure all quote the total,
         so they have to move with the shipping choice. */
      this.syncPanelAmounts();
      const amt = qs('[data-wallet-amount]');
      if (amt) amt.textContent = money(Store.totals().total);
      const vaAmt = qs('[data-va-amount]');
      if (vaAmt && !qs('[data-va-result]').hidden) vaAmt.textContent = money(Store.totals().total);
    },

    /* --- payment methods -------------------------------------------------- */
    renderMethods() {
      const box = qs('[data-payment-list]');
      const code = this.region();
      const list = PAYMENT_SETS[code] || PAYMENT_SETS.ID;

      if (box) {
        box.innerHTML = list.map((id) => {
          const m = paymentLabel(id, code);
          return (
            '<label class="radio-card">' +
              '<input type="radio" name="payment" value="' + id + '" required>' +
              '<span class="radio-card__body">' +
                '<span class="radio-card__title">' + escapeHTML(m.title) + '</span>' +
                '<span class="radio-card__note">' + escapeHTML(m.note) + '</span>' +
              '</span>' +
            '</label>'
          );
        }).join('');
      }

      /* Card networks follow the region, so they rebuild alongside. */
      const types = qs('[data-card-types]');
      if (types) {
        types.innerHTML = (CARD_BRANDS[code] || []).map(
          (b, i) =>
            '<label class="chip-radio">' +
              '<input type="radio" name="cardtype" value="' + escapeHTML(b) + '"' +
                (i === 0 ? ' checked' : '') + '>' +
              '<span class="chip-radio__text">' + escapeHTML(b) + '</span>' +
            '</label>'
        ).join('');
      }

      this.renderWallets();
      this.setPanel('');
    },

    checkedMethod() {
      const el = this.form
        ? this.form.querySelector('input[name="payment"]:checked')
        : null;
      return el ? el.value : '';
    },

    setPanel(id) {
      qsa('[data-panel]').forEach((p) => {
        p.hidden = p.getAttribute('data-panel') !== id;
      });
    },

    onPaymentChange() {
      const id = this.checkedMethod();
      this.setPanel(id);
      const pg = qs('[data-payment-error]');
      if (pg) pg.hidden = true;
      /* Errors belonging to the method the user just left must not linger. */
      this.clearGroupErrors();
      /* Re-derive the dependent panels instead of blanking them: switching
         Card -> Bank transfer and back must not silently drop the bank or
         wallet the shopper already chose. Each handler hides its own panel
         when nothing is selected. */
      this.syncMethodPanels(id);
      this.syncPanelAmounts();
    },

    syncMethodPanels(id) {
      if (id === 'va') this.onBankChange();
      else this.hideVa();
      if (id === 'wallet') this.onWalletChange();
      else this.hideWalletStep();
    },

    /* Amounts inside the demo panels always mirror the order total. */
    syncPanelAmounts() {
      const total = money(Store.totals().total);
      const qr = qs('[data-qr-amount]');
      if (qr) qr.textContent = total;
      const paypal = qs('[data-paypal-amount]');
      if (paypal) paypal.textContent = total;
    },

    initPanels() {
      const qr = qs('[data-qr-demo]');
      if (qr) qr.innerHTML = demoQrPattern();
      qsa('[data-demo-continue]').forEach((b) =>
        b.addEventListener('click', () => this.demoContinue(b.getAttribute('data-demo-continue')))
      );
      this.syncPanelAmounts();
    },

    onCountryChange() {
      const code = this.region();
      /* Re-point the number at the new country. Separators typed for the
         previous region are dropped; the digits the user typed are kept,
         so switching region never silently discards their input. */
      const phoneEl = formField(this.form, 'phone');
      if (phoneEl && phoneEl.value.trim()) {
        phoneEl.value = nationalNumber(phoneEl.value, code);
      }
      this.updatePhoneHint();
      this.renderMethods();
      this.clearGroupErrors();
      /* renderMethods() rebuilds the method radios, so nothing is checked
         yet unless the browser kept a match by name and value. */
      this.syncMethodPanels(this.checkedMethod());
      const pg = qs('[data-payment-error]');
      if (pg) pg.hidden = true;
      const wrap = phoneEl ? phoneEl.closest('.field') : null;
      if (wrap) wrap.classList.remove('is-invalid');
      this.syncPanelAmounts();
    },

    /* --- card ------------------------------------------------------------- */
    initCards() {
      const num = formField(this.form, 'cardnumber');
      if (num) {
        num.addEventListener('input', () => {
          const d = num.value.replace(/\D/g, '').slice(0, 19);
          num.value = d.replace(/(.{4})(?=.)/g, '$1 ');
        });
      }
      const exp = formField(this.form, 'cardexp');
      if (exp) {
        exp.addEventListener('input', () => {
          const d = exp.value.replace(/\D/g, '').slice(0, 4);
          exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
        });
      }
      const cvc = formField(this.form, 'cardcvc');
      if (cvc) {
        cvc.addEventListener('input', () => {
          cvc.value = cvc.value.replace(/\D/g, '').slice(0, 4);
        });
      }
    },

    /* --- bank transfer / virtual account ---------------------------------- */
    initBanks() {
      const grid = qs('[data-bank-list]');
      if (!grid) return;
      this.bankGrid = grid;
      /* The "View all banks" container is a second grid in the markup. It has
         to be filled from BANKS as well, otherwise the toggle reveals an
         empty box while the full list quietly replaces the popular one. */
      this.bankAll = qs('[data-bank-all]');
      this.bankToggle = qs('[data-bank-toggle]');
      this.showAll = false;

      const search = qs('[data-bank-search]');
      if (search) {
        search.addEventListener('input', () => this.renderBanks(search.value.trim()));
      }

      if (this.bankToggle) {
        this.bankToggle.addEventListener('click', () => {
          this.showAll = !this.showAll;
          this.bankToggle.setAttribute('aria-expanded', String(this.showAll));
          this.bankToggle.textContent = this.showAll ? 'Show popular banks only' : 'View all banks';
          this.renderBanks(search ? search.value.trim() : '');
        });
      }

      const copy = qs('[data-copy-va]');
      if (copy) copy.addEventListener('click', () => this.copyVa(copy));

      this.renderBanks('');
    },

    bankCardHTML(b) {
      return (
        '<label class="radio-card">' +
          '<input type="radio" name="bank" value="' + b.id + '">' +
          '<span class="radio-card__body">' +
            '<span class="radio-card__title">' + escapeHTML(b.name) + '</span>' +
            '<span class="radio-card__note">Virtual account</span>' +
          '</span>' +
        '</label>'
      );
    },

    renderBanks(term) {
      const t = (term || '').toLowerCase();
      const hits = (list) => list.filter((b) => !t || b.name.toLowerCase().indexOf(t) > -1);

      /* A live search already reaches the whole list, so while a search is
         running every hit goes in the first grid and the toggle is hidden -
         otherwise the same banks would be listed twice. */
      const searching = t.length > 0;
      const popular = hits(searching ? BANKS : popularBanks());

      if (this.bankGrid) this.bankGrid.innerHTML = popular.map(this.bankCardHTML).join('');
      /* The second grid carries only what the popular grid does not already
         show. Re-listing all of BANKS here duplicated the six popular banks
         on screen the moment "View all banks" was expanded. */
      if (this.bankAll) {
        const remainder = BANKS.filter((b) => !b.popular);
        this.bankAll.innerHTML = searching ? '' : remainder.map(this.bankCardHTML).join('');
        this.bankAll.hidden = searching || !this.showAll;
      }
      if (this.bankToggle) this.bankToggle.hidden = searching;

      const none = qs('[data-bank-empty]');
      if (none) none.hidden = popular.length > 0;

      /* Preserve an existing choice across a re-render, in whichever grid it
         is currently drawn. */
      const prev = this.selectedBank();
      if (prev) {
        qsa('[data-bank-list] input[name="bank"], [data-bank-all] input[name="bank"]').forEach((i) => {
          i.checked = i.value === prev.id;
        });
      }
    },

    selectedBank() {
      const el = this.form
        ? this.form.querySelector('input[name="bank"]:checked')
        : null;
      return el ? BANKS.find((b) => b.id === el.value) || null : null;
    },

    onBankChange() {
      const err = qs('[data-err="bank"]');
      if (err) err.hidden = true;
      const box = qs('[data-va-result]');
      const bank = this.selectedBank();
      if (!box) return;
      if (!bank) { box.hidden = true; return; }
      box.hidden = false;
      const name = qs('[data-va-bank]', box);
      const num = qs('[data-va-number]', box);
      const amt = qs('[data-va-amount]', box);
      if (name) name.textContent = bank.name + ' virtual account';
      if (num) num.textContent = mockVaNumber(bank, this.vaSeed());
      if (amt) amt.textContent = money(Store.totals().total);
    },

    vaSeed() {
      return Store.totals().total + '|' + Store.cartLines().length;
    },

    hideVa() {
      const box = qs('[data-va-result]');
      if (box) box.hidden = true;
    },

    copyVa(btn) {
      const el = qs('[data-va-number]');
      if (!el) return;
      const text = el.textContent.trim();
      const out = qs('[data-copy-feedback]');

      /* navigator.clipboard is unavailable in insecure contexts, so fall
         back to a throwaway textarea rather than failing silently. */
      const legacy = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        let done = false;
        try { done = document.execCommand('copy'); } catch (e) { done = false; }
        ta.remove();
        return done;
      };
      const finish = (copied) => {
        if (out) {
          out.textContent = copied
            ? 'Copied ' + text + ' to your clipboard.'
            : 'Copy this number manually: ' + text;
        }
        if (btn) {
          const label = btn.textContent;
          btn.textContent = copied ? 'Copied' : 'Copy failed';
          setTimeout(() => { btn.textContent = label; }, 2000);
        }
        Toast.show(copied ? 'VA number copied' : 'Copy the number manually',
          text, copied ? 'success' : 'error');
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => finish(true), () => finish(legacy()));
      } else {
        finish(legacy());
      }
    },

    /* --- digital wallet ---------------------------------------------------- */
    renderWallets() {
      const box = qs('[data-wallet-list]');
      if (!box) return;
      box.innerHTML = (WALLETS[this.region()] || []).map(
        (w) =>
          '<label class="radio-card">' +
            '<input type="radio" name="wallet" value="' + escapeHTML(w) + '">' +
            '<span class="radio-card__body">' +
              '<span class="radio-card__title">' + escapeHTML(w) + '</span>' +
            '</span>' +
          '</label>'
      ).join('');
    },

    onWalletChange() {
      const err = qs('[data-err="wallet"]');
      if (err) err.hidden = true;
      const el = this.form.querySelector('input[name="wallet"]:checked');
      const step = qs('[data-wallet-step]');
      if (!step) return;
      if (!el) { step.hidden = true; return; }
      step.hidden = false;
      const copy = qs('[data-wallet-copy]');
      const amt = qs('[data-wallet-amount]');
      const btn = qs('[data-wallet-continue]');
      if (copy) copy.textContent = 'Demo: you would be redirected to the ' + el.value + ' application.';
      if (amt) amt.textContent = money(Store.totals().total);
      if (btn) btn.textContent = 'Continue to ' + el.value;
    },

    hideWalletStep() {
      const step = qs('[data-wallet-step]');
      if (step) step.hidden = true;
    },

    demoContinue(label) {
      Toast.show(label + ' (demo)', 'No payment was processed. Nothing was sent anywhere.', 'success');
    },

    clearGroupErrors() {
      qsa('[data-err]').forEach((n) => (n.hidden = true));
      qsa('.field.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
    },

    /* --- validation -------------------------------------------------------- */
    validate() {
      const f = this.form;
      let ok = true;
      const code = this.region();

      const rules = [
        ['fullname', (v) => (v.trim().length >= 2 ? '' : 'Enter your full name.')],
        ['email', (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.')],
        ['address', (v) => (v.trim().length >= 5 ? '' : 'Enter your street address.')],
        ['city', (v) => (v.trim() ? '' : 'Enter your city.')],
        ['postcode', (v) => (v.trim().length >= 3 ? '' : 'Enter your postcode.')]
      ];

      rules.forEach(([name, test]) => {
        const el = formField(f, name);
        if (!el) return;
        const msg = test(el.value);
        if (!msg) return;
        ok = false;
        const wrap = el.closest('.field');
        if (!wrap) return;
        wrap.classList.add('is-invalid');
        const err = qs('.field__error', wrap);
        if (err) err.textContent = msg;
      });

      /* Phone: national portion only, 6-15 digits once separators are
         stripped. Deliberately loose - no per-country length tables. */
      const phoneEl = formField(f, 'phone');
      const nat = nationalNumber(phoneEl ? phoneEl.value : '', code);
      if (nat.length < 6 || nat.length > 15) {
        ok = false;
        const wrap = phoneEl ? phoneEl.closest('.field') : null;
        if (wrap) {
          wrap.classList.add('is-invalid');
          const err = qs('.field__error', wrap);
          if (err) err.textContent = 'Please enter a valid phone number.';
        }
      }

      const shipping = f.querySelector('input[name="shipping"]:checked');
      if (!shipping) {
        ok = false;
        const g = qs('[data-shipping-error]');
        if (g) g.hidden = false;
      }

      /* Nothing is pre-selected, so this branch is reachable. */
      const method = this.checkedMethod();
      const pg = qs('[data-payment-error]');
      if (!method) {
        ok = false;
        if (pg) pg.hidden = false;
      } else if (pg) {
        pg.hidden = true;
      }

      /* Card fields are required only when a card is actually chosen. */
      if (method === 'card') {
        if (!f.querySelector('input[name="cardtype"]:checked')) {
          ok = false;
          const e = qs('[data-err="cardtype"]');
          if (e) e.hidden = false;
        }
        const cardRules = [
          ['cardname', (v) => (v.trim() ? '' : 'Please enter the cardholder name.')],
          ['cardnumber', (v) => (v.replace(/\D/g, '').length >= 12 ? '' : 'Please enter a valid card number.')],
          ['cardexp', (v) => (/^\d{2}\/\d{2}$/.test(v.trim()) ? '' : 'Please enter the expiry date as MM/YY.')],
          ['cardcvc', (v) => (v.replace(/\D/g, '').length >= 3 ? '' : 'Please enter the security code.')]
        ];
        cardRules.forEach(([name, test]) => {
          const el = formField(f, name);
          if (!el) return;
          const msg = test(el.value);
          if (!msg) return;
          ok = false;
          const wrap = el.closest('.field');
          if (!wrap) return;
          wrap.classList.add('is-invalid');
          const err = qs('.field__error', wrap);
          if (err) err.textContent = msg;
        });
      }

      if (method === 'va' && !this.selectedBank()) {
        ok = false;
        const e = qs('[data-err="bank"]');
        if (e) e.hidden = false;
      }

      if (method === 'wallet' && !f.querySelector('input[name="wallet"]:checked')) {
        ok = false;
        const e = qs('[data-err="wallet"]');
        if (e) e.hidden = false;
      }

      if (!ok) {
        const firstBad = qs('.field.is-invalid input', f);
        if (firstBad) firstBad.focus();
        else {
          const shown = qs('[data-panel]:not([hidden])');
          const focusTarget = shown ? qs('input, button', shown) : null;
          if (focusTarget) focusTarget.focus();
        }
        Toast.show('Check your details', 'Some fields need attention.', 'error');
      }
      return ok;
    },

    placeOrder() {
      const f = this.form;
      const cart = Store.cartLines().map((l) => Object.assign({}, l));
      const totals = Store.totals();
      const method = this.checkedMethod();
      const bank = this.selectedBank();
      const walletEl = f.querySelector('input[name="wallet"]:checked');
      const cardTypeEl = f.querySelector('input[name="cardtype"]:checked');
      const val = (n) => { const e = formField(f, n); return e ? e.value.trim() : ''; };

      const order = {
        number: 'CW-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000),
        date: new Date().toISOString(),
        email: val('email'),
        name: val('fullname'),
        phone: fullPhone(val('phone'), this.region()),
        country: countryById(this.region()).name,
        address: val('address') + ', ' + val('city') + ' ' + val('postcode'),
        shippingMethod: Shipping.selected(),
        shippingTitle: shippingMethod(Shipping.selected()).title,
        paymentMethod: method,
        /* Prototype record only. No card number, CVC, expiry or credential
           of any kind is written here. */
        paymentDetail: {
          label: method ? paymentLabel(method, this.region()).title : '',
          cardType: method === 'card' && cardTypeEl ? cardTypeEl.value : '',
          bank: method === 'va' && bank ? bank.name : '',
          vaNumber: method === 'va' && bank ? mockVaNumber(bank, this.vaSeed()) : '',
          wallet: method === 'wallet' && walletEl ? walletEl.value : ''
        },
        items: cart.map((l) => {
          const p = byId(l.id);
          return { id: l.id, name: p.name, price: p.price, qty: l.qty, color: l.color, size: l.size };
        }),
        totals: totals
      };

      writeStore('cw_last_order', order);
      Store.clearCart();
      window.location.href = 'confirmation.html';
    },

    renderSummary() {
      if (!this.summary) return;
      const cart = Store.cartLines();
      const t = Store.totals();
      const code = this.region();
      const phoneEl = formField(this.form, 'phone');
      const phone = phoneEl ? fullPhone(phoneEl.value, code) : '';
      const method = this.checkedMethod();
      const payLabel = method ? paymentLabel(method, code).title : 'Not selected yet';

      this.summary.innerHTML =
        '<h2 class="summary__title">Order summary</h2>' +
        '<ul class="summary__items">' +
          cart.map((l) => {
            const p = byId(l.id);
            if (!p) return '';
            return '<li class="summary__item">' +
                '<img src="' + IMG + p.images[0] + '--240.jpg" alt="" loading="lazy" width="240" height="300">' +
                '<span class="summary__item-body">' +
                  '<span class="summary__item-name">' + escapeHTML(p.name) + '</span>' +
                  '<span class="summary__item-meta">' + escapeHTML(l.color) + ' &middot; ' +
                    escapeHTML(l.size) + ' &middot; Qty ' + l.qty + '</span>' +
                '</span>' +
                '<span class="summary__item-price">' + money(p.price * l.qty) + '</span>' +
              '</li>';
          }).join('') +
        '</ul>' +
        '<dl class="summary__rows">' +
          (phone ? '<div class="summary__row"><dt>Contact</dt><dd>' + escapeHTML(phone) + '</dd></div>' : '') +
          '<div class="summary__row"><dt>Payment</dt><dd>' + escapeHTML(payLabel) + '</dd></div>' +
          /* Total quantity, so the number can be compared directly against
             the navbar cart badge. The per-line "Qty n" above adds up to
             exactly this. */
          '<div class="summary__row"><dt>Items</dt><dd>' + t.items + '</dd></div>' +
          '<div class="summary__row"><dt>Subtotal</dt><dd>' + money(t.subtotal) + '</dd></div>' +
          '<div class="summary__row"><dt>Shipping</dt><dd>' +
            (t.shipping === 0
              ? '<span class="summary__free">Free</span>'
              : escapeHTML(money(t.shipping))) +
            '</dd></div>' +
          '<div class="summary__row"><dt>Estimated tax</dt><dd>' + money(t.tax) + '</dd></div>' +
          '<div class="summary__row summary__row--total"><dt>Total</dt><dd>' + money(t.total) + '</dd></div>' +
        '</dl>';
    }
  };

  /* ======================================================================
     16. ORDER CONFIRMATION
     ====================================================================== */
  const Confirmation = {
    init() {
      const box = qs('[data-confirmation]');
      if (!box) return;
      const order = readStore('cw_last_order', null);

      if (!order || !order.items || !order.items.length) {
        box.innerHTML =
          '<div class="empty-state">' +
            '<span class="empty-state__icon">' + ICON.bagEmpty + '</span>' +
            '<h1>No recent order</h1>' +
            '<p>We could not find a recent order on this device. Place an order and the ' +
              'confirmation will appear here.</p>' +
            '<a class="btn btn--lg" href="shop.html">Browse the collection</a>' +
          '</div>';
        return;
      }

      /* Working days come from the delivery speed the shopper chose, so the
         ETA always agrees with the shipping line they were charged for. */
      const eta = new Date(order.date);
      eta.setDate(eta.getDate() + shippingMethod(order.shippingMethod).workingDays);

      box.innerHTML =
        '<div class="confirm">' +
          '<span class="confirm__mark" aria-hidden="true">' + ICON.check + '</span>' +
          '<p class="eyebrow">Order confirmed</p>' +
          '<h1 class="confirm__title">Thank you, ' + escapeHTML(order.name.split(' ')[0]) + '.</h1>' +
          '<p class="confirm__lede">Your order is on its way. We have sent a confirmation to ' +
            '<strong>' + escapeHTML(order.email) + '</strong>.</p>' +

          '<dl class="confirm__meta">' +
            '<div><dt class="confirm__meta-label">Order number</dt>' +
              '<dd class="confirm__meta-value">' + order.number + '</dd></div>' +
            '<div><dt class="confirm__meta-label">Estimated delivery</dt>' +
              '<dd class="confirm__meta-value">' +
                eta.toLocaleDateString(CONFIG.locale, { day: 'numeric', month: 'long', year: 'numeric' }) +
              '</dd></div>' +
            '<div><dt class="confirm__meta-label">Total paid</dt>' +
              '<dd class="confirm__meta-value">' + money(order.totals.total) + '</dd></div>' +
          '</dl>' +

          /* Payment record. Prototype reference numbers only - a virtual
             account or demo QR reference is what the shopper would need
             to follow up. Nothing here is a live instruction. */
          (order.shippingTitle
            ? '<dl class="confirm__meta confirm__meta--payment">' +
                '<div><dt class="confirm__meta-label">Delivery</dt>' +
                  '<dd class="confirm__meta-value">' + escapeHTML(order.shippingTitle) +
                  ' &middot; ' + escapeHTML(shippingNote(order.shippingMethod)) +
                  '</dd></div>' +
              '</dl>'
            : '') +

          (order.paymentDetail && order.paymentDetail.label
            ? '<dl class="confirm__meta confirm__meta--payment">' +
                '<div><dt class="confirm__meta-label">Payment method</dt>' +
                  '<dd class="confirm__meta-value">' +
                    escapeHTML(order.paymentDetail.label) +
                    (order.paymentDetail.cardType
                      ? ' &middot; ' + escapeHTML(order.paymentDetail.cardType) : '') +
                    (order.paymentDetail.bank
                      ? ' &middot; ' + escapeHTML(order.paymentDetail.bank) : '') +
                    (order.paymentDetail.wallet
                      ? ' &middot; ' + escapeHTML(order.paymentDetail.wallet) : '') +
                  '</dd></div>' +
                (order.paymentDetail.vaNumber
                  ? '<div><dt class="confirm__meta-label">Virtual account (demo)</dt>' +
                    '<dd class="confirm__meta-value">' +
                      escapeHTML(order.paymentDetail.vaNumber) + '</dd></div>'
                  : '') +
              '</dl>'
            : '') +

          '<section class="confirm__items" aria-labelledby="c-items">' +
            '<h2 id="c-items">Items in this order</h2>' +
            '<ul>' +
              order.items.map((i) => {
                const p = byId(i.id);
                return '<li class="confirm__item">' +
                    '<img src="' + IMG + (p ? p.images[0] : '') + '--240.jpg" alt="" ' +
                      'loading="lazy" width="240" height="300">' +
                    '<span class="confirm__item-body">' +
                      '<span class="confirm__item-name">' + escapeHTML(i.name) + '</span>' +
                      '<span class="confirm__item-meta">' + escapeHTML(i.color) + ' &middot; Size ' +
                        escapeHTML(i.size) + ' &middot; Qty ' + i.qty + '</span>' +
                    '</span>' +
                    '<span class="confirm__item-price">' + money(i.price * i.qty) + '</span>' +
                  '</li>';
              }).join('') +
            '</ul>' +
          '</section>' +

          '<div class="confirm__actions">' +
            '<a class="btn btn--lg" href="shop.html">Continue shopping</a>' +
            '<button type="button" class="btn btn--ghost btn--lg" data-print>View order</button>' +
          '</div>' +
        '</div>';

      qs('[data-print]').addEventListener('click', () => window.print());
    }
  };

  /* ======================================================================
     17. WISHLIST PAGE
     ====================================================================== */
  const WishlistPage = {
    init() {
      const grid = qs('[data-wishlist-grid]');
      if (!grid) return;
      const empty = qs('[data-wishlist-empty]');
      const wrap = qs('[data-wishlist-filled]');

      Store.subscribe(() => {
        const list = Store.state().wishlist.map(byId).filter(Boolean);
        if (empty) empty.hidden = list.length > 0;
        if (wrap) wrap.hidden = list.length === 0;
        grid.innerHTML = list.map((p) => productCardHTML(p, { oldPrice: true })).join('');
      });
    }
  };

  /* ======================================================================
     18. BOOT
     ====================================================================== */
  function init() {
    Toast.mount();
    Header.init();
    Auth.init();
    initWishlistDelegation();
    initQuickAddDelegation();
    Home.init();
    Shop.init();
    Collections.init();
    ProductPage.init();
    CartPage.init();
    Checkout.init();
    Confirmation.init();
    WishlistPage.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
