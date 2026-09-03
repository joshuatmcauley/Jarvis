import { useMemo, useState } from 'react'
import { extras, packages, whatsappHref } from './content'

type ExtraId = (typeof extras)[number]['id']

const extraLookup = Object.fromEntries(extras.map((item) => [item.id, item])) as Record<
  ExtraId,
  (typeof extras)[number]
>

export function QuoteBuilder() {
  const [packageId, setPackageId] = useState<(typeof packages)[number]['id']>('standard')
  const [selected, setSelected] = useState<Partial<Record<ExtraId, number>>>({})
  const [firstClean, setFirstClean] = useState(true)

  const pkg = packages.find((item) => item.id === packageId) ?? packages[0]

  const extrasTotal = useMemo(() => {
    return (Object.entries(selected) as [ExtraId, number][]).reduce((sum, [id, qty]) => {
      if (!qty) return sum
      return sum + extraLookup[id].price * qty
    }, 0)
  }, [selected])

  const subtotal = pkg.from + extrasTotal
  const discount = firstClean ? subtotal * 0.1 : 0
  const total = Math.round((subtotal - discount) * 100) / 100

  const message = useMemo(() => {
    const extraNames = (Object.entries(selected) as [ExtraId, number][])
      .filter(([, qty]) => qty)
      .map(([id, qty]) => {
        const item = extraLookup[id]
        return item.unit === 'hour' ? `${item.name} × ${qty}hr` : item.name
      })
    const extraLine = extraNames.length ? extraNames.join(', ') : 'no extras'
    const offer = firstClean ? ' Please apply 10% off my first clean.' : ''
    return `Hi, I'd like to book a ${pkg.name} (from £${pkg.from}) with ${extraLine}. Estimate £${total}.${offer}`
  }, [firstClean, pkg.from, pkg.name, selected, total])

  function toggle(id: ExtraId) {
    setSelected((prev) => {
      const current = prev[id] ?? 0
      if (extraLookup[id].unit === 'hour') {
        return { ...prev, [id]: current ? 0 : 1 }
      }
      return { ...prev, [id]: current ? 0 : 1 }
    })
  }

  function bumpHours(delta: number) {
    setSelected((prev) => {
      const next = Math.max(0, (prev.ironing ?? 0) + delta)
      return { ...prev, ironing: next }
    })
  }

  return (
    <div className="quote">
      <div className="quote-copy">
        <p className="eyebrow">Instant estimate</p>
        <h2>Build a tidy little quote.</h2>
        <p className="lede">
          Prices start from the figures on her price list and may vary with the size and
          condition of the property. This is a guide — she will confirm after a quick chat.
        </p>
      </div>

      <div className="quote-panel">
        <div className="pkg-pills" role="tablist" aria-label="Choose a clean">
          {packages.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={packageId === item.id}
              className={packageId === item.id ? 'pkg-pill is-on' : 'pkg-pill'}
              onClick={() => setPackageId(item.id)}
            >
              {item.name}
              <span>from £{item.from}</span>
            </button>
          ))}
        </div>

        <ul className="extra-checks">
          {extras.map((item) => {
            const qty = selected[item.id] ?? 0
            const on = qty > 0
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={on ? 'check is-on' : 'check'}
                  onClick={() => toggle(item.id)}
                  aria-pressed={on}
                >
                  <span className="tick" />
                  <span>
                    {item.name}
                    <em>
                      {item.unit === 'from' ? 'from ' : ''}£{item.price}
                      {item.unit === 'hour' ? '/hr' : ''}
                    </em>
                  </span>
                </button>
                {item.id === 'ironing' && on ? (
                  <div className="hours">
                    <button type="button" onClick={() => bumpHours(-1)} aria-label="Less ironing time">
                      −
                    </button>
                    <span>{qty} hr</span>
                    <button type="button" onClick={() => bumpHours(1)} aria-label="More ironing time">
                      +
                    </button>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>

        <label className="offer-toggle">
          <input
            type="checkbox"
            checked={firstClean}
            onChange={(event) => setFirstClean(event.target.checked)}
          />
          Apply 10% off first clean
        </label>

        <div className="quote-total">
          <div>
            <span>Estimated total</span>
            <strong>£{total.toFixed(2)}</strong>
          </div>
          {firstClean ? <small>Includes 10% welcome offer</small> : null}
        </div>

        <a className="btn btn-honey" href={whatsappHref(message)}>
          Book this on WhatsApp
        </a>
      </div>
    </div>
  )
}
