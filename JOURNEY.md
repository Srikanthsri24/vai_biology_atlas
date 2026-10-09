# Journey Inside the Human Body

Open `/journey/body`. Deep links accept `body`, `organ`, `tissue`, `cell`, `organelle`, `dna` and `molecule`. Use `?path=blood`, `neuron`, `respiratory`, `renal`, `digestive` or `muscle` for the six guided routes. The default is circulation. Microscopic labs are deep-linked with `&study=division`, for example `/journey/cell?path=blood&study=division`. GitHub Pages retains the repository base path through React Router.

The main navigation and home page provide entry points. Scroll over the viewer with **Scale zoom** enabled, drag the scale slider or choose a numbered scale. Turn Scale zoom off to zoom the camera within the current scene. Drag to orbit; use the right mouse button to pan. Arrow keys move between scales; Space plays or pauses when focus is outside a UI control.

At tissue scale, the route-specific travel button follows a vessel, axon or renal tubule, approaches an alveolus or villus, or moves across a sarcomere. Play animates travel; the route slider allows manual positioning. Restart resets the clock and travel position. The floating play button remains available in the 3D view on mobile. Structures can be selected with labels, meshes or the information panel, then focused, isolated or hidden. Show all restores visibility. Transparency, section cuts, assembly separation, front/side presets, fullscreen and PNG capture work locally without a backend.

## Scientific scope

The body and available organ surfaces load installed anatomical GLBs through the existing cached, compression-compatible asset loader. Unavailable organ surfaces use labelled development geometry. Tissues, cells, organelles, DNA and molecules are **procedural teaching models**. These scenes illustrate concepts and are not scanned histology, physically continuous zoom through one person, a physiological solver or a molecular dynamics calculation. Section mode clips surfaces without reconstructing tissue at the cut.

The blood route enters a **nucleated vessel-wall cell**, not a mature human red blood cell. Neural markers indicate electrical signal propagation, not a particle travelling along the axon. DNA colors do not encode a real gene sequence. Each scale includes original concise explanations inside the platform. The public journey does not display outbound reading or atlas-reference links. Internal editorial provenance and mandatory third-party asset license credits remain intact.

## Files and extension points

- `src/data/journey.ts`: ordered scales, URL identifiers, explanations, process steps, source links, selectable metadata and bounded travel camera coordinates.
- `src/pages/Journey.tsx`: URL state, viewer controls, playback and accessible explanatory interface.
- `src/components/journey/JourneyCanvas.tsx`: cached anatomical assets, smooth scale blending, camera interpolation, scene lifecycle and rendering error boundary.
- `src/components/journey/JourneyPrimitives.tsx`: reusable selection groups, controlled explosion offsets, material transparency/clipping and teaching markers.
- `src/components/journey/MicroScenes.tsx`: vessel, neuron, generalized cell, nucleus/mitochondrion, DNA/RNA and water assemblies.
- `src/styles/journey.css`: responsive viewer, explanations and presentation layout.
- `tests/atlas.test.ts`: scale/deep-link metadata integrity and bounded, continuous travel positions, alongside existing atlas tests.

Add a scale in the ordered data registry, update the defaults and scene dispatch, and raise the maximum scale in `clampDepth` and the slider. Add new selectable structures to `journeyParts` and `journeySelectable`. A `Part` accepts an assembled `position` and a directional `offset`; explosion interpolates towards `position + offset × amount`. Scene crossfades use the distance from the continuous scale coordinate. New anatomical GLBs belong in the existing model registry; microscopic assets can replace procedural scene components while keeping this interface.

Run `npm run dev`, `npm test`, and `npm run build:pages` using the same project setup as the atlas.

## Expanded release

Six routes provide six different functional tissue assemblies: circulation, neural signalling, respiratory exchange, nephron filtration, intestinal absorption and sarcomere contraction.

Sixteen microscopic labs: cellular architecture/transport, translation, division; mitochondrion, nucleus, ER, Golgi, lysosome, ribosome; transcription, replication, chromatin packaging; water, oxygen, carbon dioxide, glucose. A scrub-able process timeline and a route-specific knowledge check support self-guided learning. Knowledge-check responses remain in local component state and are not collected.

- `src/data/journeyCatalog.ts`: route content, model choices, labs, selectable structures and quiz definitions.
- `src/data/journeyMolecules.ts`: ball-and-stick atomic graphs and bond orders, validated for composition and valence.
- `src/data/journeyTravel.ts`: bounded route-specific camera paths, sharing the nephron curve with its scene.
- `src/components/journey/TissueLabs.tsx`: alveolus, nephron, villus and sarcomere assemblies.
- `src/components/journey/CellularLabs.tsx`: organelle labs, translation, division, replication, nucleosomes and molecular models.
- `src/components/journey/JourneyLesson.tsx`: in-platform lessons and knowledge checks.

To add a route, extend the path type and route registry, provide its tissue component and camera path, then run the catalog, model, molecular and travel tests. To add a microscopic lab, extend the level's study array and scene dispatch. Study IDs are stable URL parameters. Keep explanations honest about procedural teaching geometry and preserve mandatory asset attribution in the license notices.
