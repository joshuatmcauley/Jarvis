type TokenCache = { token: string; expiresAt: number }

let tokenCache: TokenCache | null = null

export type MotVehicle = {
  registration?: string
  make?: string
  model?: string
  fuelType?: string
  primaryColour?: string
  engineSize?: string | number
  manufactureYear?: string | number
  manufactureDate?: string
  firstUsedDate?: string
  registrationDate?: string
  motTests?: unknown[]
}

function env(name: string): string | undefined {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : undefined
}

export function motConfigured(): boolean {
  return Boolean(
    env('MOT_CLIENT_ID') &&
      env('MOT_CLIENT_SECRET') &&
      env('MOT_API_KEY') &&
      env('MOT_TOKEN_URL'),
  )
}

async function getMotAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token
  }

  const tokenUrl = env('MOT_TOKEN_URL')!
  const clientId = env('MOT_CLIENT_ID')!
  const clientSecret = env('MOT_CLIENT_SECRET')!
  const scope = env('MOT_SCOPE') || 'https://tapi.dvsa.gov.uk/.default'

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope,
  })

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`MOT token error ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in?: number }
  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in || 3600) * 1000,
  }
  return data.access_token
}

export async function lookupMot(vrm: string): Promise<MotVehicle | null> {
  if (!motConfigured()) return null

  const token = await getMotAccessToken()
  const apiKey = env('MOT_API_KEY')!
  const url = `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${encodeURIComponent(vrm)}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-API-Key': apiKey,
      Accept: 'application/json',
    },
  })

  if (res.status === 404) return null
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`MOT error ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  // Some responses are a single object; older shapes were arrays
  if (Array.isArray(data)) return (data[0] as MotVehicle) || null
  return data as MotVehicle
}

export function yearFromMot(mot: MotVehicle): number | undefined {
  if (mot.manufactureYear) {
    const y = Number(mot.manufactureYear)
    if (y > 1950) return y
  }
  for (const key of ['manufactureDate', 'firstUsedDate', 'registrationDate'] as const) {
    const raw = mot[key]
    if (!raw) continue
    const m = String(raw).match(/(19|20)\d{2}/)
    if (m) return Number(m[0])
  }
  return undefined
}
