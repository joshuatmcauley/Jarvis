export type DvlaVehicle = {
  registrationNumber: string
  make?: string
  colour?: string
  fuelType?: string
  yearOfManufacture?: number
  monthOfFirstRegistration?: string
  engineCapacity?: number
  motStatus?: string
  taxStatus?: string
}

export async function lookupDvla(vrm: string, apiKey: string): Promise<DvlaVehicle | null> {
  const res = await fetch(
    'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
    {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registrationNumber: vrm }),
    },
  )

  if (res.status === 404) return null
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`DVLA error ${res.status}: ${text.slice(0, 200)}`)
  }

  return (await res.json()) as DvlaVehicle
}
