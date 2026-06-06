// Read-only live smoke — safe against serverless prod (no state mutation).
// Target with PLAYWRIGHT_BASE_URL=https://your-deployment.vercel.app pnpm test:e2e e2e/prod-smoke.spec.ts

import { test, expect } from "@playwright/test";
import { login } from "./fixtures/auth";

test("home renders hero heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /We dress the hours/i }),
  ).toBeVisible();
});

test("PDP renders product heading and add-to-cart control", async ({ page }) => {
  // daybreak-overshirt is a real SSG slug (fixtures/products.json, collectionSlug: halo)
  await page.goto("/product/daybreak-overshirt");
  // The product name is in an <h1> (src/app/(store)/product/[slug]/page.tsx:114)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // add-to-cart button is always rendered by AddToCartButton
  // (src/components/store/add-to-cart-button.tsx:87)
  await expect(page.getByTestId("add-to-cart")).toBeVisible();
});

test("collection page renders heading and product imagery", async ({ page }) => {
  // halo is a real collection slug (fixtures/products.json)
  await page.goto("/collections/halo");
  // Collection name in <h1> (src/app/(store)/collections/[slug]/page.tsx:58)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // ProductCard renders product-card-<slug> links with imagery
  // (src/components/store/product-card.tsx:16)
  await expect(page.locator("[data-testid^='product-card-']").first()).toBeVisible();
});

test("auth gate redirects unauthenticated /overview to /login", async ({ page }) => {
  await page.goto("/overview");
  // The command center layout redirects to /login when no session cookie is present
  // (src/app/(command)/layout.tsx:23)
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByTestId("login-email")).toBeVisible();
});

test("login works and overview KPI grid is visible", async ({ page }) => {
  await login(page);
  await expect(page.getByTestId("kpi-grid")).toBeVisible();
});
