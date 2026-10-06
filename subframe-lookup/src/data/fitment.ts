export type Subframe = {
  sku: string
  name: string
  position: 'Front' | 'Rear' | 'Front & Rear kit'
  material: string
  finish: string
  priceAud: number
  notes: string
}

export type Vehicle = {
  id: string
  make: string
  model: string
  years: string
  series?: string
  body?: string
  subframeIds: string[]
}

/** Concept catalogue — replace with real SKUs when wiring the client shop. */
export const subframes: Record<string, Subframe> = {
  'SF-HILUX-N70-F': {
    sku: 'SF-HILUX-N70-F',
    name: 'Hilux N70 Front Crossmember',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 890,
    notes: 'Direct-fit replacement for rusted factory front subframe. Includes bush mounts.',
  },
  'SF-HILUX-N80-F': {
    sku: 'SF-HILUX-N80-F',
    name: 'Hilux N80 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 1040,
    notes: 'Reinforced design for 4WD and tow use. Bolt-on to factory points.',
  },
  'SF-RANGER-PX-F': {
    sku: 'SF-RANGER-PX-F',
    name: 'Ranger PX / PX2 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 1120,
    notes: 'Covers PX and PXII. Check engine mount bosses before order.',
  },
  'SF-RANGER-NEXT-F': {
    sku: 'SF-RANGER-NEXT-F',
    name: 'Ranger Next-Gen Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 1290,
    notes: 'For 2022+ Next-Gen Ranger and related platform twins.',
  },
  'SF-COMMODORE-VE-R': {
    sku: 'SF-COMMODORE-VE-R',
    name: 'Commodore VE/VF Rear Cradle',
    position: 'Rear',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 980,
    notes: 'Fits VE and VF sedan/wagon. IRS cradle with refreshed bush seats.',
  },
  'SF-COROLLA-E210-F': {
    sku: 'SF-COROLLA-E210-F',
    name: 'Corolla E210 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 760,
    notes: 'Hatch and sedan shared front member. Hybrid-compatible clearances.',
  },
  'SF-WRX-VA-F': {
    sku: 'SF-WRX-VA-F',
    name: 'WRX VA Front Subframe',
    position: 'Front',
    material: 'Chromoly-reinforced steel',
    finish: 'E-coat + powder',
    priceAud: 1180,
    notes: 'Stiffer front member for VA WRX/STI. Keeps factory geometry.',
  },
  'SF-GOLF-MK7-F': {
    sku: 'SF-GOLF-MK7-F',
    name: 'Golf Mk7 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 840,
    notes: 'MQB platform — also suits some Audi A3 8V applications.',
  },
  'SF-NAVARA-D23-F': {
    sku: 'SF-NAVARA-D23-F',
    name: 'Navara D23 Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 990,
    notes: 'NP300 / D23. Suited to coast-belt rust replacement.',
  },
  'SF-TRITON-MR-F': {
    sku: 'SF-TRITON-MR-F',
    name: 'Triton MR Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 970,
    notes: 'MR series Triton. Verify 2WD vs 4WD mount pattern on order.',
  },
  'SF-BT50-UR-F': {
    sku: 'SF-BT50-UR-F',
    name: 'BT-50 / Ranger shared Front Subframe',
    position: 'Front',
    material: 'High-tensile steel',
    finish: 'E-coat + powder',
    priceAud: 1120,
    notes: 'Shared platform with PX Ranger — confirm year before dispatch.',
  },
  'SF-BMW-F30-F': {
    sku: 'SF-BMW-F30-F',
    name: 'BMW F30 Front Axle Carrier',
    position: 'Front',
    material: 'Aluminium repair section + steel',
    finish: 'Corrosion-treated',
    priceAud: 1450,
    notes: 'Concept fitment for F30/F31. Professional install recommended.',
  },
}

export const vehicles: Vehicle[] = [
  {
    id: 'hilux-n70',
    make: 'Toyota',
    model: 'Hilux',
    years: '2005–2015',
    series: 'N70',
    body: 'Ute',
    subframeIds: ['SF-HILUX-N70-F'],
  },
  {
    id: 'hilux-n80',
    make: 'Toyota',
    model: 'Hilux',
    years: '2015–2025',
    series: 'N80',
    body: 'Ute',
    subframeIds: ['SF-HILUX-N80-F'],
  },
  {
    id: 'ranger-px',
    make: 'Ford',
    model: 'Ranger',
    years: '2011–2022',
    series: 'PX / PX2 / PX3',
    body: 'Ute',
    subframeIds: ['SF-RANGER-PX-F', 'SF-BT50-UR-F'],
  },
  {
    id: 'ranger-next',
    make: 'Ford',
    model: 'Ranger',
    years: '2022–2026',
    series: 'Next-Gen',
    body: 'Ute',
    subframeIds: ['SF-RANGER-NEXT-F'],
  },
  {
    id: 'commodore-vevf',
    make: 'Holden',
    model: 'Commodore',
    years: '2006–2017',
    series: 'VE / VF',
    body: 'Sedan / Wagon',
    subframeIds: ['SF-COMMODORE-VE-R'],
  },
  {
    id: 'corolla-e210',
    make: 'Toyota',
    model: 'Corolla',
    years: '2018–2026',
    series: 'E210',
    body: 'Hatch / Sedan',
    subframeIds: ['SF-COROLLA-E210-F'],
  },
  {
    id: 'wrx-va',
    make: 'Subaru',
    model: 'WRX',
    years: '2014–2021',
    series: 'VA',
    body: 'Sedan',
    subframeIds: ['SF-WRX-VA-F'],
  },
  {
    id: 'golf-mk7',
    make: 'Volkswagen',
    model: 'Golf',
    years: '2013–2020',
    series: 'Mk7',
    body: 'Hatch',
    subframeIds: ['SF-GOLF-MK7-F'],
  },
  {
    id: 'navara-d23',
    make: 'Nissan',
    model: 'Navara',
    years: '2015–2025',
    series: 'D23 / NP300',
    body: 'Ute',
    subframeIds: ['SF-NAVARA-D23-F'],
  },
  {
    id: 'triton-mr',
    make: 'Mitsubishi',
    model: 'Triton',
    years: '2019–2024',
    series: 'MR',
    body: 'Ute',
    subframeIds: ['SF-TRITON-MR-F'],
  },
  {
    id: 'bt50-up',
    make: 'Mazda',
    model: 'BT-50',
    years: '2011–2020',
    series: 'UP / UR',
    body: 'Ute',
    subframeIds: ['SF-BT50-UR-F', 'SF-RANGER-PX-F'],
  },
  {
    id: 'bmw-f30',
    make: 'BMW',
    model: '3 Series',
    years: '2012–2019',
    series: 'F30 / F31',
    body: 'Sedan / Wagon',
    subframeIds: ['SF-BMW-F30-F'],
  },
]

/**
 * Demo rego → vehicle map for the concept.
 * In production this would come from a paid vehicle/rego API
 * (AU/NZ partners, UK DVLA, etc.), then map make/model/year → subframe.
 */
export const demoPlates: Record<
  string,
  { vehicleId: string; colour?: string; label: string }
> = {
  ABC123: { vehicleId: 'hilux-n80', colour: 'White', label: 'Demo ute — Hilux' },
  XYZ987: { vehicleId: 'ranger-px', colour: 'Grey', label: 'Demo ute — Ranger PX' },
  WRX44: { vehicleId: 'wrx-va', colour: 'Blue', label: 'Demo sedan — WRX' },
  GOLF7: { vehicleId: 'golf-mk7', colour: 'Red', label: 'Demo hatch — Golf' },
  VE334: { vehicleId: 'commodore-vevf', colour: 'Black', label: 'Demo — Commodore' },
  COR2020: { vehicleId: 'corolla-e210', colour: 'Silver', label: 'Demo — Corolla' },
  NAV300: { vehicleId: 'navara-d23', colour: 'White', label: 'Demo — Navara' },
  BT5011: { vehicleId: 'bt50-up', colour: 'Blue', label: 'Demo — BT-50' },
  TRI19: { vehicleId: 'triton-mr', colour: 'Black', label: 'Demo — Triton' },
  BMW330: { vehicleId: 'bmw-f30', colour: 'White', label: 'Demo — BMW 3 Series' },
  NEXT22: { vehicleId: 'ranger-next', colour: 'Orange', label: 'Demo — Next-Gen Ranger' },
  N70OLD: { vehicleId: 'hilux-n70', colour: 'Silver', label: 'Demo — Hilux N70' },
}

export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id)
}

export function getSubframesForVehicle(vehicle: Vehicle): Subframe[] {
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

export function vehiclesForMakeModel(make: string, model: string): Vehicle[] {
  return vehicles.filter((v) => v.make === make && v.model === model)
}
