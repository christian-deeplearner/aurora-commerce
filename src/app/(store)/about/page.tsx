// The About page — a two-column editorial manifesto for the (fictional) house.
// Server Component; static editorial content.

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-24 sm:px-10 sm:pt-32">
        <p className="label label-muted">About</p>
        <h1 className="display mt-6 max-w-4xl text-5xl text-ink sm:text-7xl">
          A house built to study the light.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 sm:px-10 sm:pb-36">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <h2 className="label label-muted">The Premise</h2>
          </div>
          <div className="md:col-span-8 space-y-8">
            <p className="serif text-2xl text-ink sm:text-3xl">
              Aurora is an editorial-luxury house of fictional goods — a teaching
              artifact, not a store you can buy from.
            </p>
            <p className="serif text-lg text-ink-muted">
              Every collection, product, price, and order here is invented and
              seeded with synthetic data. The point is the craft of the build:
              how a calm, premium storefront and the operator command center
              behind it come together cleanly, with a single data seam between
              the showroom and the back office.
            </p>
            <p className="serif text-lg text-ink-muted">
              We organize everything around one idea — light across a day. Halo
              opens it, Umbra closes it, and Solstice, Aurora, Meridian, and
              Lumen hold the hours in between.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-hairline pt-20 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <h2 className="label label-muted">Materials &amp; Method</h2>
          </div>
          <div className="md:col-span-8 grid gap-10 sm:grid-cols-2">
            <p className="serif text-lg text-ink-muted">
              Unstructured tailoring and brushed naturals for the foundation
              lines. Hand-dyed gradients and iridescent finishes where the house
              takes its risks. Objects measured in small radiances.
            </p>
            <p className="serif text-lg text-ink-muted">
              The craft is real even when the catalog is a story. That is the
              register we are after: generous whitespace, an oversized serif
              voice, and the patience to let each piece hold the light.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <Link
            href="/collections"
            className="label inline-flex items-center gap-2 border-b border-hairline pb-2 text-ink transition-colors hover:border-ink hover:text-accent"
          >
            See the collections
          </Link>
        </div>
      </section>
    </div>
  );
}
