interface ImportMetaEnv {
  readonly VITE_SITE_URL: string
  readonly VITE_FIREBASE_VAPID_KEY: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    ACCESS_SECRET: string
    EXTERNAL_API_KEY: string
    EXTERNAL_API_URL: string
    FIREBASE_CLIENT_EMAIL: string
    FIREBASE_PRIVATE_KEY: string
    FIREBASE_PROJECT_ID: string
    GOOGLE_API_KEY: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    NODE_ENV: 'development' | 'production' | 'test'
    ORACLEDB_CONNECTSTRING: string
    ORACLEDB_PASSWORD: string
    TRUST_PROXY_HEADERS: 'true' | 'false'
    VITE_SITE_URL: string
  }
}
