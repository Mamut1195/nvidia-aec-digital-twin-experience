import { expect, test } from "@playwright/test";

test("construction scene loads and exposes camera, layers, quality, and optional-asset skip", async ({
  page,
}, testInfo) => {
  await page.goto("/experience");
  await expect(page.getByTestId("experience-shell")).toBeVisible();
  await expect(page.getByTestId("scene-ready")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("scene-ready")).toHaveAttribute(
    "data-load-result-fields",
    "skipped",
  );
  await expect(page.getByTestId("optional-overlay-status")).toHaveText("skipped");
  await expect(page.getByTestId("selected-element-id")).toHaveText("none");

  const architecture = page.getByTestId("layer-architecture");
  await expect(architecture).toBeChecked();
  await architecture.uncheck();
  await expect(architecture).not.toBeChecked();

  const isMobile = testInfo.project.name.includes("mobile");
  const camera = page.getByLabel("Camera preset");
  await camera.selectOption("building");
  await expect(
    page.getByTestId("context-panel").getByText("building", { exact: true }),
  ).toBeVisible();

  if (!isMobile) {
    await page.getByLabel("Quality").selectOption("low");
    await expect(page.getByTestId("context-panel").getByText("low", { exact: true })).toBeVisible();
  }

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(architecture).toBeChecked();
  await expect(camera).toHaveValue("overview");
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
});

test("selection can be cleared from the panel", async ({ page }) => {
  await page.goto("/experience");
  await expect(page.getByTestId("scene-ready")).toBeVisible({ timeout: 20_000 });
  const clear = page.getByTestId("clear-selection");
  await expect(clear).toBeDisabled();
  await page.locator('[data-testid="scene-canvas"] canvas').click({ position: { x: 420, y: 260 } });
  if ((await page.getByTestId("selected-element-id").textContent()) !== "none") {
    await expect(clear).toBeEnabled();
    await clear.click();
    await expect(page.getByTestId("selected-element-id")).toHaveText("none");
  }
});
