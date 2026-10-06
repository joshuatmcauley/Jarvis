import { useState, type FormEvent } from 'react'
import './App.css'
import {
  DEMO_PLATE_HINTS,
  lookupManual,
  lookupRegistration,
  type LookupResult,
} from './lib/lookup'
import {
  modelsForMake,
  uniqueMakes,
  vehiclesForMakeModel,
} from './data/fitment'

function money(aud: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(aud)
}

export default function App() {
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LookupResult | null>(null)

  const makes = uniqueMakes()
  const [make, setMake] = useState(makes[0] ?? '')
  const models = modelsForMake(make)
  const [model, setModel] = useState(models[0] ?? '')
  const yearOptions = vehiclesForMakeModel(make, model)
  const [vehicleId, setVehicleId] = useState(yearOptions[0]?.id ?? '')

  function syncMake(next: string) {
    setMake(next)
    const nextModels = modelsForMake(next)
    const nextModel = nextModels[0] ?? ''
    setModel(nextModel)
    const nextVehicles = vehiclesForMakeModel(next, nextModel)
    setVehicleId(nextVehicles[0]?.id ?? '')
  }

  function syncModel(next: string) {
    setModel(next)
    const nextVehicles = vehiclesForMakeModel(make, next)
    setVehicleId(nextVehicles[0]?.id ?? '')
  }

  async function runLookup(value: string) {
    setLoading(true)
    setError(null)
    setResult(null)
    const response = await lookupRegistration(value)
    setLoading(false)
    if (!response.ok) {
      setError(response.message)
      return
    }
    setResult(response.result)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await runLookup(plate)
  }

  function onManual() {
    setLoading(false)
    setError(null)
    const response = lookupManual(vehicleId)
    if (!response.ok) {
      setError(response.message)
      setResult(null)
      return
    }
    setResult(response.result)
  }

  return (
    <div className="app">
      <header className="nav">
        <a className="nav-brand" href="#top">
          SUBFORM
        </a>
        <a className="nav-link" href="#lookup">
          Check fitment
        </a>
      </header>

      <section className="hero" id="top" aria-label="SUBFORM hero">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-inner">
          <p className="brand-mark">SUBFORM</p>
          <div className="hero-copy">
            <h1>Enter your rego. See the subframe your car takes.</h1>
            <p>
              Built for workshops and owners replacing rusted or damaged
              underbodies — matched to make, model, and series.
            </p>
          </div>
          <div className="cta-row">
            <a className="btn btn-primary" href="#lookup">
              Look up a plate
            </a>
            <a className="btn btn-ghost" href="#how">
              How it works
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="lookup">
        <div className="section-head">
          <h2>Registration lookup</h2>
          <p>
            Type a plate to pull vehicle details and matching subframe SKUs.
            This concept uses demo plates locally; a live build would call a
            commercial rego API. 17-character VINs try the free NHTSA decoder.
          </p>
        </div>

        <div className="lookup-panel">
          <form className="lookup-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="plate">Registration or VIN</label>
              <input
                id="plate"
                name="plate"
                inputMode="text"
                autoComplete="off"
                placeholder="e.g. ABC123"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                disabled={loading}
              />
            </div>
            <button className="btn btn-dark" type="submit" disabled={loading}>
              {loading ? 'Looking up…' : 'Find subframe'}
            </button>
          </form>

          <div className="hints" aria-label="Demo plates">
            <span className="hints-label">Try demo plates:</span>
            {DEMO_PLATE_HINTS.slice(0, 6).map((hint) => (
              <button
                key={hint}
                type="button"
                className="chip"
                onClick={() => {
                  setPlate(hint)
                  void runLookup(hint)
                }}
                disabled={loading}
              >
                {hint}
              </button>
            ))}
          </div>

          <div className="status" role="status" aria-live="polite">
            {loading && (
              <span className="status-loading">
                <span className="spinner" aria-hidden="true" />
                Checking vehicle records…
              </span>
            )}
            {!loading && error && <span className="status-error">{error}</span>}
          </div>

          <div className="divider">or pick the vehicle</div>

          <div className="manual-grid">
            <div className="field">
              <label htmlFor="make">Make</label>
              <select
                id="make"
                value={make}
                onChange={(e) => syncMake(e.target.value)}
              >
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="model">Model</label>
              <select
                id="model"
                value={model}
                onChange={(e) => syncModel(e.target.value)}
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="years">Years / series</label>
              <select
                id="years"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                {yearOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.years}
                    {v.series ? ` · ${v.series}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="button" onClick={onManual}>
              Show fitment
            </button>
          </div>

          {result && (
            <div className="results">
              <div className="vehicle-strip">
                <div className="plate">
                  {result.plateOrVin === 'MANUAL' ? 'MANUAL' : result.plateOrVin}
                </div>
                <div className="meta">
                  {result.vehicle.make} {result.vehicle.model}
                  {result.vehicle.series ? ` · ${result.vehicle.series}` : ''}
                  {' · '}
                  {result.vehicle.years}
                  {result.colour ? ` · ${result.colour}` : ''}
                </div>
                <div className="source">
                  {result.source === 'demo-plate' && 'Demo plate match'}
                  {result.source === 'vin-nhtsa' && 'VIN · NHTSA'}
                  {result.source === 'manual' && 'Manual select'}
                </div>
              </div>

              <div className="subframe-list">
                {result.subframes.map((sf) => (
                  <article key={sf.sku} className="subframe-row">
                    <div>
                      <h3>{sf.name}</h3>
                      <div className="sku">{sf.sku}</div>
                      <ul className="facts">
                        <li>
                          Position: <span>{sf.position}</span>
                        </li>
                        <li>
                          Material: <span>{sf.material}</span>
                        </li>
                        <li>
                          Finish: <span>{sf.finish}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="price">{money(sf.priceAud)}</p>
                      <p className="notes">{sf.notes}</p>
                      <button type="button" className="btn btn-dark">
                        Enquire about this part
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <p className="disclaimer">{result.disclaimer}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section how" id="how">
        <div className="section-head">
          <h2>How a live version would work</h2>
          <p>
            Same customer flow — plate in, subframe out — with a real vehicle
            data feed behind it.
          </p>
        </div>
        <ol className="steps">
          <li>
            <h3>Read the plate</h3>
            <p>
              Call a commercial rego/vehicle API for your market (AU/NZ partner,
              UK DVLA, etc.) to get make, model, year, and series.
            </p>
          </li>
          <li>
            <h3>Match the catalogue</h3>
            <p>
              Map that vehicle onto your subframe SKUs — the same table this
              concept already uses for Hilux, Ranger, Commodore, and more.
            </p>
          </li>
          <li>
            <h3>Sell the part</h3>
            <p>
              Show price, notes, and an enquire/checkout path so the customer
              orders the right front or rear member first time.
            </p>
          </li>
        </ol>
      </section>

      <footer className="footer">
        <strong>SUBFORM</strong> · concept fitment lookup · not a live shop
      </footer>
    </div>
  )
}
