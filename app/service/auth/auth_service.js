import { ApiService } from '@/service/api/api_request_service';
import { MessageSuccess } from '../message_custom';
import { EncryptionService } from '../help/encryption_service';

export class AuthService {
    static async login(payload) {
        const { username, password } = payload;
        const { status, data: { isAuthenticated, user, token: { token }, tokenType }
        } = await ApiService.post('api/v1/login', {
            username: await EncryptionService.encrypt(username),
            password: await EncryptionService.encrypt(password)
        });

        if (status === 200) {
            MessageSuccess(token, 'Login realizado com sucesso');
            this.setToken({ token, tokenType });
            return { isAuthenticated, user };
        }
        return { isAuthenticated: false, user: {} };
    }

    static async logout() {
        const { status } = await ApiService.post('api/v1/auth/logout');
        if (status === 200) {
            this.clearToken();
        }
        return status === 200;
    }
    static async getMe() {
        const {
            status,
            data: { user }
        } = await ApiService.get('api/v1/auth/me');
        if (status === 200) {
            return user;
        }
        return status === 200;
    }

    static async getSession(retries = 3) {
        try {
            const { token } = this.getToken();
            if (!token) {
                this.cleanSession({ redirect: false });
                return { user: {}, isValid: false };
            }
            const {
                status,
                data: { user, isAuthenticated }
            } = await ApiService.get('api/v1/auth/me');
            if (status === 401) {
                this.cleanSession({ redirect: false });
                return { user: {}, isValid: false };
            }
            return { user, isValid: isAuthenticated };
        } catch (error) {
            if (retries > 0) {
                return await this.getSession(retries - 1);
            }
            this.cleanSession({ redirect: false });
            return { user: {}, isValid: false };
        }
    }

    static cleanSession({ redirect = true } = {}) {
        this.clearToken();
        if (!redirect) return;
        import('@/router')
            .then((m) => {
                const router = m.default;
                if (router && router.currentRoute.value?.name !== 'auth-login') {
                    router.push({ name: 'auth-login' });
                }
            })
            .catch(() => {
                window.location.href = '/auth/login';
            });
    }

    static async updateMe(payload) {
        const {
            status,
            data: { user }
        } = await ApiService.put('api/v1/auth/me', payload);
        if (status === 200) {
            return user;
        }
        return status === 200;
    }
    static async updatePassword(payload) {
        const {
            status,
            data: { user }
        } = await ApiService.put('api/v1/auth/password/change', payload);
        if (status === 200) {
            return user;
        }
        return status === 200;
    }
    static async revokerAcess() {
        const { status } = await ApiService.post('api/v1/auth/revoker-acess');
        return status === 200;
    }
    static async passwordResetRequest(email) {
        const { status } = await ApiService.post('api/v1/password/reset-request', { email });
        return status === 200;
    }
    static async emailConfirmationRequest(payload) {
        const { status } = await ApiService.post('api/v1/email/verify-request', payload);
        return status === 200;
    }
    static async passwordReset(payload) {
        const { status } = await ApiService.post('api/v1/password/reset', payload);
        return status === 200;
    }

    static async emailConfirmation(token) {
        const { status } = await ApiService.post('api/v1/email/verify', { token });
        return status === 200;
    }

    static async registerSuperUser(payload) {
        const {
            name, password, password_confirmation, email
        } = payload;
        const { status } = await ApiService.post('/setup/create', {
            name,
            password: await EncryptionService.encrypt(password),
            password_confirmation: await EncryptionService.encrypt(password_confirmation),
            email: await EncryptionService.encrypt(email),
        });
        return status === 201;
    }
    static async checkStartSetup() {
        const {
            status,
            data: { started }
        } = await ApiService.get('/setup/check');
        return status === 200 && started;
    }
    static getToken() {
        const token = localStorage.getItem('token');
        const tokenType = localStorage.getItem('tokenType');
        return { token, tokenType };
    }
    static setToken({ token, tokenType = 'Bearer' }) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenType', tokenType);
    }
    static clearToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenType');
    }
}
