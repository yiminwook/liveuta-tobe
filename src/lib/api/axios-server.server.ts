import '@tanstack/react-start/server-only'
import { createHmac } from 'node:crypto'
import axios from 'axios'

const getTimestamp = () => Math.floor(Date.now() / 1000).toString()

export const serverAxios = axios.create({
  baseURL: `${process.env.EXTERNAL_API_URL}/api/v1/`,
  timeout: 10_000,
})

serverAxios.interceptors.request.use((config) => {
  const secret = process.env.EXTERNAL_API_KEY
  if (!secret) throw new Error('EXTERNAL_API_KEY is not configured')

  const body =
    config.data == null
      ? ''
      : typeof config.data === 'string'
        ? config.data
        : JSON.stringify(config.data)
  const timestamp = getTimestamp()
  if (body) {
    config.data = body
    config.headers.set('Content-Type', 'application/json')
  }
  config.headers.set(
    'X-Signature',
    createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex'),
  )
  config.headers.set('X-Timestamp', timestamp)
  return config
})

serverAxios.interceptors.response.use(
  (response) => {
    if (response.status >= 400) {
      console.error('[serverAxios] HTTP response error', {
        method: response.config.method,
        url: response.config.url,
        status: response.status,
      })
    }
    return response
  },
  (error: unknown) => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message ?? error.message
      if (message) error.message = message
      console.error('[serverAxios]', {
        method: error.config?.method,
        url: error.config?.url,
        status,
        code: error.code,
        message: error.message,
      })
    } else {
      console.error('[serverAxios] Unexpected request error', error)
    }
    return Promise.reject(error)
  },
)
