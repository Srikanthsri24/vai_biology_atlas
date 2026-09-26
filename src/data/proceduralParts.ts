/**
 * Deterministic schematic anatomy for development and interaction testing.
 * These deliberately simplified surfaces are not clinical anatomical models.
 * World space: +X = subject left, +Y = superior, +Z = anterior. Height ~6 units.
 * Spheres are unit-radius ellipsoids. Tubes contain absolute world-space points.
 */
export type Vec3 = [number, number, number];

export type Part = {
  key: string;
  id: string;
  layer: 'skin' | 'muscles' | 'skeleton' | 'organs' | 'nervous' | 'circulatory';
  position: Vec3;
  scale: Vec3;
  rotation?: Vec3;
  color: string;
  shape?: 'sphere' | 'capsule' | 'tube';
  points?: Vec3[];
  radius?: number;
};

const C = {
  skin: '#b9c9c6', skinDetail: '#acbebb',
  muscle: '#a76861', muscleLight: '#bc8176',
  bone: '#e6dfcb', cartilage: '#bfceca',
  heart: '#a85359', ventricle: '#b36565', artery: '#ad6668', vein: '#687f9c',
  brain: '#c3a1a7', gyri: '#d2b2b5', cerebellum: '#b39aa7',
  lung: '#ba9ea9', liver: '#9e6870', stomach: '#c9958e', intestine: '#cca197',
  nerve: '#d8b879', tendon: '#ddd4b7',
};

/** Each part's id is a metadata id; several meshes may belong to one structure. */
export function createParts(): Part[] {
  const parts: Part[] = [];
  const add = (
    id: string, layer: Part['layer'], position: Vec3, scale: Vec3,
    color: string, rotation?: Vec3,
  ) => {
    parts.push({ key: `${id}-${parts.length}`, id, layer, position, scale, color,
      ...(rotation ? { rotation } : {}), shape: 'sphere' });
  };
  const tube = (
    id: string, layer: Part['layer'], points: Vec3[], radius: number, color: string,
  ) => {
    parts.push({ key: `${id}-${parts.length}`, id, layer, position: [0, 0, 0],
      scale: [1, 1, 1], color, shape: 'tube', points, radius });
  };

  // Continuous external silhouette. Discrete soft forms keep every region selectable.
  add('head', 'skin', [0, 2.40, -.015], [.385, .47, .34], C.skin);
  add('head', 'skin', [0, 2.24, .165], [.265, .285, .235], C.skin);
  add('head', 'skin', [0, 2.32, .377], [.055, .105, .071], C.skinDetail);
  add('head', 'skin', [0, 1.89, -.025], [.195, .26, .19], C.skin);
  add('chest', 'skin', [0, 1.08, -.055], [.69, .78, .345], C.skin);
  add('abdomen', 'skin', [0, .25, -.025], [.53, .54, .315], C.skin);
  add('abdomen', 'skin', [0, -.40, -.035], [.635, .47, .37], C.skin);
  for (const s of [-1, 1]) {
    const arm = s === 1 ? 'left-arm' : 'right-arm';
    const leg = s === 1 ? 'left-leg' : 'right-leg';
    const hand = s === 1 ? 'hand' : 'right-hand';
    const foot = s === 1 ? 'foot' : 'right-foot';
    add('head', 'skin', [s * .367, 2.33, -.005], [.065, .126, .078], C.skinDetail);
    add(arm, 'skin', [s * .73, 1.40, -.04], [.32, .275, .30], C.skin);
    add(arm, 'skin', [s * .96, .94, -.025], [.225, .49, .235], C.skin, [0, 0, s * .28]);
    add(arm, 'skin', [s * 1.20, .24, .015], [.16, .415, .18], C.skin, [0, 0, s * .23]);
    add(arm, 'skin', [s * 1.34, -.15, .012], [.103, .21, .117], C.skin, [0, 0, s * .12]);
    add(hand, 'skin', [s * 1.405, -.46, .028], [.14, .205, .085], C.skin, [0, 0, s * .08]);
    add(leg, 'skin', [s * .365, -1.01, -.035], [.295, .64, .285], C.skin, [0, 0, s * -.07]);
    add(leg, 'skin', [s * .405, -1.64, .02], [.205, .21, .208], C.skin);
    add(leg, 'skin', [s * .405, -2.075, -.055], [.202, .465, .222], C.skin);
    add(leg, 'skin', [s * .40, -2.59, .0], [.116, .225, .133], C.skin);
    add(foot, 'skin', [s * .405, -2.83, .165], [.168, .135, .35], C.skin);
    add(foot, 'skin', [s * .405, -2.866, .395], [.175, .095, .18], C.skin);
    const fingerLengths = [.215, .285, .31, .265];
    for (let finger = 0; finger < 4; finger++) {
      const x = s * (1.405 + (finger - 1.5) * .065);
      const len = fingerLengths[finger];
      tube(hand, 'skin', [[x, -.605, .027], [x + s * .008, -.72, .035],
        [x + s * .015, -.635 - len, .046]], .029 - (finger === 0 ? .004 : 0), C.skin);
    }
    tube(hand, 'skin', [[s * 1.49, -.42, .057], [s * 1.58, -.54, .081],
      [s * 1.645, -.66, .086]], .037, C.skin);
  }

  // Superficial muscle groups: measured, directional volumes, never scattered.
  for (const s of [-1, 1]) {
    const arm = s === 1 ? 'left-arm' : 'right-arm';
    const leg = s === 1 ? 'leg-muscles' : 'right-leg';
    add('chest', 'muscles', [s * .30, 1.245, .245], [.355, .265, .115], C.muscle, [0, 0, s * -.10]);
    add(arm, 'muscles', [s * .745, 1.385, .035], [.245, .255, .245], C.muscleLight);
    add(arm, 'muscles', [s * .975, .945, .09], [.142, .39, .15], C.muscle, [0, 0, s * .25]);
    add(arm, 'muscles', [s * .985, .94, -.13], [.13, .37, .10], C.muscleLight, [0, 0, s * .25]);
    add(arm, 'muscles', [s * 1.20, .25, .058], [.115, .355, .117], C.muscle, [0, 0, s * .23]);
    add('abdomen', 'muscles', [s * .37, .27, .19], [.095, .37, .08], C.muscle, [0, 0, s * -.18]);
    for (let i = 0; i < 4; i++) {
      add('abdomen', 'muscles', [s * .118, .68 - i * .20, .265], [.115, .091, .065], C.muscleLight);
    }
    add(leg, 'muscles', [s * .30, -1.01, .15], [.133, .52, .107], C.muscleLight, [0, 0, s * -.07]);
    add(leg, 'muscles', [s * .47, -1.035, .10], [.125, .49, .125], C.muscle, [0, 0, s * .03]);
    add(leg, 'muscles', [s * .365, -1.03, -.21], [.17, .51, .10], C.muscle);
    add(leg, 'muscles', [s * .405, -2.045, -.16], [.157, .37, .13], C.muscleLight);
    add(leg, 'muscles', [s * .33, -2.135, .063], [.067, .36, .07], C.muscle);
    add(leg, 'muscles', [s * .38, -.47, -.27], [.255, .31, .135], C.muscleLight);
  }

  // Axial skeleton. A segmented spine and paired curving ribs read in silhouette.
  add('skull', 'skeleton', [0, 2.43, -.035], [.342, .403, .292], C.bone);
  tube('skull', 'skeleton', [[-.215, 2.24, .19], [-.16, 2.11, .215], [0, 2.075, .235],
    [.16, 2.11, .215], [.215, 2.24, .19]], .038, C.bone);
  for (let i = 0; i < 20; i++) {
    const y = 1.985 - i * .135;
    add(i < 3 ? 'head' : i < 12 ? 'rib-cage' : 'abdomen', 'skeleton',
      [0, y, -.16 + Math.sin(i * .30) * .035], [.083 + (i / 400), .047, .087], C.bone);
  }
  tube('rib-cage', 'skeleton', [[0, 1.5, .244], [0, 1.06, .29], [0, .70, .24]], .041, C.bone);
  for (const s of [-1, 1]) {
    tube('rib-cage', 'skeleton', [[s * .06, 1.56, .16], [s * .33, 1.60, .15],
      [s * .64, 1.51, .04]], .042, C.bone);
    add('rib-cage', 'skeleton', [s * .40, 1.29, -.22], [.16, .275, .045], C.bone, [0, 0, s * .22]);
    for (let i = 0; i < 9; i++) {
      const y = 1.45 - i * .106;
      const width = .36 + Math.sin((i + 1) / 10 * Math.PI) * .23;
      tube('rib-cage', 'skeleton', [[s * .075, y + .045, -.16], [s * width * .76, y + .005, -.20],
        [s * width, y - .095, -.02], [s * width * .84, y - .125, .185],
        [s * .055, y - .115, .257]], .023, C.bone);
    }
    add('abdomen', 'skeleton', [s * .38, -.415, -.055], [.17, .30, .205], C.bone, [0, 0, s * -.32]);
    tube('abdomen', 'skeleton', [[s * .44, -.52, .01], [s * .25, -.715, .09],
      [s * .07, -.64, .115], [s * .18, -.49, .10]], .047, C.bone);
    const upperArm = s === 1 ? 'upper-arm' : 'right-arm';
    const forearm = s === 1 ? 'forearm' : 'right-arm';
    tube(upperArm, 'skeleton', [[s * .78, 1.40, -.01], [s * .94, .97, -.005],
      [s * 1.08, .55, .01]], .063, C.bone);
    add(upperArm, 'skeleton', [s * .78, 1.4, -.01], [.115, .112, .11], C.bone);
    tube(forearm, 'skeleton', [[s * 1.065, .54, .045], [s * 1.18, .17, .057],
      [s * 1.325, -.285, .042]], .032, C.bone);
    tube(forearm, 'skeleton', [[s * 1.125, .54, -.035], [s * 1.24, .13, -.035],
      [s * 1.38, -.29, -.022]], .028, C.bone);
    const femur = s === 1 ? 'femur' : 'right-femur';
    const knee = s === 1 ? 'knee' : 'right-knee';
    const tibia = s === 1 ? 'tibia' : 'right-tibia';
    const fibula = s === 1 ? 'fibula' : 'right-fibula';
    const foot = s === 1 ? 'foot' : 'right-foot';
    tube(femur, 'skeleton', [[s * .255, -.54, -.025], [s * .42, -.69, -.01],
      [s * .405, -1.57, .018]], .078, C.bone);
    add(femur, 'skeleton', [s * .255, -.54, -.025], [.103, .102, .105], C.bone);
    add(knee, 'skeleton', [s * .405, -1.62, .132], [.077, .102, .049], C.bone);
    add(knee, 'skeleton', [s * .405, -1.665, .0], [.139, .054, .125], C.cartilage);
    tube(tibia, 'skeleton', [[s * .38, -1.70, .023], [s * .375, -2.17, .035],
      [s * .382, -2.665, .024]], .051, C.bone);
    tube(fibula, 'skeleton', [[s * .51, -1.72, -.022], [s * .492, -2.19, -.025],
      [s * .467, -2.685, -.015]], .026, C.bone);
    add(foot, 'skeleton', [s * .405, -2.77, -.015], [.102, .10, .136], C.bone);
    add(foot, 'skeleton', [s * .403, -2.80, .15], [.11, .064, .10], C.bone);
    for (let toe = 0; toe < 5; toe++) {
      const x = s * (.30 + toe * .047);
      const endZ = .47 - toe * .026;
      tube(foot, 'skeleton', [[x, -2.80, .145], [x, -2.825, .255], [x, -2.842, .34]], .015, C.bone);
      tube(foot, 'skeleton', [[x, -2.842, .356], [x, -2.853, endZ]], .020 - toe * .0014, C.bone);
    }
  }

  // Each hand is a complete assembly: carpal cluster, metacarpals, phalanges,
  // palmar muscle volume, tendons, nerves, and a superficial vessel branch.
  for (const s of [-1, 1]) {
    const carpal = s === 1 ? 'carpals' : 'right-hand';
    const meta = s === 1 ? 'metacarpals' : 'right-hand';
    const phalanx = s === 1 ? 'phalanges' : 'right-hand';
    const muscle = s === 1 ? 'hand-muscles' : 'right-hand';
    const tendon = s === 1 ? 'hand-tendons' : 'right-hand';
    const nerve = s === 1 ? 'hand-nerves' : 'right-hand';
    const vessel = s === 1 ? 'hand-vessels' : 'right-hand';
    for (let row = 0; row < 2; row++) for (let col = 0; col < 4; col++) {
      add(carpal, 'skeleton', [s * (1.405 + (col - 1.5) * .048), -.35 - row * .052, .025],
        [.026, .026, .033], C.bone);
    }
    add(muscle, 'muscles', [s * 1.45, -.49, .046], [.072, .13, .043], C.muscleLight, [0, 0, s * .18]);
    const lens = [.215, .285, .31, .265];
    for (let finger = 0; finger < 4; finger++) {
      const x = s * (1.405 + (finger - 1.5) * .065);
      const baseY = -.641;
      const len = lens[finger];
      tube(meta, 'skeleton', [[s * 1.405 + (x - s * 1.405) * .62, -.417, .024],
        [x, -.51, .023], [x, -.625, .024]], .016, C.bone);
      for (let joint = 0; joint < 3; joint++) {
        const startY = baseY - len * joint / 3;
        const endY = baseY - len * (joint + 1) / 3 + .012;
        tube(phalanx, 'skeleton', [[x + s * .004 * joint, startY, .035],
          [x + s * .004 * (joint + 1), endY, .04]], .0135 - joint * .001, C.bone);
      }
      tube(tendon, 'muscles', [[s * 1.38, -.25, -.005], [x, -.50, .057],
        [x, -.66, .060], [x + s * .01, baseY - len + .025, .060]], .007, C.tendon);
      tube(nerve, 'nervous', [[s * 1.38, -.28, .074], [s * 1.408, -.49, .077],
        [x - s * .012, -.64, .072], [x - s * .005, baseY - len + .025, .066]], .005, C.nerve);
      tube(vessel, 'circulatory', [[s * 1.35, -.27, .055], [s * 1.40, -.53, .083],
        [x + s * .018, -.66, .078], [x + s * .025, baseY - len + .035, .065]], .005, C.artery);
    }
    tube(meta, 'skeleton', [[s * 1.46, -.415, .04], [s * 1.545, -.53, .065]], .021, C.bone);
    tube(phalanx, 'skeleton', [[s * 1.55, -.542, .07], [s * 1.593, -.59, .075]], .017, C.bone);
    tube(phalanx, 'skeleton', [[s * 1.604, -.605, .076], [s * 1.635, -.651, .078]], .015, C.bone);
  }

  // Brain lobes remain separate geometry. Thin surface ridges suggest gyri;
  // they are deliberately schematic, not an anatomical cortical parcellation.
  for (const s of [-1, 1]) {
    add('frontal-lobe', 'organs', [s * .151, 2.465, .142], [.19, .226, .208], C.brain);
    add('parietal-lobe', 'organs', [s * .154, 2.515, -.045], [.193, .218, .198], '#baa0ac');
    add('temporal-lobe', 'organs', [s * .234, 2.324, .015], [.139, .125, .224], '#cba5a9');
    add('occipital-lobe', 'organs', [s * .147, 2.423, -.208], [.177, .177, .137], '#b599aa');
    add('cerebellum', 'organs', [s * .124, 2.217, -.186], [.147, .106, .125], C.cerebellum);
    for (let band = 0; band < 4; band++) {
      const phi = .18 + band * .275;
      for (let region = 0; region < 3; region++) {
        const points: Vec3[] = [];
        for (let n = 0; n <= 12; n++) {
          const theta = .08 + region * 1.00 + n / 12 * .98;
          const ripple = Math.sin(theta * 13 + band * 1.8) * .014;
          points.push([s * (.337 * Math.cos(phi) * Math.sin(theta) + ripple),
            2.42 + .299 * Math.sin(phi) + ripple * .6,
            -.005 + .324 * Math.cos(theta)]);
        }
        tube(['frontal-lobe', 'parietal-lobe', 'occipital-lobe'][region], 'organs', points, .017, C.gyri);
      }
    }
  }
  add('brainstem', 'organs', [0, 2.10, -.10], [.061, .183, .066], '#c0a3a5', [-.18, 0, 0]);

  // Four-chamber heart and great vessels; correct assembly relationship,
  // simplified external surfaces, with a left-pointing ventricular apex.
  add('left-ventricle', 'organs', [.235, .988, .243], [.135, .227, .137], C.ventricle, [0, 0, -.30]);
  add('right-ventricle', 'organs', [.080, 1.02, .288], [.126, .183, .112], C.heart, [0, 0, .20]);
  add('left-atrium', 'organs', [.260, 1.18, .125], [.107, .112, .106], '#ba737b');
  add('right-atrium', 'organs', [.011, 1.166, .215], [.094, .12, .104], '#a86171');
  tube('aorta', 'organs', [[.19, 1.12, .18], [.18, 1.36, .185], [.075, 1.455, .12],
    [-.065, 1.42, .063], [-.13, 1.30, .04], [-.13, .91, -.017]], .045, C.artery);
  tube('aorta', 'organs', [[.07, 1.442, .12], [.025, 1.55, .09], [.006, 1.63, .07]], .022, C.artery);
  tube('pulmonary-artery', 'organs', [[.085, 1.09, .308], [.10, 1.28, .307],
    [.24, 1.33, .17], [.40, 1.28, .07]], .039, '#7988a4');
  tube('pulmonary-artery', 'organs', [[.10, 1.27, .307], [-.05, 1.33, .17], [-.27, 1.28, .06]], .03, '#7988a4');
  for (const s of [-1, 1]) {
    tube('pulmonary-veins', 'organs', [[.25, 1.175, .115], [.22 + s * .11, 1.19, .02],
      [.23 + s * .22, 1.21, -.028]], .025, '#b67a7e');
  }
  add('valves', 'organs', [.211, 1.125, .183], [.054, .022, .046], '#d8c8b0', [0, 0, -.2]);
  add('valves', 'organs', [.065, 1.11, .247], [.045, .023, .042], '#d8c8b0');
  tube('left-ventricle', 'circulatory', [[.20, 1.22, .306], [.265, 1.09, .366], [.265, .91, .35],
    [.26, .80, .27]], .009, '#925159');

  // Thoracic and abdominal viscera, designed to remain readable when isolated.
  for (const s of [-1, 1]) {
    const lung = s === 1 ? 'left-lung' : 'right-lung';
    add(lung, 'organs', [s * .39, 1.05, .025], [.249, .49, .219], C.lung, [0, 0, s * .12]);
    add(lung, 'organs', [s * .44, .81, .04], [.235, .27, .21], '#b096a4');
    tube(lung, 'organs', [[0, 1.47, -.027], [s * .17, 1.26, -.02], [s * .30, 1.08, .02]], .034, '#d0bbb1');
    add('kidneys', 'organs', [s * .285, .05, -.16], [.104, .166, .09], '#ad7781', [0, 0, s * -.23]);
  }
  add('liver', 'organs', [-.235, .46, .107], [.401, .202, .238], C.liver, [0, 0, -.12]);
  add('stomach', 'organs', [.275, .26, .119], [.171, .236, .131], C.stomach, [0, 0, -.35]);
  const intestinalPoints: Vec3[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    intestinalPoints.push([Math.sin(t * Math.PI * 10) * (.225 - t * .035),
      .095 - t * .60, .13 + Math.cos(t * Math.PI * 10) * .032]);
  }
  tube('intestines', 'organs', intestinalPoints, .046, C.intestine);
  tube('intestines', 'organs', [[-.34, -.47, .115], [-.355, -.1, .1], [-.28, .17, .075],
    [.0, .155, .105], [.31, .12, .09], [.35, -.18, .125], [.22, -.49, .145],
    [.035, -.56, .135], [.03, -.68, .06]], .064, '#bd8d88');

  // Central nervous pathways and coherent branches into upper/lower limbs.
  tube('brainstem', 'nervous', [[0, 2.095, -.125], [0, 1.44, -.175], [0, .65, -.185],
    [0, -.39, -.125]], .024, C.nerve);
  for (const s of [-1, 1]) {
    tube(s === 1 ? 'left-arm' : 'right-arm', 'nervous', [[0, 1.57, -.15], [s * .61, 1.48, -.04],
      [s * .94, .94, .02], [s * 1.11, .51, .035], [s * 1.34, -.26, .073]], .012, C.nerve);
    tube(s === 1 ? 'leg-nerves' : 'right-leg', 'nervous', [[0, -.32, -.11], [s * .32, -.69, -.14],
      [s * .39, -1.51, -.07], [s * .40, -2.24, -.046], [s * .415, -2.78, .12]], .015, C.nerve);
    for (let i = 0; i < 4; i++) {
      const y = 1.37 - i * .32;
      tube(i < 3 ? 'rib-cage' : 'abdomen', 'nervous', [[0, y, -.15], [s * .26, y - .08, -.20],
        [s * .46, y - .15, -.08]], .009, C.nerve);
    }
  }

  // Circulation is a connected arterial/venous schematic, not a vessel atlas.
  tube('aorta', 'circulatory', [[-.10, 1.32, -.06], [-.095, .59, -.105], [-.08, -.37, -.07]], .030, C.artery);
  tube('right-atrium', 'circulatory', [[-.02, 1.18, .135], [-.02, .51, -.05], [.01, -.38, -.034]], .031, C.vein);
  for (const s of [-1, 1]) {
    const arm = s === 1 ? 'left-arm' : 'right-arm';
    const leg = s === 1 ? 'leg-vessels' : 'right-leg';
    tube('head', 'circulatory', [[s * .105, 1.37, .07], [s * .125, 1.87, .09], [s * .17, 2.18, .03]], .020, C.artery);
    tube(arm, 'circulatory', [[s * .08, 1.45, .10], [s * .59, 1.45, .11], [s * .89, 1.11, .14],
      [s * 1.08, .56, .12], [s * 1.33, -.26, .095]], .020, C.artery);
    tube(arm, 'circulatory', [[s * .10, 1.40, .065], [s * .66, 1.40, .065], [s * .98, .91, .09],
      [s * 1.14, .48, .076], [s * 1.37, -.28, .059]], .021, C.vein);
    tube(leg, 'circulatory', [[-.06, -.35, -.01], [s * .31, -.63, .09], [s * .34, -1.15, .12],
      [s * .38, -1.72, .085], [s * .38, -2.64, .095], [s * .37, -2.79, .25]], .021, C.artery);
    tube(leg, 'circulatory', [[.01, -.36, -.055], [s * .38, -.70, .035], [s * .425, -1.32, .052],
      [s * .44, -1.89, .04], [s * .43, -2.65, .043]], .023, C.vein);
  }

  return parts;
}
