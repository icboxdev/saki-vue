import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { AuthService } from '@/service/auth/auth_service';

export const AuthStore = defineStore('auth_store', () => {
    const state = reactive({
        user: {},
        isAuthenticated: false
    });

    async function authLotin(data) {
        const { isAuthenticated, user } = await AuthService.login(data);
        state.user = user;
        state.isAuthenticated = isAuthenticated;
        return isAuthenticated;
    }
    async function setAuth(data) {
        state.user = data.user;
        state.isAuthenticated = data.isAuthenticated;
    }
    const functions = {
        login: authLotin,
        setAuth
    };
    const isAuthenticated = computed(() => {
        const { token } = AuthService.getToken();
        if (!token) return false;
        return state.isAuthenticated;
    });
    const auth = {
        isAuthenticated,
        isAdmin: computed(() => state.user.role === 'admin'),
        isMaster: computed(() => state.user.role === 'master'),
        isUser: computed(() => state.user.role === 'user'),
        isView: computed(() => state.user.role === 'view'),
        ...state.user
    };

    return {
        functions,
        auth
    };
});
