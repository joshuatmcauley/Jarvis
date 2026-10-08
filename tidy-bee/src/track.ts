export function trackPageview() {
  if (typeof window === 'undefined') return
  const w = window as Window & { __tbTracked?: boolean }
  if (w.__tbTracked) return
  w.__tbTracked = true
  if (window.location.pathname.includes('hive')) return

  const body = JSON.stringify({
    path: window.location.pathname || '/',
    referrer: document.referrer,
  })
  const blob = new Blob([body], { type: 'application/json' })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/collect', blob)
    return
  }
  void fetch('/api/collect', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
  })
}
