import {
  demoPlates,
  getSubframesForVehicle,
  getVehicle,
  type Subframe,
  type Vehicle,
} from '../data/fitment'

export type LookupResult = {
  source: 'demo-plate' | 'vin-nhtsa' | 'manual'
  plateOrVin: string
  vehicle: Vehicle
  subframes: Subframe[]
  colour?: string
  label?: string
  disclaimer: string
}

export type LookupError = {
  ok: false
  code: 'empty' | 'not-found' | 'vin-unmatched' | 'network'
  message: string
}

export type LookupSuccess = { ok: true; result: LookupResult }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function normalizePlate(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, '')
}

function looksLikeVin(value: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(value)
}

/** Map rough NHTSA make/model strings onto our concept catalogue. */
function matchCatalogue(make: string, model: string, year: number): Vehicle | undefined {
  const m = make.toLowerCase()
  const mod = model.toLowerCase()

  const candidates = [
    { test: () => m.includes('toyota') && mod.includes('hilux'), pick: (y: number) => (y >= 2015 ? 'hilux-n80' : 'hilux-n70') },
    { test: () => m.includes('toyota') && mod.includes('corolla'), pick: () => 'corolla-e210' },
    { test: () => m.includes('ford') && mod.includes('ranger'), pick: (y: number) => (y >= 2022 ? 'ranger-next' : 'ranger-px') },
    { test: () => m.includes('subaru') && (mod.includes('wrx') || mod.includes('impreza')), pick: () => 'wrx-va' },
    { test: () => m.includes('volkswagen') && mod.includes('golf'), pick: () => 'golf-mk7' },
    { test: () => m.includes('nissan') && mod.includes('navara'), pick: () => 'navara-d23' },
    { test: () => m.includes('mitsubishi') && mod.includes('triton'), pick: () => 'triton-mr' },
    { test: () => m.includes('mazda') && mod.includes('bt'), pick: () => 'bt50-up' },
    { test: () => m.includes('bmw') && (mod.includes('3') || mod.includes('330') || mod.includes('320')), pick: () => 'bmw-f30' },
    { test: () => (m.includes('holden') || m.includes('gm')) && mod.includes('commodore'), pick: () => 'commodore-vevf' },
  ]

  for (const c of candidates) {
    if (c.test()) {
      const vehicle = getVehicle(c.pick(year))
      if (vehicle) return vehicle
    }
  }
  return undefined
}

async function lookupVinNhtsa(vin: string): Promise<LookupSuccess | LookupError> {
  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`
    const res = await fetch(url)
    if (!res.ok) {
      return { ok: false, code: 'network', message: 'VIN service unavailable. Try a demo plate or pick your vehicle manually.' }
    }
    const data = await res.json()
    const row = data?.Results?.[0]
    const make = String(row?.Make || '')
    const model = String(row?.Model || '')
    const year = Number(row?.ModelYear || 0)

    if (!make || !model) {
      return {
        ok: false,
        code: 'vin-unmatched',
        message: 'VIN decoded but no vehicle details came back. Try a demo plate or manual select.',
      }
    }

    const vehicle = matchCatalogue(make, model, year)
    if (!vehicle) {
      return {
        ok: false,
        code: 'vin-unmatched',
        message: `Decoded ${year || ''} ${make} ${model}, but that vehicle isn’t in this concept catalogue yet.`,
      }
    }

    return {
      ok: true,
      result: {
        source: 'vin-nhtsa',
        plateOrVin: vin,
        vehicle,
        subframes: getSubframesForVehicle(vehicle),
        label: `VIN decode · ${year} ${make} ${model}`,
        disclaimer:
          'VIN decoded via the free NHTSA vPIC API (US). Mapped onto this concept subframe catalogue — not a live AU/NZ rego lookup.',
      },
    }
  } catch {
    return {
      ok: false,
      code: 'network',
      message: 'Could not reach the VIN service. Use a demo plate or manual select offline.',
    }
  }
}

export async function lookupRegistration(input: string): Promise<LookupSuccess | LookupError> {
  const normalized = normalizePlate(input)
  if (!normalized) {
    return { ok: false, code: 'empty', message: 'Enter a registration plate or VIN.' }
  }

  // Concept latency so the UI feels like a real lookup
  await sleep(700 + Math.random() * 500)

  const demo = demoPlates[normalized]
  if (demo) {
    const vehicle = getVehicle(demo.vehicleId)
    if (!vehicle) {
      return { ok: false, code: 'not-found', message: 'Demo plate is misconfigured.' }
    }
    return {
      ok: true,
      result: {
        source: 'demo-plate',
        plateOrVin: normalized,
        vehicle,
        subframes: getSubframesForVehicle(vehicle),
        colour: demo.colour,
        label: demo.label,
        disclaimer:
          'Concept demo: this plate is mapped in a local fitment table. A live site would call a paid rego/vehicle API, then match make/model/year to SKUs.',
      },
    }
  }

  if (looksLikeVin(normalized)) {
    return lookupVinNhtsa(normalized)
  }

  return {
    ok: false,
    code: 'not-found',
    message:
      'No match for that plate in the demo set. Try ABC123, XYZ987, WRX44 — or pick make/model below. Live rego APIs need a commercial key.',
  }
}

export function lookupManual(vehicleId: string): LookupSuccess | LookupError {
  const vehicle = getVehicle(vehicleId)
  if (!vehicle) {
    return { ok: false, code: 'not-found', message: 'Vehicle not found in catalogue.' }
  }
  return {
    ok: true,
    result: {
      source: 'manual',
      plateOrVin: 'MANUAL',
      vehicle,
      subframes: getSubframesForVehicle(vehicle),
      label: 'Manual vehicle select',
      disclaimer: 'Selected from the concept catalogue — same fitment path a rego API would feed into.',
    },
  }
}

export const DEMO_PLATE_HINTS = Object.keys(demoPlates)
