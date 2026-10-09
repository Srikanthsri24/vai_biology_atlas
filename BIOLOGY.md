# Biology & Labs

Open `/biology` for 32 lessons spanning Classes 1–12. Filter by class, plant biology, animal biology, genetics or molecular biology. Search covers titles, subject, overview and explanation. The header, home page and global search provide entry points. Lesson deep links use `/biology/module/:moduleId`.

The class map is a suggested progression, not certified NCERT/CBSE/ICSE or state-board alignment. Classes 1–5 emphasize observation and familiar organisms; 6–8 compare cells and systems; 9–10 connect inheritance and molecular information; 11–12 emphasize controlled investigation and model limitations. Specific board, chapter and learning-outcome identifiers can be added to the metadata after a syllabus is selected.

## New implementation

- `src/data/biology.ts`: lesson descriptions, explanations, investigations, class mapping and selectable structure information. Each class has plant and animal lessons; Classes 9–12 also have genetics and molecular biology lessons.
- `src/components/biology/BiologyViewer.tsx`: interactive procedural plant, flower, butterfly and plant-cell geometry, plus reusable animal-cell, DNA, translation and division scenes. Orbit, zoom, selection, isolation, transparency, assembly separation and reset are available.
- `src/pages/Biology.tsx`: searchable class/subject library.
- `src/pages/BiologyModule.tsx`: 3D lesson and investigation panel.
- `src/data/virtualLabs.ts`: pure, bounded experiment rules and Mendelian cross calculations.
- `src/pages/VirtualLabs.tsx`: experimental inputs, predictions, notebook, trial chart, Punnett square and CSV download.
- `src/styles/biology.css`: responsive hub, viewer, laboratory and notebook presentation.

## Virtual laboratories

`/labs` lists four experiments. Photosynthesis (`/labs/photosynthesis`) varies light, CO2 and temperature using a qualitative limiting-input model. Osmosis (`/labs/osmosis`) varies internal/external impermeant solute in relative units and illustrates water direction with bounded changes in cell contents. Enzymes (`/labs/enzymes`) uses a hypothetical enzyme with assumed 37°C and pH 7 optima, substrate saturation and enzyme amount. These are teaching response rules, not calibrated measurements or biological predictions. Assumptions are displayed inside each lab.

Inheritance (`/labs/inheritance`) enumerates the four gamete combinations for AA, Aa and aa parents. It assumes a single autosomal locus with complete dominance and equal gamete probabilities. It reports exact expected genotype proportions, not individual outcomes; complex human traits require other models.

Run trial records current inputs, prediction and response. The notebook retains the latest 20 trials for the current experiment visit. It does not persist after navigation/reload; export CSV before leaving. Text is CSV-escaped and formula-leading text is neutralized. No backend, real laboratory equipment or account is required.

## Models and editorial scope

New plant and animal geometry is schematic and openly labelled as such. It is not a scan or species-specific realistic reconstruction. The adult butterfly scene does not animate its life cycle, the plant cell is a photosynthetic comparison cell, and DNA colors do not encode a gene sequence. Existing human GLB assets, credits and journeys remain unchanged. The public modules have original in-platform explanations and do not add external reading links. Internal scientific checks use introductory cell biology, botany and inheritance references.

To add a lesson, add a metadata tuple with class, subject, supported scene, explanation and investigation. To add a new scene, extend BiologyScene and sceneParts, then implement its geometry in BiologyViewer. For high-resolution GLB assets, adapt the existing cached `useModelAsset` loader and mesh metadata mapping; no new licensed plant/animal assets are bundled in this release. To add an experiment, extend LabId, its metadata and the pure labResponse calculation, then add the corresponding controls and validation tests.
