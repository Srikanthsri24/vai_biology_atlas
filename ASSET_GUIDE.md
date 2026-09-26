# Anatomy assets and extension guide

## Exact production asset slots

No licensed medical-quality meshes are bundled. All 43 currently installed GLBs are explicitly schematic development assets in `public/models/placeholders/`. Put authored assets into these production slots; the loader checks them first. Keep license/attribution files with purchased or downloaded assets.

| Model ID | Required production GLB |
| --- | --- |
| body | `public/models/production/body/full-body.glb` |
| male | `public/models/production/body/male-body.glb` |
| female | `public/models/production/body/female-body.glb` |
| brain | `public/models/production/organs/brain.glb` |
| heart | `public/models/production/organs/heart.glb` |
| hand | `public/models/production/regions/hand.glb` |
| leg | `public/models/production/regions/leg.glb` |
| lungs | `public/models/production/organs/lungs.glb` |
| liver | `public/models/production/organs/liver.glb` |
| kidneys | `public/models/production/organs/kidney.glb` |
| stomach | `public/models/production/organs/stomach.glb` |
| pancreas | `public/models/production/organs/pancreas.glb` |
| spleen | `public/models/production/organs/spleen.glb` |
| intestines | `public/models/production/organs/intestines.glb` |
| eye | `public/models/production/organs/eye.glb` |
| ear | `public/models/production/organs/ear.glb` |
| bladder | `public/models/production/organs/bladder.glb` |
| head | `public/models/production/regions/head.glb` |
| skull | `public/models/production/regions/skull.glb` |
| foot | `public/models/production/regions/foot.glb` |
| spine | `public/models/production/regions/spine.glb` |
| skin | `public/models/production/regions/skin.glb` |
| gallbladder | `public/models/production/organs/gallbladder.glb` |
| thyroid | `public/models/production/organs/thyroid.glb` |
| small-intestine | `public/models/production/organs/small-intestine.glb` |
| large-intestine | `public/models/production/organs/large-intestine.glb` |
| neuron | `public/models/production/micro/neuron.glb` |
| alveolus | `public/models/production/micro/alveolus.glb` |
| capillary | `public/models/production/micro/capillary.glb` |
| nephron | `public/models/production/micro/nephron.glb` |
| integumentary-system | `public/models/production/systems/integumentary.glb` |
| skeletal-body | `public/models/production/systems/skeletal.glb` |
| muscular-body | `public/models/production/systems/muscular.glb` |
| nervous-system | `public/models/production/systems/nervous.glb` |
| endocrine-system | `public/models/production/systems/endocrine.glb` |
| cardiovascular-system | `public/models/production/systems/cardiovascular.glb` |
| lymphatic-system | `public/models/production/systems/lymphatic.glb` |
| immune-system | `public/models/production/systems/immune.glb` |
| respiratory-system | `public/models/production/systems/respiratory.glb` |
| digestive-system | `public/models/production/systems/digestive.glb` |
| urinary-system | `public/models/production/systems/urinary.glb` |
| male-reproductive | `public/models/production/systems/male-reproductive.glb` |
| female-reproductive | `public/models/production/systems/female-reproductive.glb` |

`.gltf` with the same basename is supported too. Put external `.bin` buffers and textures alongside it using the relative paths declared in the file. Use GLB for simple self-contained installation. The original seven `/models/<id>/<id>.glb` paths are still accepted for compatibility.

The registry is `src/data/modelRegistry.ts`. No component needs to change when replacing a development preview. Add the medical file, then reload (or turn the developer fallback off and use **Check for model**). A full-page reload clears browser memory caches. Keep model licensing and attribution supplied by your asset vendor with the files.

## Mesh naming and mapping

Each independently selectable anatomical part must be a separate mesh or named ancestor group. Mesh names are case-sensitive. Mapping order in `src/utils/meshMapping.ts`:

1. glTF extras `anatomyId` matching an existing metadata ID.
2. `modelObjectName` or one of `meshNames` on that metadata record.
3. Repeat these checks on ancestor groups.
4. Unmatched meshes map to the atlas root and produce a developer console warning.

Examples already mapped:

```text
muscle_biceps_brachii_left  -> biceps-brachii-left
muscle_biceps_brachii_right -> biceps-brachii-right
muscle_deltoid_left        -> deltoid-left
bone_femur_left            -> femur
bone_femur_right           -> right-femur
bone_humerus_left          -> humerus-left
organ_heart               -> heart
organ_left_lung           -> left-lung
organ_right_lung          -> right-lung
organ_liver               -> liver
```

Do not infer names from this convention when existing IDs differ: consult `public/models/anatomy-manifest.json`, which exports every exact metadata ID and mesh alias. Multiple meshes may map to one structure. Do not merge muscles into one mesh if they need separate selection, peeling, opacity, or explosion. Material groups within one mesh are not separately selectable anatomy.

## Coordinate and material contract

Use +X for the subject's left, +Y superior, and +Z anterior. Author related layers in a common coordinate frame. `gltfTransform` in the registry corrects imported orientation/scale/position. Imported models are centered and normalized by their largest bounding-box dimension to `targetHeight`; camera framing then fits actual world-space mesh bounds and viewport aspect ratio.

PBR base color, normals, roughness, metallic, occlusion, alpha and supported glTF material extensions are retained. Selection applies a restrained tint. Opacity changes preserve imported alpha-blend settings. Draco and KTX2 decoders are served locally from `public/draco` and `public/basis`; Meshopt is imported with the loader. GPU support determines KTX2 transcoding. Add an optional `progressiveUrl` to a model for a coarser initial asset before the main file. Both should have matching coordinates and mesh IDs.

## Add a muscle

Add a record to `src/data/muscleCatalog.ts`: unique slug, name, one of the existing muscle region keys, depth (`superficial`, `intermediate`, `deep`), description, functions, optional source-backed origin/insertion/innervation and related slugs. `position`/`size` are only development geometry anchors. `src/data/muscleData.ts` generates left and right records and their `muscle_<slug>_<side>` names. Include both separately named meshes in the muscular GLB. Run tests, then `pnpm assets:dev` if updating schematic previews.

For unilateral or unusual structures, add an explicit `AnatomyNode` rather than using bilateral generation. Never invent attachment or nerve details to fill a blank field.

## Add an organ

Add a metadata node in `src/data/extendedAnatomy.ts` (or a separate data module called from `anatomyTree.ts`). Set its ID, name, parent, `type:'organ'`, layer, system, description, location, functions, mesh aliases, camera metadata and explosion direction. Ensure the parent lists the child. Add a `ModelConfig` in `modelRegistry.ts` with a unique ID, root metadata ID, URLs, category, transform and targetHeight. Add its ID to any appropriate system's `structures`. A dedicated route `/atlas/<model-id>` and searchable metadata then work without new pages.

## Add a body system

Add a `BodySystem` record to `systems` in `modelRegistry.ts`: unique ID/modelId, name, description, icon, filter group, layer and structure roots. The existing loop creates its model configuration and `/systems/<id>` route. For cross-system structures use metadata `systems: ['endocrine','digestive']`. Extend `belongsToSystem` only when membership requires new layer logic. Add new layers to the `LayerId` union and `layers` configuration; visibility/opacity controls derive from that configuration.

## Add hierarchy levels

Each record has one spatial parent and a `children` list. Group nodes can have `type:'region'` or `type:'system'`; they do not need meshes. Their bounds are the union of their descendants. Update both parent/child links and keep the graph acyclic. Tree expansion, breadcrumbs, focus, inherited visibility, and search derive from this data. `pnpm test` detects dangling references and cycles.

## Configure explosion and zoom

- `AnatomyNode.explodeDirection`: directional vector for individual structures/organ assemblies.
- `layers[].direction`: controlled world-space displacements for a full-body exploded view.
- `src/utils/explosion.ts`: muscle displacement policy (skeleton remains fixed) and selected-organ handling.
- Slider values are 0–1; renderers interpolate to displaced positions and back to their saved original transforms. Never alter imported source geometry to create an explosion.
- `src/config/education.ts` contains the six `ANATOMY_ZOOM` semantic thresholds. `src/config/viewer.ts` retains four broad opacity/navigation bands and six camera presets. Distances are normalized against model bounds. `AnatomyLabels.tsx` handles occlusion and collision culling. Tune clinical labels after inspecting the actual asset.

## Development assets

`scripts/generate-development-models.ts` exports real, self-contained GLB files from `developmentParts.ts` and `proceduralParts.ts`. Their glTF extras mark them as development geometry, and a CC0 license accompanies them. All 43 current modules use these files until production assets are provided. A model being a valid GLB does **not** make it anatomically accurate. The reproductive, endocrine, skin, and several organ previews in particular contain simple markers rather than authored organ surfaces.


## School metadata and validation

Run `pnpm validate` after importing assets. It writes `public/models/asset-report.json` with mesh counts, mapped/unmapped mesh names, missing expected leaf structures, named muscle counts and canonical bone counts. The sidebar displays the loaded asset's audit. Missing expected entries are coverage gaps, not necessarily loader failures: some are grouping concepts or separate microscopic modules. The validator does not certify medical accuracy, topology, textures, or licenses.

Every node supports `type`, `region`, `side`, `depth`, `labelAnchor`, `labelNormal`, `explorationRegion`, `maxExplodeDistance`, `sourceRefs`, `reviewed`, and `curriculumLevel`. Leave unknown facts unset. `reviewed:false` explicitly means the content has not received clinical/editorial sign-off.

`labelAnchor` is an offset from the structure bounding-box center expressed in fractions of its box dimensions; [0,0,0] uses the center. `labelNormal` is a world-space facing hint. Tune both on actual imported surfaces.

## Add another bone or nerve

Add an AnatomyNode in a dedicated data module called from `anatomyTree.ts`, or extend `schoolAnatomy.ts`. Use a stable unique ID, correct parent and child links, `type:'bone',layer:'skeleton'` or `type:'nerve',layer:'nervous'`, exact aliases, source references and educational metadata. Add each independently selectable mesh to the appropriate production GLB.

The conventional 206-bone list is `canonicalBoneIds`. Set `canonicalBone:true` only for the designated individual count record; do not count duplicate group meshes or accessories again. Existing femur IDs are `femur` and `right-femur`; aliases allow `bone_femur_left` and `bone_femur_right`. For nerves, `cranial-i` through `cranial-xii` represent named pairs, not 24 separate left/right meshes; spinal records likewise represent 31 pairs. Add left/right children if your asset provides them.

## Automatic regional muscle separation

`useSemanticZoom.ts` samples camera distance to OrbitControls target at roughly 8 Hz, normalized by loaded model bounding-box diagonal / 6.5. Thresholds are 8, 6, 4, 2, 0.8 and 0 for body, region, system, structure, substructure and microscopic concept levels. Smoothstep blends separation from 0 to 30%. A selected muscle determines the active region; otherwise nearby visible muscles near the camera target determine it. Only matching `explorationRegion` muscles separate automatically.

`explosionOffset` uses the greater of the manual slider and automatic amount, then multiplies by normalized `explodeDirection`, `maxExplodeDistance`, model scale and depth weight (1 superficial, 0.65 intermediate, 0.35 deep). The skeleton stays fixed in muscular mode. Rendered transforms interpolate back to the saved base positions. Assemble Body disables automatic separation; Auto separate on enables it again.

## Multi-resolution integration

`lod` reserves preview/body/region/structure/micro asset slots. `progressiveUrl` optionally loads a coarse asset before the main asset. `DetailLOD` can load a separate real organ/region asset when exploring that selected structure closely in a body-root viewer. It fits that asset to the parent's existing bounds, applies `parentAnchor.position/rotation/scale`, and crossfades the coarse structure after decoding. It retains outgoing geometry briefly while fading back. No production detail assets are installed, so exact anatomical alignment and authored-asset transitions require integration testing. This is not an arbitrary five-level mesh streaming engine.

Microscopic concepts currently open explicit dedicated routes. Neuron is a schematic assembly; alveolus/capillary/nephron are simple markers awaiting detailed authored assets. They are not silently enlarged body meshes.
