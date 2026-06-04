"use client";

// The dark "NOTIFY ME" block that anchors the storefront footer. Editorial
// email capture — no backend; it confirms locally. Client component for the
// controlled input + submit state.

import * as React from "react";
import { ArrowRight } from "lucide-react";

export function NotifyBlock() {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <section className="bg-panel text-paper-on-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 md:grid-cols-2 md:gap-16 md:py-28">
        <div>
          <p className="label text-paper-on-panel/60">Notify Me</p>
          <h2 className="display mt-6 text-4xl text-paper-on-panel sm:text-5xl">
            Light arrives
            <br />
            without warning.
          </h2>
        </div>

        <div className="flex flex-col justify-end">
          <p className="serif text-lg text-paper-on-panel/70">
            New collections, quietly. Leave a line and we will tell you when the
            next light breaks.
          </p>

          {done ? (
            <p
              className="serif mt-8 border-t border-paper-on-panel/20 pt-8 text-xl text-paper-on-panel"
              role="status"
              data-testid="notify-confirmation"
            >
              Thank you. We will be in touch.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex items-center gap-4 border-b border-paper-on-panel/30 pb-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
                aria-label="Email address"
                className="w-full bg-transparent font-sans text-base text-paper-on-panel outline-none placeholder:text-paper-on-panel/40"
              />
              <button
                type="submit"
                aria-label="Notify me"
                className="shrink-0 text-paper-on-panel transition-transform hover:translate-x-1"
              >
                <ArrowRight className="size-5" strokeWidth={1.5} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
