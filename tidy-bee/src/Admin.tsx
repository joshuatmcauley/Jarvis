import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Stats } from './statsTypes.ts'

function fmt(n: number) {
  return new Intl.NumberFormat('en-GB').format(n)
}

function timeLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Admin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadStats() {
    const res = await fetch('/api/stats', { credentials: 'include' })
    if (res.status === 401) {
      setAuthed(false)
      setStats(null)
      return false
    }
    if (!res.ok) {
      setError('Could not load stats.')
      return false
    }
    setStats((await res.json()) as Stats)
    setAuthed(true)
    setError('')
    return true
  }

  useEffect(() => {
    void loadStats().finally(() => setLoading(false))
    const id = window.setInterval(() => {
      void loadStats()
    }, 20000)
    return () => window.clearInterval(id)
  }, [])

  async function onLogin(event: FormEvent) {
    event.preventDefault()
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      setError(body.error || 'Wrong password.')
      return
    }
    setPassword('')
    await loadStats()
  }

  async function onLogout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    setAuthed(false)
    setStats(null)
  }

  const maxDay = useMemo(() => {
    if (!stats?.days.length) return 1
    return Math.max(1, ...stats.days.map((d) => d.views))
  }, [stats])

  if (loading) {
    return (
      <main className="admin">
        <p className="admin-muted">Checking the hive…</p>
      </main>
    )
  }

  if (!authed) {
    return (
      <main className="admin">
        <p className="eyebrow">Private</p>
        <h1>The hive</h1>
        <p className="lede">Site activity. Not linked from the public pages.</p>
        <form className="admin-login" onSubmit={onLogin}>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <button className="btn btn-honey" type="submit">
            Open stats
          </button>
        </form>
      </main>
    )
  }

  if (!stats) {
    return (
      <main className="admin">
        <p className="admin-error">{error || 'No data yet.'}</p>
      </main>
    )
  }

  return (
    <main className="admin">
      <header className="admin-head">
        <div>
          <p className="eyebrow">The hive</p>
          <h1>Who’s been buzzing.</h1>
          <p className="admin-muted">
            {stats.storage === 'none'
              ? 'Counts are not saving yet — add Upstash Redis on Vercel (see deploy/CLOUD.md).'
              : stats.storage === 'file'
                ? 'Saving locally on this machine.'
                : 'Live from the site. IPs are hashed, not stored.'}{' '}
            Refreshes every 20s.
          </p>
        </div>
        <button className="btn btn-ghost" type="button" onClick={() => void onLogout()}>
          Lock
        </button>
      </header>

      <section className="admin-kpis">
        <article>
          <span>Today</span>
          <strong>{fmt(stats.today.views)}</strong>
          <em>{fmt(stats.today.uniques)} people</em>
        </article>
        <article>
          <span>Last 7 days</span>
          <strong>{fmt(stats.last7.views)}</strong>
          <em>{fmt(stats.last7.uniques)} daily uniques*</em>
        </article>
        <article>
          <span>All time</span>
          <strong>{fmt(stats.allTime.views)}</strong>
          <em>{fmt(stats.allTime.uniques)} people</em>
        </article>
      </section>
      <p className="admin-note">*7-day people adds each day’s uniques, so repeat visitors count again.</p>

      <section className="admin-card">
        <h2>Last 14 days</h2>
        <div className="admin-bars">
          {stats.days.map((day) => (
            <div key={day.date} className="admin-bar">
              <span
                style={{ height: `${Math.max(6, (day.views / maxDay) * 100)}%` }}
                title={`${day.date}: ${day.views} views`}
              />
              <small>{day.date.slice(8)}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-grid">
        <article className="admin-card">
          <h2>Pages</h2>
          <ul>
            {stats.pages.length ? (
              stats.pages.map((row) => (
                <li key={row.name}>
                  <span>{row.name}</span>
                  <b>{fmt(row.views)}</b>
                </li>
              ))
            ) : (
              <li className="admin-muted">No pageviews yet.</li>
            )}
          </ul>
        </article>
        <article className="admin-card">
          <h2>How they arrived</h2>
          <ul>
            {stats.referrers.length ? (
              stats.referrers.map((row) => (
                <li key={row.name}>
                  <span>{row.name}</span>
                  <b>{fmt(row.views)}</b>
                </li>
              ))
            ) : (
              <li className="admin-muted">No referrers yet.</li>
            )}
          </ul>
        </article>
        <article className="admin-card">
          <h2>Places</h2>
          <ul>
            {stats.countries.length ? (
              stats.countries.map((row) => (
                <li key={row.name}>
                  <span>{row.name}</span>
                  <b>{fmt(row.views)}</b>
                </li>
              ))
            ) : (
              <li className="admin-muted">Country shows after a Vercel visit.</li>
            )}
          </ul>
        </article>
        <article className="admin-card">
          <h2>Devices</h2>
          <ul>
            {stats.devices.length ? (
              stats.devices.map((row) => (
                <li key={row.name}>
                  <span>{row.name}</span>
                  <b>{fmt(row.views)}</b>
                </li>
              ))
            ) : (
              <li className="admin-muted">No devices yet.</li>
            )}
          </ul>
        </article>
      </section>

      <section className="admin-card">
        <h2>Recent visits</h2>
        <ul className="admin-feed">
          {stats.recent.length ? (
            stats.recent.map((item, i) => (
              <li key={`${item.at}-${i}`}>
                <time>{timeLabel(item.at)}</time>
                <span>{item.path}</span>
                <span>{item.city ? `${item.city}, ${item.country}` : item.country}</span>
                <span>
                  {item.device} · {item.referrer}
                </span>
              </li>
            ))
          ) : (
            <li className="admin-muted">Nobody yet — open the homepage in another tab.</li>
          )}
        </ul>
      </section>
    </main>
  )
}
