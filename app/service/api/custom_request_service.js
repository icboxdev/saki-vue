import axios from 'axios';

// Instância base limpa para requisições externas
const http = axios.create({
    timeout: 30000, // 30s (APIs externas podem ser lentas)
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export class RequestService {

    /**
     * Wrapper centralizado para execução
     */
    static async request(config) {
        try {
            // O axios faz o merge automático dos headers passados na config
            // com os headers padrão da instância 'http'
            const response = await http.request(config);
            return response.data;
        } catch (error) {
            // Opcional: Tratamento específico ou log de erro externo
            throw error;
        }
    }

    /**
     * @param {string} url URL Completa
     * @param {Object} [options] Opções extras (params, headers, timeout)
     */
    static async get(url, options = {}) {
        return this.request({ ...options, url, method: 'GET' });
    }

    static async post(url, data = {}, options = {}) {
        return this.request({ ...options, url, data, method: 'POST' });
    }

    static async put(url, data = {}, options = {}) {
        return this.request({ ...options, url, data, method: 'PUT' });
    }

    static async patch(url, data = {}, options = {}) {
        return this.request({ ...options, url, data, method: 'PATCH' });
    }

    static async delete(url, options = {}) {
        return this.request({ ...options, url, method: 'DELETE' });
    }
}