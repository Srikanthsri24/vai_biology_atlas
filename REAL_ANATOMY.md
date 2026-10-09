# Detailed anatomy upgrade

The existing React app now bundles real surface meshes from Z-Anatomy, BodyParts3D, Vanatome and BodyExplorer. Attribution, licenses, limitations and pinned source hashes are in `public/models/open-anatomy/credits.html` and `provenance.json`.

## Run

`pnpm install`, then `pnpm dev`. Verify with `pnpm test` and `pnpm build:pages`.

## Reproduce assets

Run `node scripts/run-ts.mjs scripts/import-anatomy.ts`. The script downloads pinned revisions into `.cache/open-anatomy`, registers the source coordinates, writes module GLBs and generates the two JSON registries. It does not execute downloaded code. The binary assets are committed, so deployment does not require this import step.

Generated metadata uses a `real-` namespace for additional structures. Existing known anatomy IDs retain their curated educational text. Each mesh stores `extras.anatomyId`, which `meshMapping.ts` connects to the metadata for picking, labels, focus, isolation, transparency and separation. Additional source structures have identification and spatial context; they do not have invented physiological descriptions.

`openModels.generated.json` registers installed files centrally. The existing `/models/production/` slots remain available for replacement GLB/glTF assets. Edit the URL priority in `modelRegistry.ts` if a commissioned model should override a bundled open model. Keep each mesh's `extras.anatomyId` or use metadata `meshNames` aliases. Add hierarchy nodes with unique IDs, a valid parent, reciprocal child entries, layers and source metadata. `explodeDirection` and `maxExplodeDistance` control displacement; zoom thresholds remain in `src/config/viewer.ts`.

The body, muscles, skeleton, head, brain, heart, lungs, digestive organs, glands and male reproductive anatomy use detailed meshes. Female-specific, kidney/urinary, eye/ear, skin cross-section and microscopic modules still use schematic fallbacks. Whole nervous and cardiovascular networks are not complete. These surface datasets do not contain photographic tissue textures or a biomechanical rig; the result is a detailed educational atlas, not a photorealistic or clinically validated complete body.

All adapted assets and generated anatomy metadata remain CC BY-SA 4.0. Do not remove upstream notices or apply the app code license to these assets.
