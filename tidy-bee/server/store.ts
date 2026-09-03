import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { CountRow, DayRow, Stats, VisitEvent } from '../src/statsTypes.ts'

export type { CountRow, DayRow, Stats, VisitEvent }

type FileDump = {
  views: number
  visitors: string[]
  days: Record<string, { views: number; visitors: string[] }>
  pages: Record<string, number>
  referrers: Record<string, number>
  countries: Record<string, number>
  devices: Record<string, number>
  events: VisitEvent[]
}

const EVENT_CAP = 250
const BOT =
  /bot|spider|crawl|preview|facebookexternalhit|slurp|bingpreview|lighthouse|headless|pingdom/i

function redisEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ''), token }
}

function filePath() {
  return join(process.cwd(), '.data', 'analytics.json')
}

function todayStamp(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function dayList(n: number) {
  const days: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function emptyDump(): FileDump {
  return {
    views: 0,
    visitors: [],
    days: {},
    pages: {},
    referrers: {},
    countries: {},
    devices: {},
    events: [],
  }
}

async function readDump(): Promise<FileDump> {
  try {
    const raw = await readFile(filePath(), 'utf8')
    return { ...emptyDump(), ...(JSON.parse(raw) as FileDump) }
  } catch {
    return emptyDump()
  }
}

async function writeDump(dump: FileDump) {
  const path = filePath()
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(dump))
}

async function redis(commands: unknown[][]) {
  const env = redisEnv()
  if (!env) throw new Error('redis missing')
  const res = await fetch(`${env.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  })
  if (!res.ok) throw new Error(`redis ${res.status}`)
  return (await res.json()) as { result: unknown }[]
}

function topMap(map: Record<string, number>, limit = 8): CountRow[] {
  return Object.entries(map)
    .filter(([name]) => name)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, views]) => ({ name, views }))
}

function hashVisitor(ip: string, ua: string) {
  const salt = process.env.TIDY_BEE_ADMIN_SECRET || 'local-salt'
  return createHash('sha256').update(`${salt}|${ip}|${ua}`).digest('hex').slice(0, 20)
}

export function parseDevice(ua: string) {
  if (/iPad|Tablet/i.test(ua)) return 'Tablet'
  if (/Mobi|Android/i.test(ua)) return 'Phone'
  return 'Desktop'
}

export function isBot(ua: string) {
  return !ua || BOT.test(ua)
}

export function visitorId(ip: string, ua: string) {
  return hashVisitor(ip || '0', ua || 'unknown')
}

export function referrerHost(referrer: string, siteHost: string) {
  if (!referrer) return 'Direct'
  try {
    const host = new URL(referrer).host.replace(/^www\./, '')
    if (host === siteHost.replace(/^www\./, '')) return 'Direct'
    return host
  } catch {
    return 'Direct'
  }
}

export function storageMode(): Stats['storage'] {
  if (redisEnv()) return 'redis'
  if (process.env.VERCEL) return 'none'
  return 'file'
}

export async function recordVisit(event: VisitEvent & { visitor: string }) {
  const mode = storageMode()
  if (mode === 'none') return
  const day = event.at.slice(0, 10)

  if (mode === 'redis') {
    await redis([
      ['INCR', 'tb:views'],
      ['SADD', 'tb:visitors', event.visitor],
      ['INCR', `tb:day:${day}:views`],
      ['SADD', `tb:day:${day}:visitors`, event.visitor],
      ['HINCRBY', 'tb:pages', event.path, '1'],
      ['HINCRBY', 'tb:ref', event.referrer, '1'],
      ['HINCRBY', 'tb:cc', event.country || 'Unknown', '1'],
      ['HINCRBY', 'tb:dev', event.device, '1'],
      ['LPUSH', 'tb:events', JSON.stringify(event)],
      ['LTRIM', 'tb:events', '0', String(EVENT_CAP - 1)],
    ])
    return
  }

  const dump = await readDump()
  dump.views += 1
  if (!dump.visitors.includes(event.visitor)) dump.visitors.push(event.visitor)
  const bucket = dump.days[day] ?? { views: 0, visitors: [] }
  bucket.views += 1
  if (!bucket.visitors.includes(event.visitor)) bucket.visitors.push(event.visitor)
  dump.days[day] = bucket
  dump.pages[event.path] = (dump.pages[event.path] ?? 0) + 1
  dump.referrers[event.referrer] = (dump.referrers[event.referrer] ?? 0) + 1
  dump.countries[event.country || 'Unknown'] = (dump.countries[event.country || 'Unknown'] ?? 0) + 1
  dump.devices[event.device] = (dump.devices[event.device] ?? 0) + 1
  dump.events.unshift(event)
  dump.events = dump.events.slice(0, EVENT_CAP)
  await writeDump(dump)
}

function hashToRecord(value: unknown): Record<string, number> {
  const out: Record<string, number> = {}
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 2) {
      out[String(value[i])] = Number(value[i + 1]) || 0
    }
    return out
  }
  if (!value || typeof value !== 'object') return out
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = Number(v) || 0
  }
  return out
}

export async function readStats(): Promise<Stats> {
  const mode = storageMode()
  const generatedAt = new Date().toISOString()
  const days = dayList(14)
  const today = todayStamp()
  const last7 = days.slice(-7)

  if (mode === 'none') {
    return {
      storage: 'none',
      generatedAt,
      today: { views: 0, uniques: 0 },
      last7: { views: 0, uniques: 0 },
      allTime: { views: 0, uniques: 0 },
      days: days.map((date) => ({ date, views: 0, uniques: 0 })),
      pages: [],
      referrers: [],
      countries: [],
      devices: [],
      recent: [],
    }
  }

  if (mode === 'file') {
    const dump = await readDump()
    const dayRows = days.map((date) => {
      const row = dump.days[date]
      return { date, views: row?.views ?? 0, uniques: row?.visitors.length ?? 0 }
    })
    return {
      storage: 'file',
      generatedAt,
      today: {
        views: dump.days[today]?.views ?? 0,
        uniques: dump.days[today]?.visitors.length ?? 0,
      },
      last7: {
        views: last7.reduce((s, d) => s + (dump.days[d]?.views ?? 0), 0),
        uniques: last7.reduce((s, d) => s + (dump.days[d]?.visitors.length ?? 0), 0),
      },
      allTime: { views: dump.views, uniques: dump.visitors.length },
      days: dayRows,
      pages: topMap(dump.pages),
      referrers: topMap(dump.referrers),
      countries: topMap(dump.countries),
      devices: topMap(dump.devices),
      recent: dump.events.slice(0, 40),
    }
  }

  const cmds: unknown[][] = [
    ['GET', 'tb:views'],
    ['SCARD', 'tb:visitors'],
    ['HGETALL', 'tb:pages'],
    ['HGETALL', 'tb:ref'],
    ['HGETALL', 'tb:cc'],
    ['HGETALL', 'tb:dev'],
    ['LRANGE', 'tb:events', '0', '39'],
  ]
  for (const date of days) {
    cmds.push(['GET', `tb:day:${date}:views`], ['SCARD', `tb:day:${date}:visitors`])
  }
  const rows = await redis(cmds)
  const num = (i: number) => Number(rows[i]?.result ?? 0) || 0
  const dayRows = days.map((date, i) => ({
    date,
    views: num(7 + i * 2),
    uniques: num(8 + i * 2),
  }))
  const recentRaw = rows[6]?.result
  const recent: VisitEvent[] = Array.isArray(recentRaw)
    ? recentRaw
        .map((item) => {
          try {
            return JSON.parse(String(item)) as VisitEvent
          } catch {
            return null
          }
        })
        .filter((item): item is VisitEvent => !!item)
    : []

  return {
    storage: 'redis',
    generatedAt,
    today: dayRows.find((d) => d.date === today) ?? { views: 0, uniques: 0 },
    last7: {
      views: dayRows.slice(-7).reduce((s, d) => s + d.views, 0),
      uniques: dayRows.slice(-7).reduce((s, d) => s + d.uniques, 0),
    },
    allTime: { views: num(0), uniques: num(1) },
    days: dayRows,
    pages: topMap(hashToRecord(rows[2]?.result)),
    referrers: topMap(hashToRecord(rows[3]?.result)),
    countries: topMap(hashToRecord(rows[4]?.result)),
    devices: topMap(hashToRecord(rows[5]?.result)),
    recent,
  }
}

export function adminSecret() {
  return process.env.TIDY_BEE_ADMIN_SECRET || (process.env.VERCEL ? '' : 'local-dev-only')
}

export function cookieToken(secret: string) {
  return createHmac('sha256', secret).update('tidy-bee-admin').digest('hex')
}

export function passwordsMatch(input: string, secret: string) {
  const a = Buffer.from(input)
  const b = Buffer.from(secret)
  if (!secret || a.length !== b.length) {
    return false
  }
  return timingSafeEqual(a, b)
}

export function parseCookie(header: string | undefined, name: string) {
  if (!header) return ''
  const parts = header.split(';')
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return rest.join('=')
  }
  return ''
}

export function isAuthed(cookieHeader: string | undefined) {
  const secret = adminSecret()
  if (!secret) return false
  const got = parseCookie(cookieHeader, 'tb_admin')
  const expect = cookieToken(secret)
  try {
    return timingSafeEqual(Buffer.from(got), Buffer.from(expect))
  } catch {
    return false
  }
}
