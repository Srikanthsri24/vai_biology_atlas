# Biology and virtual laboratories

The existing React atlas now includes 332 lessons: Classes 1–8 have 27 each, Classes 9–12 have 29 each. `/biology` supports subject/class filters, search and pagination. Original 32 lessons and their URLs are preserved.

This is a combined topic inventory intended for CBSE/NCERT, ICSE/ISC, Andhra Pradesh and enrichment. It is not a certified exhaustive syllabus. Current board/year chapter-by-chapter reconciliation remains pending. The coverage disclosure is visible on the learning map. Lessons include concise explanations and study activities; shared 3D comparison scenes do not represent every topic literally.

## Laboratories

`/labs` offers 104 distinct protocols, using 13 shared apparatus/response families: photosynthesis, osmosis, enzymes, inheritance, microscopy, chromatography, diffusion, germination, respiration, transpiration, water indicators, gel electrophoresis and ecology. Search, category/class filters and pagination keep the catalog manageable. These are not 104 unique calibrated simulators.

`LabEquipment.tsx` supplies authored 3D glassware, microscope, pipette, balance, lamp, racks, dishes and plants. `LabViewer.tsx` assembles the family scenes using React Three Fiber, controlled lighting and orbit/pan/zoom. Microscopy has an eyepiece view. Real experimental measurements and licensed photoreal equipment models are not included. Models use qualitative teaching rules and declared units/limitations.

Each protocol has a question, variable, principle and four procedure steps. Complete the first two to enable trial recording. Controls alter visible samples and model responses. Play/pause controls illustrative animation. Notebooks retain the last 20 trials during the visit; export CSV before navigating away. No backend or persistent student records are used.

## Extend

Add topic/concept pairs to `src/data/curriculumExpansion.ts` or curated lessons to `src/data/biology.ts`. Add protocols to `src/data/labCatalog.ts`. For a new apparatus family update the LabEngine type, `labControls.ts`, `labResponse` in `virtualLabs.ts`, and the setup in `LabViewer.tsx`. Keep model assumptions explicit. Avoid using generic relative-response engines to claim actual quantitative experiments.

## Run and verify

Install dependencies with npm install, then npm run dev. `node scripts/run-ts.mjs tests/atlas.test.ts` checks catalog uniqueness, per-class counts, all response families and existing atlas regressions. `node node_modules/typescript/bin/tsc -b` checks types. `node scripts/build-pages.mjs` builds the GitHub Pages deployment.

## Curriculum editorial provenance

Official documents checked during expansion include CBSE Curriculum 2026–27 (cbseacademic.nic.in/curriculum_2027.html) and CISCE ISC Biology 2027 (cisce.org/wp-content/uploads/2025/02/20.-ISC-Biology.pdf). This preliminary review is not complete board alignment. Andhra Pradesh textbook/version mapping and junior class board differences still require editorial audit. Public lesson panels contain no outbound reading links.
