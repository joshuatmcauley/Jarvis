import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  adminSecret,
  cookieToken,
  isAuthed,
  isBot,
  parseDevice,
  passwordsMatch,
  readStats,
  recordVisit,
  referrerHost,
  visitorId,
} from './store.ts'

export type NodeReq = IncomingMessage & { body?: unknown }
export type NodeRes = ServerResponse

function header(req: NodeReq, name: string) {
  const raw = req.headers[name.toLowerCase()]
  return Array.isArray(raw) ? raw[0] : raw || ''
}

async function readBody(req: NodeReq): Promise<Record<string, string>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, string>
  }
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, string>
  } catch {
    return {}
  }
}

function send(res: NodeRes, status: number, body: unknown, extra?: Record<string, string>) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  res.statusCode = status
  res.setHeader('Content-Type', typeof body === 'string' ? 'text/plain' : 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  if (extra) {
    for (const [k, v] of Object.entries(extra)) res.setHeader(k, v)
  }
  res.end(payload)
}

export async function handleCollect(req: NodeReq, res: NodeRes) {
  if (req.method === 'OPTIONS') {
    send(res, 204, '')
    return
  }
  if (req.method !== 'POST') {
    send(res, 405, { error: 'method' })
    return
  }

  const ua = header(req, 'user-agent')
  if (isBot(ua)) {
    send(res, 204, '')
    return
  }

  const body = await readBody(req)
  const path = (body.path || '/').split('?')[0]
  if (path.includes('hive')) {
    send(res, 204, '')
    return
  }

  const ip =
    header(req, 'x-forwarded-for').split(',')[0].trim() ||
    header(req, 'x-real-ip') ||
    req.socket.remoteAddress ||
    ''
  const country = header(req, 'x-vercel-ip-country') || 'Unknown'
  const city = decodeURIComponent(header(req, 'x-vercel-ip-city') || '')
  const host = header(req, 'host').split(':')[0]
  const event = {
    at: new Date().toISOString(),
    path: path.slice(0, 180),
    referrer: referrerHost(body.referrer || header(req, 'referer'), host),
    country,
    city,
    device: parseDevice(ua),
    visitor: visitorId(ip, ua),
  }

  try {
    await recordVisit(event)
  } catch {
    send(res, 204, '')
    return
  }
  send(res, 204, '')
}

export async function handleLogin(req: NodeReq, res: NodeRes) {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'method' })
    return
  }
  const secret = adminSecret()
  if (!secret) {
    send(res, 503, { error: 'Set TIDY_BEE_ADMIN_SECRET on Vercel first.' })
    return
  }
  const body = await readBody(req)
  if (!passwordsMatch(body.password || '', secret)) {
    send(res, 401, { error: 'Wrong password.' })
    return
  }
  const secure = process.env.VERCEL ? '; Secure' : ''
  send(res, 200, { ok: true }, {
    'Set-Cookie': `tb_admin=${cookieToken(secret)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=1209600${secure}`,
  })
}

export async function handleLogout(req: NodeReq, res: NodeRes) {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'method' })
    return
  }
  send(res, 200, { ok: true }, {
    'Set-Cookie': 'tb_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0',
  })
}

export async function handleStats(req: NodeReq, res: NodeRes) {
  if (req.method !== 'GET') {
    send(res, 405, { error: 'method' })
    return
  }
  if (!isAuthed(header(req, 'cookie'))) {
    send(res, 401, { error: 'auth' })
    return
  }
  try {
    const stats = await readStats()
    send(res, 200, stats)
  } catch (error) {
    send(res, 500, { error: error instanceof Error ? error.message : 'stats' })
  }
}
