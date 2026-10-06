export type SubframeResult = {
  sku: string
  name: string
  position: string
  material: string
  finish: string
  priceGbp: number
  priceDisplay: string
  notes: string
}

export type VehicleResult = {
  id: string
  make: string
  model: string
  years: string
  chassis?: string
  body?: string
  subframes: SubframeResult[]
}

export type LookupResult = {
  source: string
  vrm: string
  colour?: string
  label?: string
  vehicle: VehicleResult
  alternatives: VehicleResult[]
  disclaimer: string
  apis?: { dvla: boolean; mot: boolean; mode: string }
}

export type LookupError = {
  ok: false
  code: string
  message: string
  demoPlates?: string[]
}

export type LookupSuccess = { ok: true; result: LookupResult }

export async function lookupRegistration(vrm: string): Promise<LookupSuccess | LookupError> {
  const res = await fetch(`/api/lookup?vrm=${encodeURIComponent(vrm)}`)
  const data = await res.json()
  if (!res.ok || !data.ok) {
    return {
      ok: false,
      code: data.code || 'error',
      message: data.message || 'Lookup failed',
      demoPlates: data.demoPlates,
    }
  }
  return data as LookupSuccess
}

export async function lookupManual(vehicleId: string): Promise<LookupSuccess | LookupError> {
  const res = await fetch(`/api/manual/${encodeURIComponent(vehicleId)}`)
  const data = await res.json()
  if (!res.ok || !data.ok) {
    return {
      ok: false,
      code: data.code || 'error',
      message: data.message || 'Lookup failed',
    }
  }
  return data as LookupSuccess
}

export async function fetchDemoPlates(): Promise<string[]> {
  try {
    const res = await fetch('/api/demo-plates')
    if (!res.ok) return []
    const data = await res.json()
    return (data.plates || []).map((p: { plate: string }) => p.plate)
  } catch {
    return []
  }
}
