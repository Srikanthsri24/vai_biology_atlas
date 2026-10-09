<!-- Current implementation details: SCHOOL_PASS_REPORT.md -->
# Human Atlas

Human Atlas Powered By VisionariesAI Labs Private Limited · Explore the Human Body in 3D.

An existing React / Vite / TypeScript anatomy application, upgraded in place. The interface, typography, home-page composition, and routes have been retained while the model pipeline, anatomy catalog, and viewer controls have been extended.

## Start locally

Use Node 22.12+ (or Node 24) and pnpm 11:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:5173. The existing preview uses http://127.0.0.1:5173.

```sh
pnpm test       # hierarchy, GLB parsing, mapping, visibility, state, camera geometry
pnpm build      # TypeScript check and optimized Vite output
pnpm preview    # serve dist locally
pnpm validate   # asset coverage and metadata integrity report
pnpm assets:dev # regenerate the schematic development GLBs and mesh manifest
```

Serve `dist` with SPA fallback to `index.html` so deep links work. There is no backend or account service.

## Why models now load without licensed assets

43 actual **development GLB files** are bundled under `public/models/placeholders/`. The default development-preview setting loads these when the corresponding medical asset is absent. All preview scenes and viewers identify them as development anatomy. This resolves the empty asset panels without presenting schematic geometry as realistic anatomy.

These files are generated, CC0 schematic geometry for interaction testing. They are **not medical-quality or clinically validated anatomy**. Some structures are simple spatial markers; external male/female previews share a neutral schematic form. No high-quality licensed medical GLBs were supplied or downloaded. Real anatomical realism still requires authored anatomy assets.

Real assets in the configured production slots take priority automatically. See [ASSET_GUIDE.md](ASSET_GUIDE.md) for every exact filename, mesh names, and extension instructions. To start with development previews disabled, put `VITE_DEVELOPMENT_MODE=false` in `.env.local` and restart/rebuild. The viewer also has a developer-fallback toggle.

## Main features

- Home, searchable anatomy library, all 13 body systems, 43 model registry entries.
- 40 named muscle types on both sides (80 bilateral named muscle/group records), three muscle depths, regional hierarchy, bone/organ/nerve/vessel catalog.
- Mesh and tree selection, breadcrumbs, related structures, global search, focused deep links.
- Orbit, pan, zoom, smooth bounding-box camera fit, six view presets, responsive browser fullscreen.
- Per-layer visibility/opacity/isolation, selected-structure transparency, X-ray, peel history and undo.
- Controlled explosion/assembly; skeleton remains the reference in muscular explosion.
- Smart / all-visible / off leader labels; camera visibility checks and overlap suppression.
- PNG export of the model and current labels, light/dark viewer backgrounds, Learn Mode.
- GLTFLoader, Draco, Meshopt, KTX2, PBR textures, lazy previews, asset caching, adaptive DPR, optional progressive assets.

## Source structure

| Folder | Responsibility |
| --- | --- |
| `src/config` | Reusable branding, zoom thresholds and orientation presets |
| `src/data` | Anatomy metadata, hierarchy, muscles, models, systems, development geometry |
| `src/store` | Shared selection, visibility, peel history and camera commands |
| `src/hooks` | Asset loading, smooth camera controls and optional page tools |
| `src/utils` | Mesh mapping, bounds/frustum math, system visibility and explosion vectors |
| `src/components/atlas` | Canvas, scene registry, meshes, labels, tree, search and preview cards |
| `src/components/controls` | Layers, explosion slider and six-direction orientation controls |
| `src/components/layout` | Header, sidebars, information templates and viewer toolbar |
| `src/pages` | Home, Atlas, Library, Systems, About and 404 |
| `src/styles` | Existing visual language and responsive viewer improvements |
| `scripts` / `tests` | Repeatable development asset generation and regression checks |
| `public/models` | Separate production slots, development GLBs and exported mapping manifest |

## Controls

Left-drag rotates, wheel zooms, right-drag pans. Click selects; double-click focuses. Select tool leaves the camera in place. Peel tool removes the clicked structure. `R` resets, `F` fits the selection, `E` assembles/explodes, `L` toggles labels, and `Ctrl/Cmd K` searches. Browser Escape exits fullscreen. UI controls are keyboard accessible.

## Current limits

The catalog is an expandable educational sample, not a complete clinical dataset. Missing authored details explicitly say they are coming soon. Clipping produces open surfaces without caps. Explosion is an educational separation, not a surgical dissection. Cross-asset navigation loads another model; continuous camera/fading transitions operate within the current model. Schematic flow order and guided pathways are implemented; anatomically authored vascular paths and quizzes remain future work. Million-polygon clinical datasets and compressed texture variants need performance validation with the actual supplied files.

See [UPGRADE_REPORT.md](UPGRADE_REPORT.md) for the requested implementation summary and verification record.


## School laboratory upgrade

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` tests, builds and deploys `main` to GitHub Pages. Select **GitHub Actions** under repository **Settings → Pages → Source**. The Pages build uses Node 24 and `pnpm build:pages`, including the `/vai_biology_atlas/` base path and a 404 redirect for direct anatomy links. Model files, decoders and logos use the same deployment prefix. Regular `pnpm build` keeps the root-path configuration for other hosts.

## School laboratory upgrade details

See [SCHOOL_PASS_REPORT.md](SCHOOL_PASS_REPORT.md) for the current 20-point delivery report, exact mapped counts, feature limitations and verification. New controls include regional semantic zoom, learning levels, guided paths, classroom presentation, body facts, structures filtering, Back view history, and explicit microscopic concepts.


## Living Organs

Open `/living` for seven interactive 3D physiology lessons with playback, scrubbing, speed controls and sourced explanations. See [LIVING_ORGANS.md](LIVING_ORGANS.md) for implementation, asset quality and simulation limits.
