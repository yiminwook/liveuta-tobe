import axios from 'axios'

export const clientAxios = axios.create({
  baseURL: '/',
  timeout: 10_000,
})

clientAxios.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message ?? error.message
      if (message) error.message = message
      console.error('[clientAxios]', {
        method: error.config?.method,
        url: error.config?.url,
        status,
        code: error.code,
        message: error.message,
      })
    } else {
      console.error('[clientAxios] Unexpected request error', error)
    }
    return Promise.reject(error)
  },
)
