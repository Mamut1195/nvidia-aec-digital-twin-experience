import { expect, test } from "@playwright/test";

function modeButton(
  page: import("@playwright/test").Page,
  testInfo: import("@playwright/test").TestInfo,
  desktopName: RegExp,
  mobileName: string,
) {
  return testInfo.project.name.includes("mobile")
    ? page.getByTestId("mobile-mode-bar").getByRole("button", { name: mobileName })
    : page.getByTestId("mode-rail").getByRole("button", { name: desktopName });
}

test("structural heatmap, selectors, inspectable values, and not-a-design-check disclaimer", async ({
  page,
}, testInfo) => {
  await page.goto("/experience");
  await expect(page.getByTestId("scene-ready")).toBeVisible({ timeout: 20_000 });
  await modeButton(page, testInfo, /Structural/, "Structure").click();
  await expect(page.getByRole("heading", { name: "Structural" })).toBeVisible();
  await page.getByTestId("structural-panel").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("structural-load-case")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("structural-panel")).toBeVisible();
  await expect(page.getByTestId("structural-disclaimer")).toContainText("not a design check");
  await expect(page.getByTestId("structural-disclaimer")).toContainText("Illustrative");
  await expect(page.getByTestId("engineering-disclaimer")).toHaveCount(1);
  await expect(page.getByTestId("engineering-disclaimer")).toBeVisible();
  await expect(page.getByTestId("structural-legend")).toBeVisible();

  await page.getByTestId("select-sample").dispatchEvent("click");
  await expect(page.getByTestId("selected-element-id")).toHaveText("STR-COL-L01-C01");
  await expect(page.getByTestId("structural-value")).not.toHaveText("—");

  const gravityMax = await page
    .getByTestId("structural-legend")
    .locator("span")
    .nth(1)
    .textContent();
  await page.getByTestId("structural-load-case").selectOption("lateral-x");
  await expect(page.getByTestId("structural-hud")).toHaveAttribute("data-load-case", "lateral-x");
  await page.getByTestId("structural-result-type").selectOption("utilization");
  await expect(page.getByTestId("structural-hud")).toHaveAttribute("data-result", "utilization");
  const nextMax = await page.getByTestId("structural-legend").locator("span").nth(1).textContent();
  expect(nextMax).not.toEqual(gravityMax);
  await page.getByTestId("structural-deformation").fill("40");
});

test("wind particles, facade pressure, pedestrian overlay, PRECOMPUTED, PhysicsNeMo explainer", async ({
  page,
}, testInfo) => {
  await page.goto("/experience");
  await expect(page.getByTestId("scene-ready")).toBeVisible({ timeout: 20_000 });
  await modeButton(page, testInfo, /Wind \/ Physics AI/, "Wind").click();
  await page.getByTestId("wind-panel").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("wind-scenario-id")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("wind-panel")).toBeVisible();
  await expect(page.getByTestId("wind-panel").locator("[data-status='PRECOMPUTED']")).toBeVisible();
  await expect(page.getByTestId("wind-scenario-id")).toHaveText("design_0");

  await page.getByTestId("wind-speed").selectOption("extreme");
  await page.getByTestId("wind-direction").selectOption("90");
  await expect(page.getByTestId("wind-scenario-id")).toHaveText("extreme_90");
  await expect(page.getByTestId("wind-hud")).toHaveAttribute("data-scenario", "extreme_90");

  await page.getByTestId("wind-view").selectOption("facade");
  await expect(page.getByTestId("wind-pressure-legend")).toBeVisible();
  await expect(page.getByTestId("wind-pedestrian")).toBeChecked();

  await page.getByTestId("open-physicsnemo").click();
  await expect(page.getByTestId("physicsnemo-drawer")).toBeVisible();
  await expect(page.getByTestId("physicsnemo-explainer")).toContainText(
    "high-fidelity solver → training/reference data → PhysicsNeMo model → validated fast inference",
  );
  await expect(page.getByTestId("physicsnemo-explainer")).toContainText("validation");
  await expect(page.getByTestId("physicsnemo-explainer")).not.toContainText("× faster");
  await expect(page.getByTestId("physicsnemo-explainer")).not.toContainText("10x");
  await expect(page.getByTestId("physicsnemo-official-link")).toHaveAttribute(
    "href",
    /physicsnemo/,
  );
  await page.getByTestId("physicsnemo-step-surrogate").click();
  await expect(page.getByTestId("physicsnemo-detail")).toContainText("not a replacement");
});

test("flood surface, weather WORKFLOW DEMO, timeline reset, Earth-2 explainer", async ({
  page,
}, testInfo) => {
  await page.goto("/experience");
  await expect(page.getByTestId("scene-ready")).toBeVisible({ timeout: 20_000 });
  await modeButton(page, testInfo, /Flood \/ Earth-2/, "Flood").click();
  await page.getByTestId("flood-panel").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("flood-rainfall")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("flood-panel")).toBeVisible();
  await expect(page.getByTestId("weather-source")).toHaveText("WORKFLOW DEMO");
  await expect(page.getByTestId("flood-legend")).toBeVisible();

  await page.getByTestId("flood-rainfall").selectOption("100");
  await page.getByTestId("flood-time").fill("120");
  await expect(page.getByTestId("flood-time-value")).toHaveText("120 min");
  await expect(page.getByTestId("flood-hud")).toHaveAttribute("data-rainfall", "100");
  await expect(page.getByTestId("flood-impact")).not.toContainText("Roads: none affected");

  await page.getByTestId("flood-reset").click();
  await expect(page.getByTestId("flood-time-value")).toHaveText("0 min");
  await expect(page.getByTestId("flood-rainfall")).toHaveValue("50");

  await page.getByTestId("open-earth2").click();
  await expect(page.getByTestId("earth2-drawer")).toBeVisible();
  await expect(page.getByTestId("earth2-explainer")).toContainText(
    "weather AI → hydrology → hydraulics → impact twin",
  );
  await expect(page.getByTestId("earth2-not-solver")).toContainText(
    "not itself the hydraulic flood solver",
  );
  await expect(page.getByTestId("earth2-official-link")).toHaveAttribute("href", /earth-2/);
});
