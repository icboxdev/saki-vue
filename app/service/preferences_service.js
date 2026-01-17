import { ApiService } from "./api/api_request_service";

/**
 * Função utilitária para converter qualquer string em camelCase
 * Ex: 'company_name' -> 'companyName'
 * Ex: 'user-id' -> 'userId'
 * Ex: 'API_KEY' -> 'apiKey'
 */
const toCamelCase = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/([-_][a-z0-9])/g, (group) =>
            group
                .toUpperCase()
                .replace('-', '')
                .replace('_', '')
        );
};

export class PreferenceService {

    static async index() {
        return await ApiService.get(`api/v1/preference`)
    }

    static async show(key) {
        const cleanKey = toCamelCase(key);
        return ApiService.get(`api/v1/preference/${cleanKey}`)
    }

    static async store(key, value) {
        const cleanKey = toCamelCase(key);
        return ApiService.post(`api/v1/preference/${cleanKey}`, { name: cleanKey, value })
    }

    static async update(key, value) {
        const cleanKey = toCamelCase(key);
        return await ApiService.put(`api/v1/preference/${cleanKey}`, { value })
    }

    static async delete(key) {
        const cleanKey = toCamelCase(key);
        return await ApiService.delete(`api/v1/preference/${cleanKey}`)
    }

    static toCamelCase = toCamelCase;

    /**
     * Busca um valor de forma segura.
     * Normaliza a chave para camelCase antes de buscar.
     */
    static async get(key, defaultValue = null) {
        try {
            if (!key) return defaultValue;

            // 1. Normaliza a chave aqui também
            const cleanKey = toCamelCase(key);

            // 2. Faz a chamada usando o método show (que já usa a chave limpa, mas ok garantir)
            const response = await this.show(cleanKey);

            // 3. Verificação segura do retorno
            if (response.status === 200 && response.data) {
                const valor = response.data.value;
                return (valor !== undefined && valor !== null) ? valor : defaultValue;
            }

            return defaultValue;
        } catch (error) {
            return defaultValue;
        }
    }
}