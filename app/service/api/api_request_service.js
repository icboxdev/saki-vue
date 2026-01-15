import axios from 'axios';
import { AuthService } from '@/service/auth/auth_service';

// Instância única do Axios (Singleton) para reutilização
const http = axios.create({
    baseURL: _buildUrl(),
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000, // Aumentei para 10s (1s é muito pouco)
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'User-Agent': 'App Frontend - VUE',
        publicKey: import.meta.env.VITE_API_PUBLIC_KEY,
    }
});

// Configuração do Interceptor (Executa antes de cada request)
http.interceptors.request.use(
    (config) => {
        const { tokenType, token } = AuthService.getToken();

        if (token) {
            config.headers.Authorization = `${tokenType || 'Bearer'} ${token}`;
        }

        return config; // CRÍTICO: Você precisa retornar a config
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function fora da classe para limpar o código
function _buildUrl() {
    const host = import.meta.env.VITE_API_HOST;
    const isProd = import.meta.env.VITE_MODE_ENV === 'production';

    if (!host) throw new Error('VITE_API_HOST obrigatório');

    const baseUrl = host.startsWith('http') ? host : `${isProd ? 'https' : 'http'}://${host}`;
    return baseUrl.replace(/\/+$/, '');
}

export class ApiService {
    /**
     * Método genérico de requisição
     */
    static async request(config) {
        try {
            const response = await http.request(config);
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async get(url, params = {}) {
        return this.request({ url, params, method: 'GET' });
    }

    static async post(url, data = {}) {
        return this.request({ url, data, method: 'POST' });
    }

    static async put(url, data = {}) {
        return this.request({ url, data, method: 'PUT' });
    }

    static async patch(url, data = {}) {
        return this.request({ url, data, method: 'PATCH' });
    }
    static async delete(url, params = {}) {
        return this.request({ url, params, method: 'DELETE' });
    }
    static async head(url, params = {}) {
        return this.request({ url, params, method: 'HEAD' });
    }
}
