import { createHmac } from 'node:crypto'

const API_VERSION = 'v1'
const MAX_REQUEST_BYTES = 128 * 1024

export async function requestChannelApi(
  path: string,
  options: { method?: 'GET' | 'POST'; query?: URLSearchParams; body?: unknown } = {},
): Promise<Response> {
  const baseUrl = process.env.EXTERNAL_API_URL
  const secret = process.env.EXTERNAL_API_KEY
  if (!baseUrl || !secret) {
    return Response.json({ message: 'External channel API is not configured', data: null }, { status: 503 })
  }

  const method = options.method ?? 'GET'
  const body = options.body === undefined ? '' : JSON.stringify(options.body)
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) {
    return Response.json({ message: 'Request body is too large' }, { status: 413 })
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signature = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')
  const target = new URL(`/api/${API_VERSION}/${path.replace(/^\/+/, '')}`, baseUrl)
  if (options.query) target.search = options.query.toString()

  let response: Response
  try {
    response = await fetch(target, {
      method,
      headers: {
        'X-Signature': signature,
        'X-Timestamp': timestamp,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body || undefined,
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })
  } catch {
    return Response.json({ message: 'External channel API is unavailable', data: null }, { status: 502 })
  }

  const payload = await response.arrayBuffer()
  return new Response(payload, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export function copyQuery(request: Request, allowed: readonly string[]): URLSearchParams {
  const input = new URL(request.url).searchParams
  const result = new URLSearchParams()
  for (const key of allowed) {
    const value = input.get(key)
    if (value !== null) result.set(key, value)
  }
  return result
}

export async function parseJsonBody(request: Request): Promise<{ value?: unknown; error?: Response }> {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_REQUEST_BYTES) {
    return { error: Response.json({ message: 'Request body is too large' }, { status: 413 }) }
  }

  let text: string
  try {
    text = await request.text()
  } catch {
    return { error: Response.json({ message: 'Invalid request body' }, { status: 400 }) }
  }
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
    return { error: Response.json({ message: 'Request body is too large' }, { status: 413 }) }
  }
  try {
    return { value: JSON.parse(text) as unknown }
  } catch {
    return { error: Response.json({ message: 'Invalid JSON body' }, { status: 400 }) }
  }
}
