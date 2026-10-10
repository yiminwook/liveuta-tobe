export function jsonResponse<T>(body: T, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export function apiError(message: string, status: number): Response {
  return jsonResponse({ message, data: null }, status)
}

const requestCounts = new Map<string, { count: number; resetAt: number }>()

/** Process-local guard for low-volume diagnostic endpoints. */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const current = requestCounts.get(key)

  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  current.count += 1
  return current.count > limit
}

export function getClientAddress(request: Request): string {
  // Forwarding headers are client-controlled unless the deployment has a trusted proxy.
  return process.env.TRUST_PROXY_HEADERS === 'true'
    ? request.headers.get('x-real-ip') ?? 'unknown'
    : 'unproxied'
}
