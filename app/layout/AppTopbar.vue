<script setup>
import { useLayout } from '@/layout/composables/layout';
import { AuthService } from '@/service/auth/auth_service';
import { ConfirmBox, MessageError } from '@/service/message_custom';
import { computed } from 'vue';

const company_name = computed(() => 'IcBox');

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

async function logout() {
    try {
        ConfirmBox({
            message: 'Tem certeza que deseja sair da aplicação?',
            header: 'Fazer logout',
            icon: 'pi pi pi-sign-out',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    const sucess = await AuthService.logout();
                    if (sucess) {
                        window.location.href = '/auth/login';
                    } else {
                        MessageError('Erro ao tentar fazer logout', 'Falha ao deletar');
                    }
                } catch (error) {
                    MessageError(error.message || 'Erro desconhecido', 'Falha ao deletar');
                }
            }
        });
    } catch (error) {
        MessageError('Erro ao tentar fazer logout', error.response?.data.message);
    }
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <span class="text-primary font-semibold">{{ company_name }}</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button> -->
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button> -->
                    <button type="button" class="layout-topbar-action" v-on:click="logout()">
                        <i class="pi pi-sign-out"></i>
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
