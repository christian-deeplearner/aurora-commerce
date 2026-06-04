// Aurora's collections — "A House of Light". Hand-authored (not faker-random)
// because collection identity is editorial, not synthetic. These are the spine
// the products hang from; everything downstream references collection slugs.

import type { Collection } from "@/lib/types";

export const COLLECTIONS: readonly Collection[] = [
  {
    slug: "halo",
    name: "Halo",
    glyph: "○",
    tagline: "Softness is architecture.",
    description:
      "The quiet circle of first light. Halo is our foundation line — unstructured tailoring, brushed cottons, and pieces that hold their shape by holding their breath.",
  },
  {
    slug: "umbra",
    name: "Umbra",
    glyph: "◐",
    tagline: "What the light leaves behind.",
    description:
      "Shadow as material. Deep indigos and charcoals, heavier weights, garments cut for the hours after dusk. Umbra is Halo's counterweight.",
  },
  {
    slug: "solstice",
    name: "Solstice",
    glyph: "✶",
    tagline: "The longest day, worn close.",
    description:
      "Our warm-season edit. Open weaves, sun-bleached neutrals, and objects for living outdoors. Made for the year's high noon.",
  },
  {
    slug: "aurora",
    name: "Aurora",
    glyph: "≋",
    tagline: "Color that arrives without warning.",
    description:
      "The house signature. Iridescent finishes, hand-dyed gradients, and statement pieces that shift with the room. Aurora is where we take risks.",
  },
  {
    slug: "meridian",
    name: "Meridian",
    glyph: "│",
    tagline: "A line drawn through the noise.",
    description:
      "Travel and the long commute. Wrinkle-easy technical wovens, modular layers, and a precise, navigational palette. Meridian moves.",
  },
  {
    slug: "lumen",
    name: "Lumen",
    glyph: "·",
    tagline: "Measured in small radiances.",
    description:
      "Objects and accessories — the smallest unit of light. Ceramics, hardware, candles, and carry goods that finish a room or a coat.",
  },
];

export function getCollectionsSeed(): Collection[] {
  // Return a fresh array copy so callers can't mutate the canonical list.
  return COLLECTIONS.map((c) => ({ ...c }));
}
