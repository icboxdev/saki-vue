import { Transmit } from '@adonisjs/transmit-client';
import { AuthService } from '@/service/auth/auth_service';

// --- Helpers & Configuration ---

function _buildBaseUrl() {
    const host = import.meta.env.VITE_API_HOST;
    const isProd = import.meta.env.VITE_MODE_ENV === 'production';

    if (!host) throw new Error('VITE_API_HOST obrigatório');

    return host.startsWith('http') ? host : `${isProd ? 'https' : 'http'}://${host}`;
}

function _attachAuth(request) {
    const { token, tokenType } = AuthService.getToken();
    if (token) {
        request.headers.set('Authorization', `${tokenType || 'Bearer'} ${token}`);
    }
    return request;
}

// --- State Management (Singleton) ---

// Mapa para gerenciar inscrições ativas e evitar duplicidade
const activeSubscriptions = new Map();

// Instância única do cliente Transmit
const client = new Transmit({
    baseUrl: _buildBaseUrl(),
    beforeSubscribe: _attachAuth,
    beforeUnsubscribe: _attachAuth,
    onSubscribeFailed: (response) => {
        if (response.status === 401) {
            console.warn('[Transmit] Não autorizado. Verifique o token.');
            // Sugestão: Emitir um evento global para forçar logout se necessário
        } else {
            console.error('[Transmit] Erro ao se inscrever:', response);
        }
    },
    onReconnectFailed: () => {
        console.error('[Transmit] Falha crítica na reconexão');
    }
});

// --- Service Class ---

export class TransmitService {

    /**
     * Inscreve-se em um canal específico.
     * Retorna a inscrição existente se já houver uma ativa.
     * * @param {Object} options
     * @param {string} options.channel Nome do canal
     * @param {Object} [options.params] Query params
     * @param {Function} [options.onMessage] Callback para mensagens
     */
    static async subscribe({ channel, params = {}, onMessage }) {
        if (!channel) throw new Error('Channel é obrigatório');

        // 1. Verifica se já existe inscrição ativa (Cache/Idempotência)
        if (activeSubscriptions.has(channel)) {
            const existingSub = activeSubscriptions.get(channel);
            // Atualiza o callback se fornecido um novo, ou mantém o antigo?
            // Geralmente, em single page apps, apenas retornamos a sub existente.
            return existingSub;
        }

        // 2. Cria nova inscrição
        const subscription = client.subscription(channel, params);
        await subscription.create();

        if (onMessage) {
            subscription.onMessage(onMessage);
        }

        // 3. Salva no mapa de estado
        activeSubscriptions.set(channel, subscription);
        
        return subscription;
    }

    /**
     * Remove a inscrição de um canal específico.
     * @param {string} channel 
     */
    static async unsubscribe(channel) {
        const subscription = activeSubscriptions.get(channel);
        if (!subscription) return;

        try {
            await subscription.delete();
        } catch (error) {
            console.warn(`[Transmit] Erro ao deletar subscrição ${channel}`, error);
        } finally {
            activeSubscriptions.delete(channel);
        }
    }

    /**
     * Limpa todas as conexões (Útil no Logout)
     */
    static async unsubscribeAll() {
        const promises = [];
        
        for (const [channel, subscription] of activeSubscriptions) {
            promises.push(subscription.delete().catch(err => 
                console.warn(`Erro limpando canal ${channel}`, err)
            ));
        }

        await Promise.all(promises);
        activeSubscriptions.clear();
    }
    
    /**
     * (Opcional) Retorna a instância bruta se precisar de acesso avançado
     */
    static getClient() {
        return client;
    }
}