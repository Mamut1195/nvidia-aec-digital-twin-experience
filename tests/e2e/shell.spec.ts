import { expect, test } from "@playwright/test";

test("landing page documents the independent demo and enters the shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "From BIM to Physical AI" })).toBeVisible();
  await expect(page.getByTestId("app-footer")).toBeVisible();
  await expect(page.getByTestId("trademark-note")).toContainText("Independent educational");
  await page.getByRole("link", { name: "Enter the Digital Twin" }).click();
  await expect(page).toHaveURL(/\/experience\/?$/);
});

test("experience shell switches modes without navigation and exposes legal copy", async ({
  page,
}, testInfo) => {
  await page.goto("/experience");
  await expect(page.getByTestId("experience-shell")).toBeVisible();
  await expect(page.getByTestId("app-footer")).toBeVisible();
  await expect(page.getByTestId("trademark-note")).toContainText("NVIDIA");
  await expect(page.getByRole("link", { name: "Asset attribution" })).toBeVisible();

  const modeButton = testInfo.project.name.includes("mobile")
    ? page.getByTestId("mobile-mode-bar").getByRole("button", { name: "Structure" })
    : page.getByTestId("mode-rail").getByRole("button", { name: /Structural/ });

  await modeButton.click();
  await expect(page).toHaveURL(/\/experience\/?$/);
  await expect(page.getByRole("heading", { name: "Structural" })).toBeVisible();
  await expect(page.locator('[data-status="PRECOMPUTED"]').first()).toBeVisible();
  const disclaimer = page.getByTestId("engineering-disclaimer");
  await disclaimer.scrollIntoViewIfNeeded();
  await expect(disclaimer).toBeVisible();

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(page.locator('[data-status="INTERACTIVE WEB"]').first()).toBeVisible();
});
