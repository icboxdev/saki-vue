import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import { setTheme } from './config/theme';
import { AuthService } from './service/auth/auth_service';
import { AuthStore } from './store/auth_store';
import { PreferenceStore } from './store/preference_store';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

(async function init() {
    try {
        const { functions } = PreferenceStore();
        await functions.fetchPreferences();
        const { isValid, user } = await AuthService.getSession();
        AuthStore().functions.setAuth({ isAuthenticated: isValid, user });

    } catch (err) {
        console.error('Erro init getSession', err);
    }

    const configDefault = {
        preset: 'Aura',
        primary: 'noir',
        surface: 'viva',
        darkTheme: false,
        menuMode: 'overlay'
    };

    setTheme(configDefault);
    app.mount('#app');
})();
