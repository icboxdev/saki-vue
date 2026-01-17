import axios from 'axios'
import { AuthService } from '@/service/auth/auth_service'
import { EncryptionService } from '../help/encryption_service'

let http = null
let cachedPublicKey = null

/* =========================
 * INIT HTTP (LAZY)
 * ========================= */

async function getPublicKey() {
  if (cachedPublicKey) return cachedPublicKey

  cachedPublicKey = await EncryptionService.encryptBase64(
    import.meta.env.VITE_API_PUBLIC_KEY
  )

  return cachedPublicKey
}

async function getHttp() {
  if (http) return http

  const publicKey = await getPublicKey()

  const instance = axios.create({
    baseURL: buildUrl(),
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      publicKey,
    },
  })

  instance.interceptors.request.use((config) => {
    const auth = AuthService.getToken()
    if (auth && auth.token) {
      config.headers.Authorization = `${auth.tokenType || 'Bearer'} ${auth.token}`
    }
    return config
  })

  http = instance
  return instance
}

/* =========================
 * API SERVICE
 * ========================= */

export class ApiService {
  static async request(config) {
    const client = await getHttp()
    return client.request(config)
  }

  static get(url, params = {}) {
    return this.request({ url, params, method: 'GET' })
  }

  static post(url, data = {}) {
    return this.request({ url, data, method: 'POST' })
  }

  static put(url, data = {}) {
    return this.request({ url, data, method: 'PUT' })
  }

  static patch(url, data = {}) {
    return this.request({ url, data, method: 'PATCH' })
  }

  static delete(url, params = {}) {
    return this.request({ url, params, method: 'DELETE' })
  }

  static head(url, params = {}) {
    return this.request({ url, params, method: 'HEAD' })
  }
}

/* =========================
 * HELPERS
 * ========================= */

function buildUrl() {
  const host = import.meta.env.VITE_API_HOST
  const isProd = import.meta.env.VITE_MODE_ENV === 'production'

  if (!host) {
    throw new Error('VITE_API_HOST obrigatório')
  }

  const baseUrl = host.startsWith('http')
    ? host
    : `${isProd ? 'https' : 'http'}://${host}`

  return baseUrl.replace(/\/+$/, '')
}
