// ~40 Aurora products across the six collections. Names and "kinds" are
// hand-authored per collection so the catalog reads like a real editorial DTC
// house; faker fills the deterministic numeric/inventory detail.

import type { Product, ProductStatus } from "@/lib/types";
import { faker, makeId, slugify, weightedPick } from "./seed";
import { COLLECTIONS } from "./collections";

// Apparel sizing vs. one-size objects. Decided per product "kind".
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];
const ONE_SIZE = ["OS"];

type Kind = "apparel" | "object";

type Blueprint = {
  collectionSlug: string;
  name: string;
  kind: Kind;
  // realistic price band in cents, inclusive
  price: [number, number];
  blurb: string;
};

// Authored catalog. Order is fixed → deterministic ids/prices.
const BLUEPRINTS: readonly Blueprint[] = [
  // ── Halo ─────────────────────────────────────────────
  { collectionSlug: "halo", name: "Daybreak Overshirt", kind: "apparel", price: [16000, 22000], blurb: "An unstructured overshirt in brushed organic cotton. Holds its shape by holding its breath." },
  { collectionSlug: "halo", name: "First Light Trouser", kind: "apparel", price: [15000, 19000], blurb: "A soft, high-rise trouser with a drawn waist. Tailoring that forgives the morning." },
  { collectionSlug: "halo", name: "Cloud Knit Crew", kind: "apparel", price: [12000, 16000], blurb: "Featherweight merino, knit loose. The sweater you forget you are wearing." },
  { collectionSlug: "halo", name: "Veil Cotton Tee", kind: "apparel", price: [8000, 11000], blurb: "A near-translucent jersey tee. The first layer, and sometimes the only one." },
  { collectionSlug: "halo", name: "Bone Linen Shirt", kind: "apparel", price: [14000, 18000], blurb: "Washed linen in warm bone. Crumples on purpose." },
  { collectionSlug: "halo", name: "Halo Sleep Set", kind: "apparel", price: [13000, 17000], blurb: "A two-piece in silk-finish cotton. For the soft hours at either end of the day." },

  // ── Umbra ────────────────────────────────────────────
  { collectionSlug: "umbra", name: "Dusk Wool Coat", kind: "apparel", price: [38000, 48000], blurb: "A long, single-breasted coat in compacted wool. Cut for the hours after the light goes." },
  { collectionSlug: "umbra", name: "Indigo Field Jacket", kind: "apparel", price: [26000, 33000], blurb: "Rope-dyed indigo that deepens with wear. A jacket that keeps its own record." },
  { collectionSlug: "umbra", name: "Charcoal Pleat Trouser", kind: "apparel", price: [17000, 22000], blurb: "A heavier wool trouser with a single deep pleat. Weight you can lean on." },
  { collectionSlug: "umbra", name: "Nightfall Roll-Neck", kind: "apparel", price: [15000, 20000], blurb: "Dense lambswool, knit close to the throat. Shadow as material." },
  { collectionSlug: "umbra", name: "Eclipse Leather Belt", kind: "object", price: [9000, 13000], blurb: "Vegetable-tanned leather, blackened by hand. Ages toward the light." },
  { collectionSlug: "umbra", name: "Umbra Cashmere Scarf", kind: "object", price: [14000, 19000], blurb: "A double-faced cashmere scarf in two depths of grey." },

  // ── Solstice ─────────────────────────────────────────
  { collectionSlug: "solstice", name: "Open Weave Shirt", kind: "apparel", price: [12000, 16000], blurb: "A loosely woven cotton-linen with the sun built in. Breathes before you do." },
  { collectionSlug: "solstice", name: "Sun-Bleached Short", kind: "apparel", price: [9000, 13000], blurb: "A relaxed pull-on short in faded canvas. The color of a long afternoon." },
  { collectionSlug: "solstice", name: "Noon Camp Collar", kind: "apparel", price: [13000, 17000], blurb: "A camp-collar shirt cut wide and easy. Made for the year's high noon." },
  { collectionSlug: "solstice", name: "Meadow Bucket Hat", kind: "object", price: [7000, 9000], blurb: "A packable bucket hat in washed twill. Shade you can fold." },
  { collectionSlug: "solstice", name: "Sandline Espadrille", kind: "apparel", price: [11000, 15000], blurb: "A jute-soled slip-on in raw cotton. For floors that are mostly outdoors." },
  { collectionSlug: "solstice", name: "Daylight Tote", kind: "object", price: [10000, 14000], blurb: "An oversized market tote in heavy natural canvas. Carries the whole afternoon." },

  // ── Aurora ───────────────────────────────────────────
  { collectionSlug: "aurora", name: "Iridescent Shell Jacket", kind: "apparel", price: [34000, 44000], blurb: "A featherlight shell with an oil-slick finish. Color that arrives without warning." },
  { collectionSlug: "aurora", name: "Gradient Silk Dress", kind: "apparel", price: [28000, 38000], blurb: "Hand-dyed silk that moves from dawn to dusk down its length. A statement that shifts with the room." },
  { collectionSlug: "aurora", name: "Prism Knit Sweater", kind: "apparel", price: [19000, 25000], blurb: "Space-dyed yarn knit into a slow spectrum. No two are quite alike." },
  { collectionSlug: "aurora", name: "Spectra Wide Trouser", kind: "apparel", price: [17000, 23000], blurb: "A fluid wide-leg in iridescent twill. Catches light at the hem." },
  { collectionSlug: "aurora", name: "Borealis Scarf", kind: "object", price: [13000, 18000], blurb: "A gradient modal scarf, dawn at one end and deep night at the other." },
  { collectionSlug: "aurora", name: "Refraction Sunglasses", kind: "object", price: [16000, 21000], blurb: "Acetate frames with a faint mirrored bloom. The world, slightly warmer." },

  // ── Meridian ─────────────────────────────────────────
  { collectionSlug: "meridian", name: "Transit Tech Blazer", kind: "apparel", price: [29000, 37000], blurb: "A wrinkle-easy technical blazer that packs flat and arrives ready. Meridian moves." },
  { collectionSlug: "meridian", name: "Course Modular Vest", kind: "apparel", price: [18000, 24000], blurb: "A layering vest with hidden capacity. A line drawn through the noise." },
  { collectionSlug: "meridian", name: "Longitude Travel Pant", kind: "apparel", price: [16000, 21000], blurb: "A four-way-stretch trouser that reads as tailoring and packs as nothing." },
  { collectionSlug: "meridian", name: "Compass Crossbody", kind: "object", price: [12000, 17000], blurb: "A slim, body-mapped crossbody for the documents that matter." },
  { collectionSlug: "meridian", name: "Bearing Weekender", kind: "object", price: [22000, 29000], blurb: "A structured weekender in coated canvas. Two days, one bag." },
  { collectionSlug: "meridian", name: "Waypoint Rain Shell", kind: "apparel", price: [24000, 31000], blurb: "A seam-sealed shell that folds into its own pocket. For the unscheduled weather." },

  // ── Lumen ────────────────────────────────────────────
  { collectionSlug: "lumen", name: "Ember Ceramic Vessel", kind: "object", price: [8000, 12000], blurb: "A hand-thrown stoneware vessel with a warm reactive glaze. The smallest unit of light." },
  { collectionSlug: "lumen", name: "Halo Tealight Set", kind: "object", price: [6000, 9000], blurb: "A set of three pressed-beeswax tealights. Measured in small radiances." },
  { collectionSlug: "lumen", name: "Glow Hardware Tray", kind: "object", price: [9000, 13000], blurb: "A brushed-brass catch-all for the day's small metals." },
  { collectionSlug: "lumen", name: "Wick & Bloom Candle", kind: "object", price: [7000, 10000], blurb: "A poured soy candle in fig and warm cedar. A room, finished." },
  { collectionSlug: "lumen", name: "Facet Drinking Glasses", kind: "object", price: [8000, 11000], blurb: "A pair of hand-cut glasses that scatter the evening light." },
  { collectionSlug: "lumen", name: "Lantern Carry Pouch", kind: "object", price: [9000, 13000], blurb: "A soft leather pouch for cords, keys, and small certainties." },
  { collectionSlug: "lumen", name: "Daylamp Mirror", kind: "object", price: [14000, 19000], blurb: "A round desk mirror with a warm bezel. Brings the window to you." },
  { collectionSlug: "lumen", name: "Quartz Incense Holder", kind: "object", price: [6000, 9000], blurb: "A raw quartz holder for a single stick of smoke." },
];

function roundToNine(cents: number): number {
  // Round to the nearest "x9900" feel (e.g. 18900) for premium price endings.
  const hundreds = Math.round(cents / 1000) * 1000;
  return hundreds - 100; // e.g. 19000 -> 18900
}

function buildProducts(): Product[] {
  const validSlugs = new Set(COLLECTIONS.map((c) => c.slug));

  return BLUEPRINTS.map((bp) => {
    if (!validSlugs.has(bp.collectionSlug)) {
      throw new Error(`Product "${bp.name}" references unknown collection "${bp.collectionSlug}"`);
    }

    const slug = slugify(bp.name);
    const id = makeId("prd");

    // Deterministic price within the band, rounded to a premium ending.
    const rawPrice = faker.number.int({ min: bp.price[0], max: bp.price[1] });
    const priceCents = roundToNine(rawPrice);

    // 1-3 images, deterministic seeds keyed to slug + index.
    const imageCount = faker.number.int({ min: 2, max: 3 });
    const images = Array.from({ length: imageCount }, (_, i) =>
      `https://picsum.photos/seed/aurora-${slug}-${i + 1}/900/1200`,
    );

    // Status: mostly active, a few coming-soon, rare archived.
    const status = weightedPick<ProductStatus>(
      ["active", "coming-soon", "archived"],
      [88, 8, 4],
    );

    // Inventory: coming-soon/archived run lean; active products vary.
    const inventory =
      status === "active"
        ? faker.number.int({ min: 0, max: 220 })
        : faker.number.int({ min: 0, max: 12 });

    const sizes = bp.kind === "apparel" ? [...APPAREL_SIZES] : [...ONE_SIZE];

    return {
      id,
      slug,
      name: bp.name,
      collectionSlug: bp.collectionSlug,
      priceCents,
      currency: "USD",
      images,
      description: bp.blurb,
      sizes,
      status,
      inventory,
    } satisfies Product;
  });
}

export function getProductsSeed(): Product[] {
  return buildProducts();
}
