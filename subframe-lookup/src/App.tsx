import { useEffect, useRef, useState, type FormEvent } from 'react'
import './App.css'
import {
  fetchDemoPlates,
  lookupManual,
  lookupRegistration,
  type LookupResult,
} from './services/lookup'
import {
  modelsForMake,
  uniqueMakes,
  vehiclesForMakeModel,
} from './data/fitment'

export default function App() {
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LookupResult | null>(null)
  const [demoHints, setDemoHints] = useState<string[]>([
    'AB12CDE',
    'BK15XYZ',
    'MF64AUD',
    'LN11FRD',
    'VU13AST',
    'RO17MER',
  ])
  const resultsRef = useRef<HTMLDivElement>(null)

  const makes = uniqueMakes()
  const [make, setMake] = useState(makes[0] ?? '')
  const models = modelsForMake(make)
  const [model, setModel] = useState(models[0] ?? '')
  const yearOptions = vehiclesForMakeModel(make, model)
  const [vehicleId, setVehicleId] = useState(yearOptions[0]?.id ?? '')

  useEffect(() => {
    void fetchDemoPlates().then((plates) => {
      if (plates.length) setDemoHints(plates.slice(0, 8))
    })
  }, [])

  useEffect(() => {
    if (result) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

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
    try {
      const response = await lookupRegistration(value)
      if (!response.ok) {
        setError(response.message)
        return
      }
      setResult(response.result)
    } catch {
      setError('Could not reach the lookup API. Is the server running? (npm run dev)')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await runLookup(plate)
  }

  async function onManual() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await lookupManual(vehicleId)
      if (!response.ok) {
        setError(response.message)
        return
      }
      setResult(response.result)
    } catch {
      setError('Could not reach the lookup API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="nav">
        <a className="nav-brand" href="#top">
          EURO SUBFRAMES
        </a>
        <a className="nav-link" href="#lookup">
          Check fitment
        </a>
      </header>

      <section className="hero" id="top" aria-label="Euro Subframes hero">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-inner">
          <p className="brand-mark">EURO SUBFRAMES</p>
          <div className="hero-copy">
            <h1>Enter your reg. See the subframe your car takes.</h1>
            <p>
              UK plate lookup for Volkswagen, Audi, BMW, Mercedes and more —
              matched to Euro Subframes stock.
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
          <h2>UK registration lookup</h2>
          <p>
            Enter a UK number plate. With DVLA + MOT API keys configured, we
            identify the vehicle and match it to subframe SKUs. Without keys,
            demo plates still work so you can show the client the flow.
          </p>
        </div>

        <div className="lookup-panel">
          <form className="lookup-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="plate">Registration</label>
              <input
                id="plate"
                name="plate"
                inputMode="text"
                autoComplete="off"
                placeholder="e.g. AB12 CDE"
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
            {demoHints.map((hint) => (
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
                Checking UK vehicle records…
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
              <label htmlFor="years">Years / chassis</label>
              <select
                id="years"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                {yearOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.yearFrom}–{v.yearTo}
                    {v.chassis ? ` · ${v.chassis}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="button" onClick={() => void onManual()}>
              Show fitment
            </button>
          </div>

          {result && (
            <div className="results" ref={resultsRef}>
              <div className="vehicle-strip">
                <div className="plate">
                  {result.vrm === 'MANUAL' ? 'MANUAL' : result.vrm}
                </div>
                <div className="meta">
                  {result.vehicle.make} {result.vehicle.model}
                  {result.vehicle.chassis ? ` · ${result.vehicle.chassis}` : ''}
                  {' · '}
                  {result.vehicle.years}
                  {result.colour ? ` · ${result.colour}` : ''}
                </div>
                <div className="source">{result.source.replace('+', ' · ')}</div>
              </div>

              <div className="subframe-list">
                {result.vehicle.subframes.map((sf) => (
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
                      <p className="price">{sf.priceDisplay}</p>
                      <p className="notes">{sf.notes}</p>
                      <button type="button" className="btn btn-dark">
                        Enquire about this part
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {result.alternatives?.length > 0 && (
                <p className="disclaimer">
                  Other close catalogue matches:{' '}
                  {result.alternatives
                    .map(
                      (a) =>
                        `${a.make} ${a.model} (${a.chassis || a.years})`,
                    )
                    .join(' · ')}
                  . Confirm chassis before ordering.
                </p>
              )}

              <p className="disclaimer">{result.disclaimer}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section how" id="how">
        <div className="section-head">
          <h2>How live UK lookup works</h2>
          <p>
            Free government APIs identify the car; your fitment table picks the
            subframe.
          </p>
        </div>
        <ol className="steps">
          <li>
            <h3>Read the plate</h3>
            <p>
              DVLA Vehicle Enquiry + DVSA MOT history return make, model, year
              and colour for a UK VRM. Keys go in <code>.env</code> on the
              server only.
            </p>
          </li>
          <li>
            <h3>Match Euro Subframes stock</h3>
            <p>
              We map that vehicle onto chassis-based SKUs (Golf Mk7, BMW F30,
              A4 B8, C-Class W205, and so on) in <code>shared/fitment.ts</code>.
            </p>
          </li>
          <li>
            <h3>Swap in real SKUs</h3>
            <p>
              Replace the placeholder catalogue with the client’s real part
              numbers and prices — same lookup flow.
            </p>
          </li>
        </ol>
      </section>

      <footer className="footer">
        <strong>EURO SUBFRAMES</strong> · UK fitment lookup concept
      </footer>
    </div>
  )
}
