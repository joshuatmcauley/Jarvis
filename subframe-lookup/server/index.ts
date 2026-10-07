import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import {
  demoPlates,
  getSubframesForVehicle,
  getVehicle,
  matchFitment,
  modelsForMake,
  uniqueMakes,
  vehiclesForMakeModel,
  type Subframe,
  type VehicleFitment,
} from '../shared/fitment.ts'
import { lookupDvla } from './dvla.ts'
import { lookupMot, motConfigured, yearFromMot } from './mot.ts'

const app = express()
const PORT = Number(process.env.PORT || 8787)

app.use(cors())
app.use(express.json())

function normalizeVrm(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, '')
}

function moneyParts(sf: Subframe) {
  return {
    ...sf,
    priceDisplay: new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(sf.priceGbp),
  }
}

function vehiclePayload(v: VehicleFitment) {
  return {
    id: v.id,
    make: v.make,
    model: v.model,
    years: `${v.yearFrom}–${v.yearTo}`,
    chassis: v.chassis,
    body: v.body,
    subframes: getSubframesForVehicle(v).map(moneyParts),
  }
}

function apiStatus() {
  return {
    dvla: Boolean(process.env.DVLA_API_KEY?.trim()),
    mot: motConfigured(),
    mode:
      process.env.DVLA_API_KEY?.trim() || motConfigured()
        ? 'live-keys-present'
        : 'demo-only',
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ...apiStatus() })
})

app.get('/api/catalogue/makes', (_req, res) => {
  res.json({ makes: uniqueMakes() })
})

app.get('/api/catalogue/models', (req, res) => {
  const make = String(req.query.make || '')
  res.json({ models: modelsForMake(make) })
})

app.get('/api/catalogue/vehicles', (req, res) => {
  const make = String(req.query.make || '')
  const model = String(req.query.model || '')
  res.json({
    vehicles: vehiclesForMakeModel(make, model).map((v) => ({
      id: v.id,
      years: `${v.yearFrom}–${v.yearTo}`,
      chassis: v.chassis,
    })),
  })
})

app.get('/api/lookup', async (req, res) => {
  try {
    const vrm = normalizeVrm(String(req.query.vrm || ''))
    if (!vrm) {
      res.status(400).json({ ok: false, code: 'empty', message: 'Enter a UK registration.' })
      return
    }

    // Demo plates always work — useful before API keys arrive
    const demo = demoPlates[vrm]
    if (demo) {
      const vehicle = getVehicle(demo.vehicleId)
      if (!vehicle) {
        res.status(500).json({ ok: false, code: 'config', message: 'Demo plate misconfigured.' })
        return
      }
      res.json({
        ok: true,
        result: {
          source: 'demo-plate',
          vrm,
          colour: demo.colour,
          label: demo.label,
          vehicle: vehiclePayload(vehicle),
          alternatives: [],
          disclaimer:
            'Demo plate mapped locally. Add DVLA / MOT API keys in .env for live UK lookups.',
          apis: apiStatus(),
        },
      })
      return
    }

    const hasDvla = Boolean(process.env.DVLA_API_KEY?.trim())
    const hasMot = motConfigured()

    if (!hasDvla && !hasMot) {
      res.status(404).json({
        ok: false,
        code: 'not-found',
        message:
          'No live API keys configured. Try a demo plate (AB12CDE, BK15XYZ) or add DVLA_API_KEY / MOT credentials to .env.',
        apis: apiStatus(),
        demoPlates: Object.keys(demoPlates),
      })
      return
    }

    let make = ''
    let model = ''
    let year: number | undefined
    let colour: string | undefined
    const sources: string[] = []

    if (hasDvla) {
      const dvla = await lookupDvla(vrm, process.env.DVLA_API_KEY!.trim())
      if (dvla) {
        sources.push('dvla')
        make = dvla.make || make
        year = dvla.yearOfManufacture || year
        colour = dvla.colour || colour
        if (!year && dvla.monthOfFirstRegistration) {
          const y = Number(dvla.monthOfFirstRegistration.slice(0, 4))
          if (y > 1950) year = y
        }
      }
    }

    if (hasMot) {
      const mot = await lookupMot(vrm)
      if (mot) {
        sources.push('mot')
        make = mot.make || make
        model = mot.model || model
        colour = mot.primaryColour || colour
        year = yearFromMot(mot) || year
      }
    }

    if (!make) {
      res.status(404).json({
        ok: false,
        code: 'not-found',
        message: 'No vehicle found for that registration.',
        apis: apiStatus(),
      })
      return
    }

    const matches = matchFitment({ make, model, year })
    if (!matches.length) {
      res.status(404).json({
        ok: false,
        code: 'no-fitment',
        message: `Found ${year || ''} ${make} ${model || ''}`.trim() +
          ', but that vehicle is not in the Euro Subframes catalogue yet. Add it to shared/fitment.ts or pick manually.',
        vehicleSeen: { make, model, year, colour },
        apis: apiStatus(),
      })
      return
    }

    const primary = matches[0]
    const alternatives = matches.slice(1).map(vehiclePayload)

    res.json({
      ok: true,
      result: {
        source: sources.join('+'),
        vrm,
        colour,
        label: `${year || ''} ${make} ${model}`.trim(),
        vehicle: vehiclePayload(primary),
        alternatives,
        disclaimer:
          sources.includes('mot')
            ? 'Vehicle identity from UK DVLA/MOT APIs, matched to the Euro Subframes fitment table.'
            : 'DVLA returned make/year only (no model). Fitment matched by make+year — confirm chassis before ordering, or add MOT API for model.',
        apis: apiStatus(),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lookup failed'
    console.error(message)
    res.status(502).json({ ok: false, code: 'upstream', message })
  }
})

app.get('/api/manual/:vehicleId', (req, res) => {
  const vehicle = getVehicle(req.params.vehicleId)
  if (!vehicle) {
    res.status(404).json({ ok: false, code: 'not-found', message: 'Vehicle not in catalogue.' })
    return
  }
  res.json({
    ok: true,
    result: {
      source: 'manual',
      vrm: 'MANUAL',
      label: 'Manual vehicle select',
      vehicle: vehiclePayload(vehicle),
      alternatives: [],
      disclaimer: 'Selected from the Euro Subframes catalogue.',
      apis: apiStatus(),
    },
  })
})

app.get('/api/demo-plates', (_req, res) => {
  res.json({
    plates: Object.entries(demoPlates).map(([plate, meta]) => ({
      plate,
      ...meta,
    })),
  })
})

app.listen(PORT, () => {
  console.log(`Euro Subframes API on http://localhost:${PORT}`)
  console.log(`API mode: ${apiStatus().mode}`)
})
