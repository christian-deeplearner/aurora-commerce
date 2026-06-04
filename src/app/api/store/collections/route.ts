// GET /api/store/collections
// Returns Aurora's collections from the data-layer.

import { NextResponse } from "next/server";
import { getCollections } from "@/lib/data-layer";

export function GET(): NextResponse {
  const collections = getCollections();
  return NextResponse.json({ collections });
}
