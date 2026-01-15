<script setup>
import { computed, ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

// Aqui vamos pegar das configuração o nome das empreas
const company_name = computed(() => 'Empresa');


const model = ref([
    {
        label: company_name.value,
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                items: [
                    { label: 'Visão geral', icon: 'pi pi-fw pi-home', to: '/dashboard' },
                    { label: 'Alarmes ativos', icon: 'pi pi-fw pi-bell', to: '/dashboard/alarmes-ativos' },
                    { label: 'Status das áreas', icon: 'pi pi-fw pi-chart-bar', to: '/dashboard/areas' }
                ]
            },
            {
                label: 'Produção',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    { label: 'Áreas', icon: 'pi pi-fw pi-sitemap', to: '/producao/areas' },
                    { label: 'Sessões', icon: 'pi pi-fw pi-th-large', to: '/producao/sessoes' },
                    { label: 'Métricas', icon: 'pi pi-fw pi-sliders-h', to: '/producao/metricas' },
                    { label: 'Indicadores', icon: 'pi pi-fw pi-chart-line', to: '/producao/indicadores' }
                ]
            },
            {
                label: 'Fontes',
                icon: 'pi pi-fw pi-database',
                items: [
                    { label: 'Leituras em tempo real', icon: 'pi pi-fw pi-bolt', to: '/fontes/realtime' },
                    { label: 'Histórico de leituras', icon: 'pi pi-fw pi-history', to: '/fontes/historico' },
                    { label: 'Status das fontes', icon: 'pi pi-fw pi-chart-bar', to: '/fontes/status' }
                ]
            },
            {
                label: 'Alarmes',
                icon: 'pi pi-fw pi-bell',
                items: [
                    { label: 'Timeline', icon: 'pi pi-fw pi-clock', to: '/alarmes/timeline' },
                    { label: 'Filtros', icon: 'pi pi-fw pi-filter', to: '/alarmes/filtros' },
                    { label: 'Estatísticas', icon: 'pi pi-fw pi-chart-pie', to: '/alarmes/estatisticas' }
                ]
            },
            {
                label: 'Histórico',
                icon: 'pi pi-fw pi-history',
                items: [
                    { label: 'Gráficos', icon: 'pi pi-fw pi-chart-area', to: '/historico/graficos' },
                    { label: 'Comparações', icon: 'pi pi-fw pi-arrows-h', to: '/historico/comparacoes' },
                    { label: 'Relatórios', icon: 'pi pi-fw pi-file', to: '/historico/relatorios' }
                ]
            },
            {
                label: 'Administração',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'Dispositivos', icon: 'pi pi-fw pi-microchip', to: '/admin/devices' },
                    { label: 'Sensores', icon: 'pi pi-fw pi-microchip', to: '/admin/sensors' },
                    { label: 'Setores', icon: 'pi pi-fw pi-folder-open', to: '/admin/sectors' },
                    { label: 'Métricas', icon: 'pi pi-fw pi-sliders-h', to: '/admin/metrics' },
                    { label: 'Usuários', icon: 'pi pi-fw pi-users', to: '/admin/users' }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" />
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
