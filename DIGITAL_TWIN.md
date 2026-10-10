# Biology Digital Twin

Open `/digital-twin` from navigation, home or global search. The experience uses the installed body GLB, its mesh metadata and existing model licensing. It is a teaching simulation, not an individual clinical digital twin.

`src/data/digitalTwin.ts` contains a deterministic coupled update: activity -> muscle demand -> shared regulatory drive -> heart/breathing/stroke-volume targets -> relative flow, with heat production and delayed clearance. These coefficients are authored teaching parameters. Baselines of 72 bpm and 14 breaths/min are representative choices, not normal ranges or measurements. Oxygen demand, flow, heat production and heat load are relative indices. No oxygen saturation, pressure, gas exchange, weather, fitness or disease prediction is computed.

`useDigitalTwin.ts` advances one clock with bounded frame steps; pause freezes state and all organ phases. UI updates are throttled. Up to 900 samples are retained in-memory and can be exported to CSV. Reset returns to the same baseline. Selecting rest permits recovery rather than resetting instantly.

`TwinViewer.tsx` clones cached anatomical geometry and materials, preserves mesh identities and scales the heart/lungs around their geometry centres. Muscle colour represents demand, not biomechanical movement. Camera focus, isolation, orbit, zoom, body envelope and fullscreen allow inspection while paused. Dedicated reproductive views remain available in the original atlas.

Scientific editorial context: OpenStax Anatomy & Physiology 2e, section 19.4 Cardiac Physiology (https://openstax.org/books/anatomy-and-physiology-2e/pages/19-4-cardiac-physiology). The general coordination principle informed explanatory copy; numerical coefficients are not sourced or calibrated from this textbook. Model assumptions are visible in the interface; no outbound reading links appear in teaching panels.

Tests cover stable rest, coordinated onset, response lags, recovery, frozen time, input bounds and step-size consistency. Browser QA should also check mesh motion, camera focus, pause/resume, CSV and mobile fit.


## Advanced investigations and review

Three configurable protocols in `twinProtocols` automate progressive exercise, intervals and recovery. Phases contain durations, activity settings and an investigation question. Manual workload changes exit the guided protocol. Playback supports 0.5–8× speed and stops at protocol completion.

Timeline scrubbing pauses and restores a recorded state, including heart and breath phases. Resuming removes later samples and starts a new branch. Two named snapshots preserve copied observations independently of simulation reset for side-by-side comparison and differences. These observations exist only in the current visit; no student data is stored remotely.

`TwinViewControls` provides front/back/left/right camera transitions, five layer strengths, anatomical/demand/heat/flow views and a movable cross-section plane. Cuts are open, not capped; they do not represent histological interiors. Layer strength scales the translucent teaching materials. `TwinFlow` draws a conceptual heart–lung–muscle loop whose marker speed follows relative flow. Its route is not traced through vessel lumens, and colours do not encode calculated blood gases. Demand and heat overlays are illustrative signal encodings, not measured spatial physiology.

Additional QA covers protocol boundaries and interval thermal carryover, timeline rewind and branching, comparison snapshots, camera orientations, layer controls and cross sections. The original atlas remains available for detailed individual structures.
