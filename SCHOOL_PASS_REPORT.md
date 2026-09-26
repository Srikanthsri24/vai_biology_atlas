# Human Atlas — school laboratory development pass

Continued the existing application in place. No high-resolution licensed medical model was supplied or installed. A valid GLB file and anatomically realistic geometry are different things: all 43 bundled GLBs contain schematic test geometry.

## 1. Completed

- Working local GLB fallback for all 43 registered modules, including both reproductive systems; production-first loading, retry and honest development labels.
- Bbox-based camera framing, orbit/pan/zoom, smooth focus, tree/search/deep links, hide/peel/undo, layer opacity, isolation, manual explode/assemble, camera presets, screenshot capture and browser-fullscreen controls.
- Regional automatic muscular separation with staged intermediate/deep layers, smart labels, learning levels, selection-history Back, Assemble Body and Back to Body.
- A conventional 206-bone catalog; 80 bilateral named muscle/group entries; joints/tendons/ligaments; 12 named cranial nerve pairs and 31 spinal nerve pair records.
- Structures library with text, type, system, region and alphabet filtering; body-map navigation; centralized qualified body facts.
- Guided muscle/skeleton/heart/respiratory/digestive paths; classroom mode; biceps attachment markers and separate movement diagram; schematic blood-flow order; neuron and microscopic module routes.
- Three clipping-plane orientations; data/mesh validation; optional registered detail-asset crossfade architecture.

## 2. Incomplete / asset-dependent

Realistic medical surfaces, complete 600+ muscle anatomy, precise bone landmarks and origin/insertion surfaces, rigged 3D muscle contraction, authored vessel-path flow, detailed alveolar/nephron/capillary models, comprehensive microscopic streaming and medical editorial review remain incomplete. Male/female external development models share a neutral schematic form. Attachment markers identify associated bone regions. The biceps action is an SVG teaching diagram, not deformation of a medical GLB. Flow dots follow an illustrative chamber/organ sequence, not vascular geometry. Cross sections are uncapped clipping planes. No backend, quiz, bookmark persistence, comparison or split-view workflow is implemented. Performance with million-polygon licensed assets has not been established.

## 3–4. Modified and created files

Existing files modified: `src/App.tsx`, `src/pages/{Home,Atlas,Library,Systems,About}.tsx`, `src/components/layout/{Header,Sidebar,RightPanel,ViewerToolbar}.tsx`, `src/components/atlas/{AnatomyViewer,AnatomyModel,GLTFAnatomy,AnatomyLabels,AnatomyTree,ModelPreview,SearchDialog}.tsx`, `src/data/{types,anatomyTree,modelRegistry,muscleData,developmentParts}.ts`, `src/config/viewer.ts`, `src/hooks/{useCameraFocus,useModelAsset}.tsx/ts`, `src/utils/{visibility,explosion}.ts`, `src/store/atlasStore.ts`, styles, package scripts, asset generator, tests and documentation.

New school-pass files: `src/config/education.ts`; `src/data/{schoolAnatomy,bodyFacts,lessons}.ts`; `src/hooks/useSemanticZoom.ts`; `src/utils/{semantic,validation}.ts`; `src/components/controls/SchoolControls.tsx`; `src/components/atlas/{BodyFacts,BodyNavigator,AttachmentMarkers,MovementLesson,EducationalFlow,DevelopmentPlaceholderModel,DetailLOD,AssetAudit,SkeletonDivisions}.tsx`; `src/styles/school.css`; `scripts/validate-assets.ts`; `public/models/placeholders/*.glb` (43); production-slot READMEs, generated asset report and this report. Earlier upgrade modules include muscle catalogs, SceneRegistry, mesh mapping, camera fitting and orientation controls. The workspace has no Git baseline, so this is a functional change inventory, not a reconstructed Git diff.

## 5. Progressive muscle separation

Only muscles in the active anatomical region separate automatically. Camera distance smoothly blends 0–30% separation. Depth weights preserve superficial/intermediate/deep relationships; the skeleton stays fixed. The manual slider can override that amount. Assemble Body disables the automatic effect and interpolates back to original positions. Back to Body resets the model and glides the camera outward. See the algorithm and editable values in [ASSET_GUIDE.md](ASSET_GUIDE.md).

## 6. Zoom calculation

Camera-to-orbit-target distance is divided by model diagonal / 6.5. Semantic thresholds in `config/education.ts` are 8 / 6 / 4 / 2 / 0.8 / 0. Smoothstep controls separation between thresholds. Legacy four-band opacity controls remain in `config/viewer.ts`; dedicated microscopic routes are explicit.

## 7. Label prioritization

Selected structure, selected descendants, active region, then proximity. Candidates outside the camera frustum or facing away are culled. Opaque foreground meshes can occlude close-up labels. Basic/Standard/Advanced cap labels at 3/6/10 respectively, with additional zoom limits. Catalog counts do not imply all labels appear at once.

## 8. Collision handling

Labels use left/right screen columns with vertical occupancy checks, viewport margins and 34px spacing (48px in classroom mode). Candidates without free space are omitted. Leader lines anchor to projected structure bounds plus optional metadata offsets. Leader lines may cross; actual anatomical anchor tuning requires the production assets.

## 9. Actual mapped muscle entries

Each entry below has independent left/right metadata and mapped schematic geometry. Group names are explicitly groups; this is not a claim of 80 medically distinct individual muscles.

| Name | Left metadata ID | Expected left mesh alias (right uses right suffix) |
| --- | --- | --- |
| Frontalis | `frontalis-left` | `muscle_frontalis_left` |
| Temporalis | `temporalis-left` | `muscle_temporalis_left` |
| Masseter | `masseter-left` | `muscle_masseter_left` |
| Sternocleidomastoid | `sternocleidomastoid-left` | `muscle_sternocleidomastoid_left` |
| Trapezius | `trapezius-left` | `muscle_trapezius_left` |
| Deltoid | `deltoid-left` | `muscle_deltoid_left` |
| Supraspinatus | `supraspinatus-left` | `muscle_supraspinatus_left` |
| Infraspinatus | `infraspinatus-left` | `muscle_infraspinatus_left` |
| Teres major | `teres-major-left` | `muscle_teres_major_left` |
| Teres minor | `teres-minor-left` | `muscle_teres_minor_left` |
| Pectoralis major | `pectoralis-major-left` | `muscle_pectoralis_major_left` |
| Pectoralis minor | `pectoralis-minor-left` | `muscle_pectoralis_minor_left` |
| Serratus anterior | `serratus-anterior-left` | `muscle_serratus_anterior_left` |
| Latissimus dorsi | `latissimus-dorsi-left` | `muscle_latissimus_dorsi_left` |
| Rhomboids | `rhomboids-left` | `muscle_rhomboids_left` |
| Erector spinae | `erector-spinae-left` | `muscle_erector_spinae_left` |
| Biceps brachii | `biceps-brachii-left` | `muscle_biceps_brachii_left` |
| Brachialis | `brachialis-left` | `muscle_brachialis_left` |
| Triceps brachii | `triceps-brachii-left` | `muscle_triceps_brachii_left` |
| Forearm flexor group | `forearm-flexors-left` | `muscle_forearm_flexors_left` |
| Forearm extensor group | `forearm-extensors-left` | `muscle_forearm_extensors_left` |
| Rectus abdominis | `rectus-abdominis-left` | `muscle_rectus_abdominis_left` |
| External oblique | `external-oblique-left` | `muscle_external_oblique_left` |
| Internal oblique | `internal-oblique-left` | `muscle_internal_oblique_left` |
| Transversus abdominis | `transversus-abdominis-left` | `muscle_transversus_abdominis_left` |
| Gluteus maximus | `gluteus-maximus-left` | `muscle_gluteus_maximus_left` |
| Gluteus medius | `gluteus-medius-left` | `muscle_gluteus_medius_left` |
| Gluteus minimus | `gluteus-minimus-left` | `muscle_gluteus_minimus_left` |
| Rectus femoris | `rectus-femoris-left` | `muscle_rectus_femoris_left` |
| Vastus lateralis | `vastus-lateralis-left` | `muscle_vastus_lateralis_left` |
| Vastus medialis | `vastus-medialis-left` | `muscle_vastus_medialis_left` |
| Vastus intermedius | `vastus-intermedius-left` | `muscle_vastus_intermedius_left` |
| Sartorius | `sartorius-left` | `muscle_sartorius_left` |
| Biceps femoris | `biceps-femoris-left` | `muscle_biceps_femoris_left` |
| Semitendinosus | `semitendinosus-left` | `muscle_semitendinosus_left` |
| Semimembranosus | `semimembranosus-left` | `muscle_semimembranosus_left` |
| Gastrocnemius | `gastrocnemius-left` | `muscle_gastrocnemius_left` |
| Soleus | `soleus-left` | `muscle_soleus_left` |
| Tibialis anterior | `tibialis-anterior-left` | `muscle_tibialis_anterior_left` |
| Fibularis longus and brevis | `fibularis-left` | `muscle_fibularis_left` |

## 10. Selectable muscle count

**80** bilateral named muscle/group IDs (40 catalog types × 2 sides) have separately mapped schematic meshes in the body and muscular assets. Zero are medical-quality authored muscle surfaces.

## 11. Selectable bone count

**206** canonical individual bone IDs have mapped schematic meshes in the full-body and skeletal assets. The skeletal GLB contains 335 total meshes because additional context/group geometry is also present. Only canonical IDs count toward 206. Shape accuracy is not implied.

## 12–13. Real GLBs versus placeholders

All 43 files in `public/models/placeholders/` are genuine loadable binary glTF files. **All 43 are placeholders; zero production medical assets are installed.** The renderer isolates these behind `DevelopmentPlaceholderModel`. `public/models/production/` contains instructions and reserved folders only.

## 14. Exact missing production files

The [asset guide](ASSET_GUIDE.md#exact-production-asset-slots) lists all 43 exact paths. Examples: `public/models/production/body/full-body.glb`, `public/models/production/systems/muscular.glb`, `public/models/production/systems/skeletal.glb`, `public/models/production/systems/male-reproductive.glb`. Original legacy URLs remain accepted. Drop in licensed assets, reload or clear/retry model cache, then run validation.

## 15. Muscular naming

Separate meshes or named groups such as `muscle_biceps_brachii_left`, `muscle_biceps_brachii_right`, `muscle_deltoid_left`. A glTF extras `anatomyId` may map directly to an existing record. Do not merge selectable muscles into one mesh. See the table above and exported manifest for every exact ID/alias.

## 16. Skeletal naming

Examples: `bone_femur_left`, `bone_femur_right`, `bone_humerus_left`, `bone_radius_left`, `bone_c1`. Use exact `modelObjectName` / `meshNames` from `public/models/anatomy-manifest.json`, especially where ID suffixes differ. Extras mapping takes precedence, then names and named ancestors. Unmatched meshes map to the atlas root and are reported.

## 17. Add a muscle

Add a unique record to `muscleCatalog.ts`, with region/depth, source-backed description/functions, approximate development anchors and related IDs. Bilateral metadata and names derive in `muscleData.ts`. Add independent meshes to the production GLB. Configure `explorationRegion`, `explodeDirection`, `maxExplodeDistance`, label anchor and normal. Regenerate development assets only when needed; run tests/validation.

## 18. Add a bone

Add a bone node with skeleton layer, spatial parent, reciprocal child links, side, aliases and sources. Add the mesh to the GLB. Only mark `canonicalBone` when it belongs to the conventional count; avoid counting duplicate grouping geometry. Update the canonical catalog intentionally and validate.

## 19. Add a nerve

Add a nerve node on the nervous layer, place it in the brain/spinal/peripheral hierarchy, provide exact mesh aliases and source-backed functions. A pair record may have left/right children if actual meshes distinguish sides. Link micro concepts with `microModel` / `modelId`.

## 20. Add a system

Add a `BodySystem` entry in `modelRegistry.ts`: unique id/modelId, name, layer, description, icon, group and structure roots. Registry loops generate the route and model slot. Cross-system structures can declare `systems` memberships; extend visibility logic only for new layer rules. Cards, side navigation and search derive from the configuration.

## Verification and run instructions

Run from this project directory: `pnpm install --frozen-lockfile`, then `pnpm dev`. Local preview: http://127.0.0.1:5173. `pnpm test` exercises 16 regression cases, including all 43 GLB files. `pnpm validate` writes coverage evidence. `pnpm build` typechecks and creates `dist`; deploy with SPA fallback for deep links.

The generated [asset audit](public/models/asset-report.json) has no metadata errors or unmapped bundled meshes. It intentionally reports missing expected structures separately (30 for the body asset, including grouping concepts and microscopic modules). Being fully mapped does not mean complete anatomical coverage.

Final QA: TypeScript build passed; all 16 regression tests passed; every active placeholder GLB parsed and mapped. Browser checks covered search-to-focus, regional separation, assembly, Basic learning limits, peel/undo, guided-step focus, fullscreen presentation, a 390×844 mobile bottom sheet, and 3840×2160 canvas sizing without horizontal page overflow. The final route-sync fix was checked by returning from an upper-arm deep link to /systems/muscular with matching breadcrumbs.

Build limitation: Vite reports a large Three.js/R3F/drei chunk (~1.21 MB minified, ~342 KB gzip). Clinical datasets still require measured device-specific optimization. The development console also recorded React nested-root unmount warnings during live reload/scene changes; final interaction checks remained usable, but this dependency lifecycle warning is not claimed resolved.

The previous 35 generated development files were preserved outside the public build in ../../work/legacy-development-models. The active app and dist contain only the current 43 registered placeholder GLBs.
