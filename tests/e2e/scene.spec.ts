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
  const camera = isMobile
    ? page.getByTestId("camera-preset-select-compact")
    : page.getByTestId("camera-preset-select");
  await camera.selectOption("building");
  await expect(page.getByTestId("camera-state")).toHaveText("building");

  if (!isMobile) {
    await page.getByTestId("quality-select").selectOption("low");
    await expect(page.getByTestId("quality-state")).toHaveText("low");
  }

  await page.getByTestId("reset-experience").click();
  await expect(architecture).toBeChecked();
  await expect(camera).toHaveValue("overview");
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
});

test("selection can be cleared from the panel", async ({ page }) => {
  await page.goto("/experience");
  await expect(page.getByTestId("scene-ready")).toBeVisible({ timeout: 20_000 });
  const clear = page.getByTestId("clear-selection");
  await expect(clear).toBeDisabled();
  await page.getByTestId("select-sample").dispatchEvent("click");
  await expect(page.getByTestId("selected-element-id")).toHaveText("STR-COL-L01-C01");
  await expect(clear).toBeEnabled();
  await clear.click();
  await expect(page.getByTestId("selected-element-id")).toHaveText("none");
});
