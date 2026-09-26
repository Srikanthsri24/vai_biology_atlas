/**
 * Educational muscle metadata; contains no model geometry.
 * Coordinates are approximate viewer anchors in the existing 6-unit body space:
 * +X is subject LEFT, +Y is superior, +Z is anterior. Mirror X for the right side.
 * `size` is an approximate focus extent, not a clinical measurement or mesh scale.
 * Depth is a regional browsing category, not a universal dissection classification.
 * Group records explicitly say "group"; their members may span several depths.
 * `related` values reference base slugs; apply the side prefix when making instances.
 * Facts checked against the linked university teaching resources on 2026-09-25.
 * Descriptions are concise original summaries; no source images/text are bundled.
 */
export type MuscleRecord = {
  slug: string;
  name: string;
  region: 'head-neck' | 'shoulder' | 'chest' | 'back' | 'upper-arm' | 'forearm' | 'abdomen' | 'gluteal' | 'thigh' | 'lower-leg';
  depth: 'superficial' | 'intermediate' | 'deep';
  position: [number, number, number];
  size: [number, number, number];
  description: string;
  functions: string[];
  origin?: string;
  insertion?: string;
  innervation?: string;
  related?: string[];
  source?: string;
};

const upperLimb = 'https://medicine.uams.edu/neuroscience/education/medical-school-courses/human-structure-module/anatomy-tables/muscle-tables/muscles-of-the-upper-limb/';
const lowerLimb = 'https://medicine.uams.edu/neuroscience/education/medical-school-courses/human-structure-module/anatomy-tables/muscle-tables/muscles-of-the-lower-limb/';
const headBack = 'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back';
const abdomen = 'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax';
const upperOverview = 'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs';
const lowerOverview = 'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs';

export const muscleCatalog: MuscleRecord[] = [
  {
    slug: 'frontalis', name: 'Frontalis', region: 'head-neck', depth: 'superficial',
    position: [.14, 2.59, .278], size: [.13, .14, .05],
    description: 'The forehead belly of the occipitofrontalis muscle.',
    functions: ['Raises the eyebrows', 'Moves forehead skin'],
    source: headBack,
  },
  {
    slug: 'temporalis', name: 'Temporalis', region: 'head-neck', depth: 'superficial',
    position: [.302, 2.46, .045], size: [.07, .20, .17],
    description: 'A broad chewing muscle over the temple.',
    functions: ['Closes the jaw', 'Draws the mandible backward'],
    related: ['masseter'], source: headBack,
  },
  {
    slug: 'masseter', name: 'Masseter', region: 'head-neck', depth: 'superficial',
    position: [.235, 2.215, .205], size: [.07, .13, .08],
    description: 'A powerful chewing muscle at the jaw angle.',
    functions: ['Elevates the mandible to close the mouth'],
    related: ['temporalis'], source: headBack,
  },
  {
    slug: 'sternocleidomastoid', name: 'Sternocleidomastoid', region: 'head-neck', depth: 'superficial',
    position: [.145, 1.90, .108], size: [.065, .27, .06],
    description: 'A prominent paired muscle along the anterolateral neck.',
    functions: ['Turns the head toward the opposite side', 'Together, both sides help flex the neck'],
    related: ['trapezius'], source: headBack,
  },
  {
    slug: 'trapezius', name: 'Trapezius', region: 'back', depth: 'superficial',
    position: [.25, 1.36, -.252], size: [.31, .51, .08],
    description: 'A broad superficial muscle across the upper back.',
    functions: ['Positions and upwardly rotates the scapula'],
    related: ['rhomboids', 'serratus-anterior'], source: upperLimb,
  },
  {
    slug: 'deltoid', name: 'Deltoid', region: 'shoulder', depth: 'superficial',
    position: [.752, 1.39, .015], size: [.25, .28, .25],
    description: 'The rounded muscle covering the shoulder joint.',
    functions: ['Raises the arm sideways', 'Anterior and posterior fibers assist shoulder flexion, extension, and rotation'],
    origin: 'Outer clavicular third, acromion, and the spine of the scapula.',
    insertion: 'Deltoid tuberosity on the humerus.',
    innervation: 'Axillary nerve; roots C5-C6.',
    related: ['supraspinatus', 'infraspinatus', 'pectoralis-major'], source: upperLimb,
  },
  {
    slug: 'supraspinatus', name: 'Supraspinatus', region: 'shoulder', depth: 'deep',
    position: [.44, 1.485, -.208], size: [.20, .075, .08],
    description: 'A rotator cuff muscle above the scapular spine.',
    functions: ['Assists arm abduction', 'Supports shoulder stability'],
    related: ['deltoid', 'infraspinatus', 'teres-minor'], source: upperOverview,
  },
  {
    slug: 'infraspinatus', name: 'Infraspinatus', region: 'shoulder', depth: 'intermediate',
    position: [.42, 1.25, -.246], size: [.20, .23, .065],
    description: 'A rotator cuff muscle behind the scapula.',
    functions: ['Rotates the arm outward'],
    related: ['supraspinatus', 'teres-minor'], source: upperOverview,
  },
  {
    slug: 'teres-major', name: 'Teres major', region: 'shoulder', depth: 'intermediate',
    position: [.525, 1.055, -.208], size: [.21, .08, .075],
    description: 'A shoulder muscle below teres minor.',
    functions: ['Draws the arm inward and backward', 'Rotates the arm inward'],
    related: ['latissimus-dorsi', 'teres-minor'], source: upperLimb,
  },
  {
    slug: 'teres-minor', name: 'Teres minor', region: 'shoulder', depth: 'deep',
    position: [.57, 1.195, -.233], size: [.15, .058, .06],
    description: 'A narrow rotator cuff muscle near the scapular edge.',
    functions: ['Rotates the arm outward'],
    related: ['infraspinatus', 'teres-major'], source: upperOverview,
  },
  {
    slug: 'pectoralis-major', name: 'Pectoralis major', region: 'chest', depth: 'superficial',
    position: [.30, 1.24, .24], size: [.34, .265, .12],
    description: 'The large anterior chest muscle.',
    functions: ['Draws the arm inward', 'Assists shoulder flexion and inward rotation'],
    related: ['pectoralis-minor', 'deltoid'], source: upperLimb,
  },
  {
    slug: 'pectoralis-minor', name: 'Pectoralis minor', region: 'chest', depth: 'deep',
    position: [.34, 1.145, .145], size: [.19, .245, .055],
    description: 'A smaller muscle beneath pectoralis major.',
    functions: ['Draws the scapula forward and downward'],
    related: ['pectoralis-major', 'serratus-anterior'], source: upperOverview,
  },
  {
    slug: 'serratus-anterior', name: 'Serratus anterior', region: 'chest', depth: 'intermediate',
    position: [.525, .94, .03], size: [.11, .34, .22],
    description: 'A rib-to-scapula muscle along the lateral chest.',
    functions: ['Moves the scapula forward', 'Helps upwardly rotate the scapula'],
    related: ['trapezius', 'pectoralis-minor'], source: upperLimb,
  },
  {
    slug: 'latissimus-dorsi', name: 'Latissimus dorsi', region: 'back', depth: 'superficial',
    position: [.345, .585, -.252], size: [.25, .59, .09],
    description: 'A broad lower-back muscle acting on the shoulder.',
    functions: ['Moves the arm backward and inward'],
    related: ['teres-major', 'trapezius'], source: upperOverview,
  },
  {
    slug: 'rhomboids', name: 'Rhomboids', region: 'back', depth: 'deep',
    position: [.22, 1.285, -.21], size: [.13, .25, .055],
    description: 'The rhomboid major and minor muscle group.',
    functions: ['Retracts and downwardly rotates the scapula'],
    related: ['trapezius', 'serratus-anterior'], source: upperOverview,
  },
  {
    slug: 'erector-spinae', name: 'Erector spinae', region: 'back', depth: 'deep',
    position: [.135, .69, -.222], size: [.095, .96, .095],
    description: 'Long columns of muscles alongside the vertebral column.',
    functions: ['Extends the spine', 'Helps maintain upright posture'],
    related: ['rectus-abdominis', 'latissimus-dorsi'], source: headBack,
  },
  {
    slug: 'biceps-brachii', name: 'Biceps brachii', region: 'upper-arm', depth: 'superficial',
    position: [.975, .945, .12], size: [.14, .395, .15],
    description: 'The two-headed muscle on the anterior upper arm.',
    functions: ['Bends the elbow', 'Turns the forearm palm-up'],
    origin: 'Two scapular attachments: the coracoid tip (short head) and supraglenoid tubercle (long head).',
    insertion: 'Radial tuberosity.',
    innervation: 'Musculocutaneous nerve; roots C5-C6.',
    related: ['brachialis', 'triceps-brachii'], source: upperLimb,
  },
  {
    slug: 'brachialis', name: 'Brachialis', region: 'upper-arm', depth: 'deep',
    position: [.995, .805, .045], size: [.13, .28, .105],
    description: 'An elbow flexor beneath biceps brachii.',
    functions: ['Bends the elbow'],
    related: ['biceps-brachii', 'triceps-brachii'], source: upperOverview,
  },
  {
    slug: 'triceps-brachii', name: 'Triceps brachii', region: 'upper-arm', depth: 'superficial',
    position: [.985, .955, -.14], size: [.14, .395, .12],
    description: 'The three-headed muscle behind the upper arm.',
    functions: ['Straightens the elbow'],
    related: ['biceps-brachii', 'brachialis'], source: upperOverview,
  },
  {
    slug: 'forearm-flexors', name: 'Forearm flexor group', region: 'forearm', depth: 'superficial',
    position: [1.205, .225, .095], size: [.115, .34, .10],
    description: 'Anterior forearm muscles spanning superficial and deeper layers.',
    functions: ['Bend the wrist and fingers'],
    related: ['forearm-extensors'], source: upperOverview,
  },
  {
    slug: 'forearm-extensors', name: 'Forearm extensor group', region: 'forearm', depth: 'superficial',
    position: [1.205, .235, -.083], size: [.12, .35, .095],
    description: 'Posterior forearm muscles spanning superficial and deeper layers.',
    functions: ['Straighten the wrist and fingers'],
    related: ['forearm-flexors'], source: upperOverview,
  },
  {
    slug: 'rectus-abdominis', name: 'Rectus abdominis', region: 'abdomen', depth: 'superficial',
    position: [.12, .225, .275], size: [.115, .48, .07],
    description: 'A paired vertical muscle beside the abdominal midline.',
    functions: ['Bends the trunk forward'],
    related: ['external-oblique', 'erector-spinae'], source: abdomen,
  },
  {
    slug: 'external-oblique', name: 'External oblique', region: 'abdomen', depth: 'superficial',
    position: [.365, .25, .19], size: [.15, .37, .12],
    description: 'The outermost lateral abdominal muscle layer.',
    functions: ['Helps rotate and side-bend the trunk', 'Compresses the abdomen'],
    related: ['internal-oblique', 'rectus-abdominis'], source: abdomen,
  },
  {
    slug: 'internal-oblique', name: 'Internal oblique', region: 'abdomen', depth: 'intermediate',
    position: [.345, .225, .13], size: [.145, .35, .095],
    description: 'The abdominal wall layer beneath the external oblique.',
    functions: ['Helps rotate and side-bend the trunk', 'Compresses the abdomen'],
    related: ['external-oblique', 'transversus-abdominis'], source: abdomen,
  },
  {
    slug: 'transversus-abdominis', name: 'Transversus abdominis', region: 'abdomen', depth: 'deep',
    position: [.31, .20, .055], size: [.15, .34, .075],
    description: 'The deepest lateral abdominal muscle, with transverse fibers.',
    functions: ['Compresses abdominal contents', 'Assists forceful expiration'],
    related: ['internal-oblique'], source: abdomen,
  },
  {
    slug: 'gluteus-maximus', name: 'Gluteus maximus', region: 'gluteal', depth: 'superficial',
    position: [.355, -.49, -.267], size: [.27, .32, .15],
    description: 'The large superficial muscle forming the buttock.',
    functions: ['Extends the hip', 'Rotates the thigh outward'],
    related: ['gluteus-medius', 'biceps-femoris'], source: lowerLimb,
  },
  {
    slug: 'gluteus-medius', name: 'Gluteus medius', region: 'gluteal', depth: 'intermediate',
    position: [.47, -.345, -.12], size: [.19, .23, .13],
    description: 'A lateral hip muscle partly covered by gluteus maximus.',
    functions: ['Moves the thigh outward', 'Assists inward thigh rotation'],
    related: ['gluteus-maximus', 'gluteus-minimus'], source: lowerLimb,
  },
  {
    slug: 'gluteus-minimus', name: 'Gluteus minimus', region: 'gluteal', depth: 'deep',
    position: [.435, -.385, -.07], size: [.16, .195, .09],
    description: 'The smallest gluteal muscle, beneath gluteus medius.',
    functions: ['Moves the thigh outward', 'Assists inward thigh rotation'],
    related: ['gluteus-medius'], source: lowerLimb,
  },
  {
    slug: 'rectus-femoris', name: 'Rectus femoris', region: 'thigh', depth: 'superficial',
    position: [.35, -1.02, .18], size: [.13, .50, .105],
    description: 'The quadriceps muscle crossing both hip and knee.',
    functions: ['Straightens the knee', 'Bends the hip'],
    related: ['vastus-lateralis', 'vastus-medialis', 'vastus-intermedius'], source: lowerOverview,
  },
  {
    slug: 'vastus-lateralis', name: 'Vastus lateralis', region: 'thigh', depth: 'superficial',
    position: [.52, -1.055, .075], size: [.12, .485, .135],
    description: 'The quadriceps muscle on the outer thigh.',
    functions: ['Straightens the knee'],
    related: ['rectus-femoris', 'vastus-medialis'], source: lowerOverview,
  },
  {
    slug: 'vastus-medialis', name: 'Vastus medialis', region: 'thigh', depth: 'superficial',
    position: [.245, -1.24, .125], size: [.105, .325, .105],
    description: 'The quadriceps muscle along the inner anterior thigh.',
    functions: ['Straightens the knee'],
    related: ['rectus-femoris', 'vastus-lateralis'], source: lowerOverview,
  },
  {
    slug: 'vastus-intermedius', name: 'Vastus intermedius', region: 'thigh', depth: 'deep',
    position: [.37, -1.055, .07], size: [.14, .445, .085],
    description: 'The quadriceps muscle beneath rectus femoris.',
    functions: ['Straightens the knee'],
    related: ['rectus-femoris'], source: lowerOverview,
  },
  {
    slug: 'sartorius', name: 'Sartorius', region: 'thigh', depth: 'superficial',
    position: [.345, -1.055, .24], size: [.045, .54, .035],
    description: 'A slender muscle crossing the anterior thigh diagonally.',
    functions: ['Bends the hip and knee', 'Moves and rotates the thigh outward'],
    related: ['rectus-femoris', 'semitendinosus'], source: lowerOverview,
  },
  {
    slug: 'biceps-femoris', name: 'Biceps femoris', region: 'thigh', depth: 'superficial',
    position: [.475, -1.07, -.175], size: [.105, .48, .11],
    description: 'The lateral hamstring, with long and short heads.',
    functions: ['Bends the knee', 'Its long head extends the hip'],
    related: ['semitendinosus', 'semimembranosus'], source: lowerOverview,
  },
  {
    slug: 'semitendinosus', name: 'Semitendinosus', region: 'thigh', depth: 'superficial',
    position: [.265, -1.065, -.218], size: [.078, .47, .08],
    description: 'A medial hamstring with a long distal tendon.',
    functions: ['Bends the knee', 'Extends the hip'],
    related: ['semimembranosus', 'biceps-femoris'], source: lowerOverview,
  },
  {
    slug: 'semimembranosus', name: 'Semimembranosus', region: 'thigh', depth: 'intermediate',
    position: [.305, -1.09, -.145], size: [.10, .45, .075],
    description: 'A medial hamstring deep to semitendinosus.',
    functions: ['Bends the knee', 'Extends the hip'],
    related: ['semitendinosus', 'biceps-femoris'], source: lowerOverview,
  },
  {
    slug: 'gastrocnemius', name: 'Gastrocnemius', region: 'lower-leg', depth: 'superficial',
    position: [.405, -2.025, -.19], size: [.15, .355, .135],
    description: 'The two-headed calf muscle crossing knee and ankle.',
    functions: ['Points the foot downward', 'Assists knee bending'],
    related: ['soleus', 'tibialis-anterior'], source: lowerLimb,
  },
  {
    slug: 'soleus', name: 'Soleus', region: 'lower-leg', depth: 'intermediate',
    position: [.405, -2.20, -.112], size: [.15, .36, .10],
    description: 'A calf muscle beneath gastrocnemius that crosses the ankle.',
    functions: ['Points the foot downward'],
    related: ['gastrocnemius', 'tibialis-anterior'], source: lowerOverview,
  },
  {
    slug: 'tibialis-anterior', name: 'Tibialis anterior', region: 'lower-leg', depth: 'superficial',
    position: [.335, -2.135, .09], size: [.075, .39, .075],
    description: 'A muscle on the anterior side of the shin.',
    functions: ['Lifts the foot upward', 'Turns the sole inward'],
    related: ['gastrocnemius', 'fibularis'], source: lowerLimb,
  },
  {
    slug: 'fibularis', name: 'Fibularis longus and brevis', region: 'lower-leg', depth: 'superficial',
    position: [.545, -2.15, -.02], size: [.065, .38, .085],
    description: 'The lateral leg muscle group; longus overlies brevis.',
    functions: ['Turns the sole outward', 'Assists downward foot movement'],
    related: ['tibialis-anterior', 'soleus'], source: lowerLimb,
  },
];
