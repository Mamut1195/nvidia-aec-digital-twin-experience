# 08 — QA and Performance

## 1. Browser targets

Primary:
- current Chrome/Chromium desktop;
- current Edge desktop.

Secondary:
- Safari desktop;
- Firefox desktop.

Mobile:
- recent iOS Safari;
- recent Android Chrome.

If a rendering feature is unsupported, fall back gracefully.

## 2. Performance budgets

Targets, not absolute guarantees:

### Initial page
- HTML/CSS/JS shell usable quickly.
- 3D assets lazy-loaded after shell.

### 3D
- target 45–60 FPS on a modern mid-range laptop in normal mode;
- acceptable minimum 30 FPS in low quality;
- pixel ratio capped;
- avoid excessive draw calls;
- use instancing;
- use LOD where beneficial.

### Network
Keep first meaningful 3D scene download reasonably small.
Large modes such as video/reality capture should lazy-load only when opened.

## 3. Quality degradation

Order for reducing cost:
1. post-processing;
2. shadows;
3. particle count;
4. texture resolution;
5. context geometry;
6. pixel ratio.

Never remove the primary engineering information before cosmetic effects.

## 4. Tests

### Unit
- scenario parsing;
- data schemas;
- copilot intent matching;
- interpolation;
- KPI calculations;
- mode reducers/actions.

### Integration
- selecting BIM object opens correct metadata;
- wind control changes dataset;
- flood timeline changes extent;
- video query jumps to timestamp;
- logistics toggles baseline/optimized;
- robot mission plays;
- copilot changes mode.

### E2E
Playwright:
- load home;
- enter experience;
- complete guided tour;
- open every mode;
- run one action per mode;
- return to overview;
- verify no console errors classified as fatal.

## 5. Visual regression

Capture fixed screenshots for:
- overview;
- BIM;
- wind;
- flood;
- video AI;
- logistics;
- robotics;
- twin.

Use deterministic camera presets.

## 6. Accessibility QA

Check:
- keyboard navigation;
- screen-reader names for controls;
- contrast;
- reduced motion;
- focus trap behavior in drawers/modals;
- tab order.

## 7. Content QA

Before release verify:
- each NVIDIA technology has official source link;
- each mode has correct status badge;
- no precomputed feature is described as live;
- engineering disclaimers are present;
- no proprietary asset lacks attribution.

## 8. Failure testing

Test missing:
- model;
- one JSON file;
- video;
- optional reality-capture asset.

One failure must not take down the full app.

## 9. Definition of release candidate

RC requires:
- static build succeeds;
- all modes reachable;
- no P0/P1 bugs;
- all status labels present;
- all external links valid at review time;
- desktop performance acceptable;
- mobile guided tour usable.
