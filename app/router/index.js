import AppLayout from '@/layout/AppLayout.vue';
import AuthLayout from '@/layout/AuthLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { AuthService } from '@/service/auth/auth_service';
import { AuthStore } from '@/store/auth_store';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashborad.vue'),
                    meta: { title: 'Dashboard' }
                }
            ]
        },
        {
            path: '/auth',
            component: AuthLayout,
            children: [
                {
                    path: 'login',
                    name: 'auth-login',
                    component: () => import('@/views/atuh/AuthLogin.vue'),
                    meta: { title: 'Login' }
                },
                {
                    path: 'forgot-password',
                    name: 'auth-forgot-password',
                    component: () => import('@/views/atuh/AuthForgotPassword.vue'),
                    meta: { title: 'Esqueci a Senha' }
                },
                {
                    path: 'reset-password',
                    name: 'auth-reset-password',
                    component: () => import('@/views/atuh/AuthResetPassword.vue'),
                    meta: { title: 'Resetar Senha' }
                },
                {
                    path: 'register/setup',
                    name: 'auth-register-setup',
                    component: () => import('@/views/atuh/AuthRegister.vue'),
                    meta: { title: 'Criar conta de acesso' }
                }
            ]
        }
    ]
});

// --- Guard de autenticação ---
router.beforeEach(async (to) => {
    const { auth } = AuthStore();
    
    const publicRoutes = ['auth-login', 'auth-register-setup', 'auth-forgot-password', 'auth-reset-password'];
    const isPublicRoute = publicRoutes.includes(to.name);

    try {
        const isSetupRequired = await AuthService.checkStartSetup();

        if (isSetupRequired) {
            if (to.name !== 'auth-register-setup') {
                return { name: 'auth-register-setup' };
            }
            return true;
        } else {
            if (to.name === 'auth-register-setup') {
                return { name: 'auth-login' };
            }
        }
    } catch (error) {
        console.error('Falha crítica ao verificar setup:', error);
    }

    if (isPublicRoute) return true;

    if (auth.isAuthenticated) return true;

    const { token } = AuthService.getToken();
    if (token) {
        try {
            const { isValid } = await AuthService.getSession();
            if (isValid) return true;
        } catch (error) {}
    }
    return { name: 'auth-login', query: { redirect: to.fullPath } };
});

router.afterEach((to) => {
    const defaultTitle = import.meta.env.VITE_APP_TITLE || 'Minha Aplicação';
    document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle;
});

export default router;
