# Living Organs upgrade

Open `/living`, or choose **Living organs** inside any atlas. Each lesson opens an existing 3D atlas with `?simulation=<id>`. Press Play, choose 0.25–2× playback, scrub the cycle, or select an explained stage. The simulation starts paused, including for users who prefer reduced motion. Background tabs do not advance the simulation.

## Delivered

- Seven lessons: heartbeat, ventilation, kidney processing, digestion, neural signalling, muscle contraction and circulation.
- Actual Three.js mesh scaling for chambers, lungs, diaphragm, digestive organs and left biceps. Scaling preserves each mesh's centre and is reset on exit. The cached GLB is never mutated.
- Directional particle overlays use the loaded scene's anatomical mesh bounds. Kidney processing uses an explicitly labelled conceptual loop because no nephron microanatomy is supplied.
- Four explained stages per lesson, source links to OpenStax, play/pause, reset, speed, timeline and marker visibility.
- Existing selection, anatomy tree, isolation, opacity, exploded assembly, clipping planes and labels remain available. Study tools collapse while a living lesson is open to leave more room for the model.
- Navigation retains simulation query parameters when selecting a structure. The landing page and global navigation link to the new lab.
- Heart schematic export excludes incorrectly included long systemic vessels so the dedicated organ is framed properly.

## Scope and asset quality

The 43 bundled GLBs remain schematic development models, not ultra-realistic or clinically validated anatomy. No licensed high-resolution assets have been acquired. The seven lessons are visual educational simulations, not patient-specific physiological models. Flow overlays connect mesh centres, not authored vessel lumens. Deformation is conceptual rather than bone-rigged biomechanics. Cross-section surfaces are open and uncapped; flow markers are hidden in that mode. Endocrine, lymphatic, reproductive and the other existing systems remain structural atlases, without new functional simulations in this release.

For medical realism, supply appropriately licensed segmented GLB/glTF assets in the production slots documented in ASSET_GUIDE.md. Existing mesh-to-metadata mapping also drives the new deformations and marker anchors. Heart valves, diaphragm translation, true peristaltic waves, ion-channel kinetics and fluid-pressure solvers would need additional authored geometry/rigging or numerical models.

## Files and extension points

| File | Purpose |
| --- | --- |
| `src/data/simulations.ts` | Lesson routes, stages, duration, sources, mesh identities and deformation rules |
| `src/store/simulationStore.ts` | Playback, bounded speed, timeline and shared animation clock |
| `src/components/atlas/SimulationScene.tsx` | Real-time flow overlays and clock update; UI progress updates at 10 Hz |
| `src/components/controls/SimulationControls.tsx` | Lesson selection, playback and accessible explanatory panel |
| `src/components/atlas/GLTFAnatomy.tsx` | Per-instance, centre-preserving mesh deformation |
| `src/pages/LivingOrgans.tsx` | Discoverable functional lab with interactive GLB previews |
| `src/styles/living.css` | Responsive light/dark layouts |

Add a lesson definition and its `SimulationId`, valid atlas route, focus/route anatomy IDs, duration, four teaching stages and a source. Add optional mesh deformation in `motionScale`. Supply authored motion clips through a separate adapter if quantitative or rigged animation is needed; do not label these illustrative scale transforms as physical simulation.

## Validation

`node scripts/run-ts.mjs tests/atlas.test.ts` checks 20 regressions, including lesson routes and metadata, pause-on-scrub, invalid input bounds, cyclic scale limits and untouched unrelated anatomy. `node scripts/build-pages.mjs` runs TypeScript and builds for the GitHub Pages repository path. Browser checks cover 3D rendering, playback, stage selection, speed, clipping and mobile explanations.
