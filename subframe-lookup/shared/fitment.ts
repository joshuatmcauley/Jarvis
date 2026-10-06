export type Subframe = {
  sku: string
  name: string
  position: 'Front' | 'Rear' | 'Front & Rear kit'
  material: string
  finish: string
  priceGbp: number
  notes: string
}

export type VehicleFitment = {
  id: string
  make: string
  model: string
  /** Inclusive model-year range */
  yearFrom: number
  yearTo: number
  chassis?: string
  body?: string
  /** Extra tokens that help match MOT model strings */
  aliases?: string[]
  subframeIds: string[]
}

/** Placeholder Euro catalogue — replace SKUs/prices with the client’s real list. */
export const subframes: Record<string, Subframe> = {
  'ES-GOLF-MK5-F': {
    sku: 'ES-GOLF-MK5-F',
    name: 'Golf / Jetta Mk5 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 285,
    notes: 'Fits Golf Mk5 and platform twins. Direct bolt-on replacement.',
  },
  'ES-GOLF-MK6-F': {
    sku: 'ES-GOLF-MK6-F',
    name: 'Golf Mk6 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 295,
    notes: 'Mk6 Golf / Scirocco shared front member.',
  },
  'ES-GOLF-MK7-F': {
    sku: 'ES-GOLF-MK7-F',
    name: 'Golf Mk7 / MQB Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 320,
    notes: 'MQB platform — also suits many Audi A3 8V / Seat Leon 5F applications.',
  },
  'ES-GOLF-MK7-R': {
    sku: 'ES-GOLF-MK7-R',
    name: 'Golf Mk7 Rear Subframe',
    position: 'Rear',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 340,
    notes: 'Independent rear cradle for Mk7 hatch/estate.',
  },
  'ES-A3-8P-F': {
    sku: 'ES-A3-8P-F',
    name: 'Audi A3 8P Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 310,
    notes: 'A3 8P / Golf Mk5 family. Confirm quattro mount differences on order.',
  },
  'ES-A3-8V-F': {
    sku: 'ES-A3-8V-F',
    name: 'Audi A3 8V Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 335,
    notes: 'MQB A3 8V. Shared geometry family with Golf Mk7.',
  },
  'ES-A4-B8-F': {
    sku: 'ES-A4-B8-F',
    name: 'Audi A4 B8 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 380,
    notes: 'B8 / B8.5 A4/A5. Professional alignment after fit recommended.',
  },
  'ES-BMW-E90-F': {
    sku: 'ES-BMW-E90-F',
    name: 'BMW E90/E91 Front Axle Carrier',
    position: 'Front',
    material: 'Aluminium / steel repair',
    finish: 'Corrosion-treated',
    priceGbp: 420,
    notes: '3 Series E90 family front carrier. Check engine variant mounts.',
  },
  'ES-BMW-F30-F': {
    sku: 'ES-BMW-F30-F',
    name: 'BMW F30/F31 Front Axle Carrier',
    position: 'Front',
    material: 'Aluminium / steel repair',
    finish: 'Corrosion-treated',
    priceGbp: 455,
    notes: 'F30/F31 3 Series. Common rust/crash replacement item.',
  },
  'ES-BMW-F30-R': {
    sku: 'ES-BMW-F30-R',
    name: 'BMW F30/F31 Rear Axle Carrier',
    position: 'Rear',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 390,
    notes: 'Rear subframe for F30 sedan / F31 estate.',
  },
  'ES-BMW-E60-R': {
    sku: 'ES-BMW-E60-R',
    name: 'BMW E60/E61 Rear Subframe',
    position: 'Rear',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 410,
    notes: 'Known corrosion hotspot — reinforced bush seats.',
  },
  'ES-MERC-W204-F': {
    sku: 'ES-MERC-W204-F',
    name: 'Mercedes C-Class W204 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 400,
    notes: 'W204 C-Class. Verify diesel vs petrol mount pattern.',
  },
  'ES-MERC-W205-F': {
    sku: 'ES-MERC-W205-F',
    name: 'Mercedes C-Class W205 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 445,
    notes: 'W205 generation. Includes bush mount points.',
  },
  'ES-FOCUS-MK3-F': {
    sku: 'ES-FOCUS-MK3-F',
    name: 'Ford Focus Mk3 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 260,
    notes: 'Focus Mk3 / Mk3.5. Popular UK coast-belt replacement.',
  },
  'ES-ASTRA-J-F': {
    sku: 'ES-ASTRA-J-F',
    name: 'Vauxhall Astra J Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 255,
    notes: 'Astra J / Insignia-related mounts — confirm before dispatch.',
  },
  'ES-MINI-R56-F': {
    sku: 'ES-MINI-R56-F',
    name: 'MINI R56 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 275,
    notes: 'R56/R55/R57 family. Watch oil-filter clearances on diesel.',
  },
  'ES-MINI-F56-F': {
    sku: 'ES-MINI-F56-F',
    name: 'MINI F56 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 310,
    notes: '3rd-gen MINI hatch F56.',
  },
  'ES-OCTAVIA-5E-F': {
    sku: 'ES-OCTAVIA-5E-F',
    name: 'Skoda Octavia 5E / MQB Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 315,
    notes: 'MQB Octavia — closely related to Golf Mk7 member.',
  },
  'ES-LEON-5F-F': {
    sku: 'ES-LEON-5F-F',
    name: 'Seat Leon 5F Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 315,
    notes: 'Leon 5F MQB. Often interchangeable family with Golf Mk7.',
  },
  'ES-PASSAT-B7-F': {
    sku: 'ES-PASSAT-B7-F',
    name: 'VW Passat B7 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 330,
    notes: 'Passat B7 / CC related applications.',
  },
  'ES-PASSAT-B8-F': {
    sku: 'ES-PASSAT-B8-F',
    name: 'VW Passat B8 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceGbp: 355,
    notes: 'Passat B8 MQB. Confirm 4MOTION mount differences.',
  },
}

export const vehicles: VehicleFitment[] = [
  {
    id: 'golf-mk5',
    make: 'Volkswagen',
    model: 'Golf',
    yearFrom: 2003,
    yearTo: 2009,
    chassis: 'Mk5 / 1K',
    aliases: ['golf plus', 'jetta'],
    subframeIds: ['ES-GOLF-MK5-F'],
  },
  {
    id: 'golf-mk6',
    make: 'Volkswagen',
    model: 'Golf',
    yearFrom: 2008,
    yearTo: 2013,
    chassis: 'Mk6 / 5K',
    aliases: ['golf plus'],
    subframeIds: ['ES-GOLF-MK6-F'],
  },
  {
    id: 'golf-mk7',
    make: 'Volkswagen',
    model: 'Golf',
    yearFrom: 2012,
    yearTo: 2020,
    chassis: 'Mk7 / 5G',
    aliases: ['golf gti', 'golf r', 'golf sv'],
    subframeIds: ['ES-GOLF-MK7-F', 'ES-GOLF-MK7-R'],
  },
  {
    id: 'a3-8p',
    make: 'Audi',
    model: 'A3',
    yearFrom: 2003,
    yearTo: 2013,
    chassis: '8P',
    subframeIds: ['ES-A3-8P-F'],
  },
  {
    id: 'a3-8v',
    make: 'Audi',
    model: 'A3',
    yearFrom: 2012,
    yearTo: 2020,
    chassis: '8V',
    subframeIds: ['ES-A3-8V-F', 'ES-GOLF-MK7-F'],
  },
  {
    id: 'a4-b8',
    make: 'Audi',
    model: 'A4',
    yearFrom: 2007,
    yearTo: 2015,
    chassis: 'B8',
    aliases: ['a4 avant', 's4'],
    subframeIds: ['ES-A4-B8-F'],
  },
  {
    id: 'bmw-e90',
    make: 'BMW',
    model: '3 Series',
    yearFrom: 2005,
    yearTo: 2013,
    chassis: 'E90 / E91 / E92',
    aliases: ['320', '325', '330', '335', '318'],
    subframeIds: ['ES-BMW-E90-F'],
  },
  {
    id: 'bmw-f30',
    make: 'BMW',
    model: '3 Series',
    yearFrom: 2011,
    yearTo: 2019,
    chassis: 'F30 / F31',
    aliases: ['320', '330', '340', '318', '316'],
    subframeIds: ['ES-BMW-F30-F', 'ES-BMW-F30-R'],
  },
  {
    id: 'bmw-e60',
    make: 'BMW',
    model: '5 Series',
    yearFrom: 2003,
    yearTo: 2010,
    chassis: 'E60 / E61',
    aliases: ['520', '525', '530', '535'],
    subframeIds: ['ES-BMW-E60-R'],
  },
  {
    id: 'merc-w204',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    yearFrom: 2007,
    yearTo: 2014,
    chassis: 'W204',
    aliases: ['c200', 'c220', 'c250', 'c180', 'mercedes'],
    subframeIds: ['ES-MERC-W204-F'],
  },
  {
    id: 'merc-w205',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    yearFrom: 2014,
    yearTo: 2021,
    chassis: 'W205',
    aliases: ['c200', 'c220', 'c250', 'c180', 'mercedes'],
    subframeIds: ['ES-MERC-W205-F'],
  },
  {
    id: 'focus-mk3',
    make: 'Ford',
    model: 'Focus',
    yearFrom: 2011,
    yearTo: 2018,
    chassis: 'Mk3',
    aliases: ['focus st', 'focus rs'],
    subframeIds: ['ES-FOCUS-MK3-F'],
  },
  {
    id: 'astra-j',
    make: 'Vauxhall',
    model: 'Astra',
    yearFrom: 2009,
    yearTo: 2015,
    chassis: 'J',
    aliases: ['astra gtc', 'opel'],
    subframeIds: ['ES-ASTRA-J-F'],
  },
  {
    id: 'mini-r56',
    make: 'MINI',
    model: 'Hatch',
    yearFrom: 2006,
    yearTo: 2013,
    chassis: 'R56',
    aliases: ['cooper', 'cooper s', 'one', 'clubman'],
    subframeIds: ['ES-MINI-R56-F'],
  },
  {
    id: 'mini-f56',
    make: 'MINI',
    model: 'Hatch',
    yearFrom: 2014,
    yearTo: 2024,
    chassis: 'F56',
    aliases: ['cooper', 'cooper s', 'one'],
    subframeIds: ['ES-MINI-F56-F'],
  },
  {
    id: 'octavia-5e',
    make: 'Skoda',
    model: 'Octavia',
    yearFrom: 2012,
    yearTo: 2020,
    chassis: '5E / MQB',
    aliases: ['octavia vrs'],
    subframeIds: ['ES-OCTAVIA-5E-F', 'ES-GOLF-MK7-F'],
  },
  {
    id: 'leon-5f',
    make: 'Seat',
    model: 'Leon',
    yearFrom: 2012,
    yearTo: 2020,
    chassis: '5F',
    aliases: ['leon cupra'],
    subframeIds: ['ES-LEON-5F-F', 'ES-GOLF-MK7-F'],
  },
  {
    id: 'passat-b7',
    make: 'Volkswagen',
    model: 'Passat',
    yearFrom: 2010,
    yearTo: 2015,
    chassis: 'B7',
    aliases: ['passat cc', 'cc'],
    subframeIds: ['ES-PASSAT-B7-F'],
  },
  {
    id: 'passat-b8',
    make: 'Volkswagen',
    model: 'Passat',
    yearFrom: 2014,
    yearTo: 2024,
    chassis: 'B8',
    subframeIds: ['ES-PASSAT-B8-F'],
  },
]

/** UK-style demo plates for the concept when API keys are not set. */
export const demoPlates: Record<
  string,
  { vehicleId: string; colour?: string; label: string }
> = {
  AB12CDE: { vehicleId: 'golf-mk7', colour: 'Grey', label: 'Demo · Golf Mk7' },
  BK15XYZ: { vehicleId: 'bmw-f30', colour: 'Black', label: 'Demo · BMW F30' },
  MF64AUD: { vehicleId: 'a3-8v', colour: 'White', label: 'Demo · Audi A3 8V' },
  LN11FRD: { vehicleId: 'focus-mk3', colour: 'Blue', label: 'Demo · Focus Mk3' },
  VU13AST: { vehicleId: 'astra-j', colour: 'Silver', label: 'Demo · Astra J' },
  MJ10BMW: { vehicleId: 'bmw-e90', colour: 'Black', label: 'Demo · BMW E90' },
  OV08MNI: { vehicleId: 'mini-r56', colour: 'Red', label: 'Demo · MINI R56' },
  FL16MNI: { vehicleId: 'mini-f56', colour: 'Green', label: 'Demo · MINI F56' },
  KN14SKD: { vehicleId: 'octavia-5e', colour: 'White', label: 'Demo · Octavia' },
  SE15LEO: { vehicleId: 'leon-5f', colour: 'Grey', label: 'Demo · Leon 5F' },
  MC12BEN: { vehicleId: 'merc-w204', colour: 'Silver', label: 'Demo · C-Class W204' },
  RO17MER: { vehicleId: 'merc-w205', colour: 'Black', label: 'Demo · C-Class W205' },
  PF11PAS: { vehicleId: 'passat-b7', colour: 'Blue', label: 'Demo · Passat B7' },
  GU18PAS: { vehicleId: 'passat-b8', colour: 'Grey', label: 'Demo · Passat B8' },
  AU09A4B: { vehicleId: 'a4-b8', colour: 'Black', label: 'Demo · Audi A4 B8' },
  VW07GLF: { vehicleId: 'golf-mk5', colour: 'Silver', label: 'Demo · Golf Mk5' },
}

export function getVehicle(id: string): VehicleFitment | undefined {
  return vehicles.find((v) => v.id === id)
}

export function getSubframesForVehicle(vehicle: VehicleFitment): Subframe[] {
  return vehicle.subframeIds
    .map((id) => subframes[id])
    .filter((s): s is Subframe => Boolean(s))
}

export function uniqueMakes(): string[] {
  return [...new Set(vehicles.map((v) => v.make))].sort()
}

export function modelsForMake(make: string): string[] {
  return [...new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))].sort()
}

export function vehiclesForMakeModel(make: string, model: string): VehicleFitment[] {
  return vehicles.filter((v) => v.make === make && v.model === model)
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

/**
 * Map DVLA/MOT make+model+year onto the Euro Subframes catalogue.
 */
export function matchFitment(input: {
  make: string
  model?: string
  year?: number
}): VehicleFitment[] {
  const makeN = norm(input.make)
  const modelN = norm(input.model || '')
  const year = input.year

  const makeAliases: Record<string, string[]> = {
    volkswagen: ['vw', 'volkswagen'],
    'mercedes-benz': ['mercedes', 'mercedes benz', 'merc', 'mercedes-benz'],
    vauxhall: ['vauxhall', 'opel'],
    mini: ['mini', 'bmw mini'],
    bmw: ['bmw'],
    audi: ['audi'],
    ford: ['ford'],
    skoda: ['skoda', 'škoda'],
    seat: ['seat', 'cupra'],
  }

  const scored = vehicles
    .map((v) => {
      const vMake = norm(v.make)
      const aliases = makeAliases[vMake] || [vMake]
      const makeOk = aliases.some((a) => makeN === a || makeN.includes(a) || a.includes(makeN))
      if (!makeOk) return null

      const vModel = norm(v.model)
      const modelHaystack = [vModel, ...(v.aliases || []).map(norm), norm(v.chassis || '')].join(' ')
      let score = 10

      if (modelN) {
        if (modelN.includes(vModel) || vModel.includes(modelN)) score += 50
        else if (modelHaystack.split(' ').some((t) => t && modelN.includes(t))) score += 35
        else if (modelN.split(' ').some((t) => t.length > 2 && modelHaystack.includes(t))) score += 20
        else score -= 20
      }

      if (year) {
        if (year >= v.yearFrom && year <= v.yearTo) score += 40
        else if (year >= v.yearFrom - 1 && year <= v.yearTo + 1) score += 10
        else score -= 40
      }

      return { v, score }
    })
    .filter((x): x is { v: VehicleFitment; score: number } => x != null && x.score >= 30)
    .sort((a, b) => b.score - a.score)

  // Prefer best score; include near-ties for ambiguous plates
  if (!scored.length) return []
  const best = scored[0].score
  return scored.filter((s) => s.score >= best - 15).map((s) => s.v)
}
