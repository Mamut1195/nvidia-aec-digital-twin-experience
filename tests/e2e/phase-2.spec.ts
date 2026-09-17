import { expect, test } from "@playwright/test";

test("landing hero offers enter, guided tour, and the ecosystem strip", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("landing-hero")).toBeVisible();
  await expect(page.getByText("NVIDIA × AEC")).toBeVisible();
  await expect(page.getByRole("heading", { name: "From BIM to Physical AI" })).toBeVisible();
  await expect(page.getByTestId("enter-experience")).toBeVisible();
  await expect(page.getByTestId("start-guided-tour")).toBeVisible();
  await expect(page.getByTestId("ecosystem-strip")).toContainText("OpenUSD");
  await expect(page.getByTestId("ecosystem-strip")).toContainText("Isaac");
  await expect(page.getByTestId("how-nvidia-fits")).toBeVisible();
  await expect(page.getByTestId("how-nvidia-fits")).toContainText("do not replace Revit");
});

test("guided tour next/back/exit and resume from start", async ({ page }) => {
  await page.goto("/experience?tour=1");
  await expect(page.getByTestId("experience-shell")).toBeVisible();
  await expect(page.getByTestId("tour-narration")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("tour-narration")).toContainText("One project, many disciplines");

  await page.getByTestId("tour-next").click();
  await expect(page.getByTestId("tour-narration")).toContainText("BIM semantics");
  await expect(page.getByTestId("selected-element-id")).toHaveText("STR-COL-L01-C01");

  await page.getByTestId("tour-back").click();
  await expect(page.getByTestId("tour-narration")).toContainText("One project, many disciplines");

  await page.getByTestId("tour-restart").click();
  await expect(page.getByTestId("tour-narration")).toContainText("One project, many disciplines");

  await page.getByTestId("tour-exit").click();
  await expect(page.getByTestId("tour-narration")).toHaveCount(0);
  await expect(page).toHaveURL(/\/experience/);
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
});

test("BIM inspector, isolation, OpenUSD explainer, and later mode stubs", async ({
  page,
}, testInfo) => {
  await page.goto("/experience");
  await expect(page.getByTestId("scene-ready")).toBeVisible({ timeout: 20_000 });

  const bimButton = testInfo.project.name.includes("mobile")
    ? page.getByTestId("mobile-mode-bar").getByRole("button", { name: "BIM" })
    : page.getByTestId("mode-rail").getByRole("button", { name: /BIM \/ OpenUSD/ });
  await bimButton.click();
  await expect(page).toHaveURL(/\/experience\/?$/);
  await expect(page.getByRole("heading", { name: "BIM / OpenUSD" })).toBeVisible();

  await page.getByTestId("select-sample").dispatchEvent("click");
  await expect(page.getByTestId("selected-element-id")).toHaveText("STR-COL-L01-C01");
  await expect(page.getByTestId("bim-category")).toHaveText("column");
  await expect(page.getByTestId("bim-discipline")).toHaveText("structure");
  await expect(page.getByTestId("bim-level")).toHaveText("L01");
  await expect(page.getByTestId("bim-material")).not.toHaveText("—");
  await expect(page.getByTestId("bim-dimensions")).not.toHaveText("—");
  await expect(page.getByTestId("bim-source")).toHaveText("Demo BIM dataset");

  await page.getByTestId("isolate-level").selectOption("L03");
  await expect(page.getByTestId("isolation-state")).toContainText("L03");
  await page.getByTestId("isolate-discipline").selectOption("structure");
  await expect(page.getByTestId("isolation-state")).toContainText("structure");
  await page.getByTestId("restore-isolation").click();
  await expect(page.getByTestId("isolation-state")).toHaveText("Showing the composed project");

  await page.getByTestId("open-usd-explainer").click();
  await expect(page.getByTestId("usd-drawer")).toBeVisible();
  await expect(page.getByTestId("openusd-explainer")).toContainText("not parsed live from OpenUSD");
  const architectureLayer = page.getByTestId("usd-layer-architecture");
  await architectureLayer.scrollIntoViewIfNeeded();
  await architectureLayer.uncheck();
  await expect(page.getByTestId("usd-composed-stage")).not.toContainText("architecture.usd");
  await page.getByTestId("close-drawer").click();

  const windButton = testInfo.project.name.includes("mobile")
    ? page.getByTestId("mobile-mode-bar").getByRole("button", { name: "Wind" })
    : page.getByTestId("mode-rail").getByRole("button", { name: /Wind \/ Physics AI/ });
  await windButton.click();
  await expect(page).toHaveURL(/\/experience\/?$/);
  await expect(page.getByRole("heading", { name: "Wind / Physics AI" })).toBeVisible();
  await expect(page.getByTestId("context-panel")).toContainText("later phase");
});

test("How NVIDIA Fits keeps authoring tools separate and links official docs", async ({ page }) => {
  await page.goto("/experience");
  await expect(page.getByTestId("experience-shell")).toBeVisible();
  await page.getByTestId("how-nvidia-fits-button").click();
  await expect(page.getByTestId("ecosystem-drawer")).toBeVisible();
  await expect(page.getByTestId("how-nvidia-fits")).toContainText("do not replace Revit");
  const revit = page.locator('[data-product="revit"]');
  await revit.scrollIntoViewIfNeeded();
  await revit.click();
  await expect(page.getByTestId("ecosystem-detail")).toContainText("BIM authoring");
  await expect(page.getByTestId("ecosystem-official-link")).toHaveAttribute(
    "href",
    /autodesk\.com/,
  );
  const omniverse = page.locator('[data-product="omniverse"]');
  await omniverse.scrollIntoViewIfNeeded();
  await omniverse.click();
  await expect(page.getByTestId("ecosystem-official-link")).toHaveAttribute(
    "href",
    /omniverse\.nvidia\.com/,
  );
});
