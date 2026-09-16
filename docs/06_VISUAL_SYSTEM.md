# 06 — Visual System

## 1. Desired feel

Keywords:

- engineering;
- high-tech;
- precise;
- dark control-room;
- spatial;
- credible;
- premium;
- not game-like;
- not cyberpunk;
- not neon overload.

## 2. Layout hierarchy

The 3D world must occupy most of the screen.

UI should be layered over the scene rather than boxing the scene into a small card.

## 3. Typography

Use a modern sans-serif with excellent numeric readability.

Requirements:
- tabular numbers for engineering values;
- strong distinction between headings and data;
- no overly futuristic display font for body text.

## 4. Color strategy

Do not imitate NVIDIA branding beyond using the NVIDIA product names accurately.

Suggested semantic roles:
- neutral dark base;
- white/gray geometry;
- green accent for NVIDIA-related explainer labels if appropriate;
- blue for water/weather;
- warm range for stress/pressure/alerts;
- distinct route colors for optimization.

Ensure accessible contrast.

## 5. 3D materials

Default scene:
- muted materials;
- low visual noise;
- structural elements legible;
- context buildings desaturated;
- equipment slightly more saturated.

Result modes may override materials.

## 6. Visualization conventions

### Structural
Sequential or diverging legend with numeric values.

### Wind
Particles + pressure surface.

### Flood
Transparent water surface + depth legend.

### Logistics
Route polylines and moving vehicle markers.

### Robotics
Waypoints, sensor frustum/cone, path trail.

### Video
Timeline markers.

## 7. Transitions

Mode transitions:
- 300–700 ms UI transitions;
- camera moves 800–1600 ms;
- avoid long cinematic lockouts.

Guided tour may use more deliberate camera motion.

## 8. Loading

Show an engineering-style loader:

```text
Loading project world…
Geometry
Scenarios
Video index
Result fields
```

Do not display fake GPU initialization.

## 9. Empty/error states

Examples:

> Wind field unavailable. The rest of the digital twin is still interactive.

> Video demo asset could not be loaded. Reload or continue with another mode.

## 10. Screenshotability

Every mode should produce at least one visually strong frame suitable for:
- blog header;
- social post;
- thumbnail;
- short video.

Avoid UI clutter that makes screenshots unreadable.
