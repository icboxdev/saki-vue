<script setup>
import { computed, ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { PreferenceStore } from '@/store/preference_store';
import MenuService from '@/service/help/menu_services';
import { AuthStore } from '@/store/auth_store';

const auth = AuthStore()

const { functions: preferenceFunctions } = PreferenceStore()

const company_name = computed(() => preferenceFunctions.get('companyName', 'Menu'));

const model = ref([
    {
        label: company_name.value,
        items: MenuService.generateMenu(auth.auth.role, [])
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
