<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    stats: {
        type: Object,
        default: () => ({})
    },
    viewMode: {
        type: String,
        default: 'grid',
        validator: (value) => ['grid', 'list'].includes(value)
    }
});

const emit = defineEmits(['update:viewMode', 'refresh', 'create', 'item-click', 'clear-filters']);

const internalViewMode = computed({
    get: () => props.viewMode,
    set: (value) => emit('update:viewMode', value)
});

function handleRefresh() {
    emit('refresh');
}

function handleCreate() {
    emit('create');
}

function handleItemClick(item) {
    emit('item-click', item);
}

function handleClearFilters() {
    emit('clear-filters');
}
</script>

<template>
    <div class="flex flex-col h-full bg-surface-50 dark:bg-surface-950 p-3 sm:p-6">
        <!-- Header Section -->
        <div v-if="$slots.header" class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <slot name="header" :stats="stats" />
        </div>

        <!-- Toolbar Section -->
        <div v-if="$slots.toolbar" class="bg-white dark:bg-surface-900 p-3 sm:p-4 mb-4 rounded-lg">
            <div class="space-y-3 sm:space-y-0 sm:flex sm:flex-col lg:flex-row gap-4">
                <slot name="toolbar" />

                <!-- View Toggle & Actions -->
                <div class="flex justify-between w-full lg:w-auto gap-2">
                    <div class="flex gap-2 ml-auto">
                        <Button @click="internalViewMode = 'grid'" icon="pi pi-th-large"
                            :text="internalViewMode === 'list'" rounded />
                        <Button @click="internalViewMode = 'list'" icon="pi pi-list" :text="internalViewMode === 'grid'"
                            rounded />
                    </div>

                    <div v-if="$slots['toolbar-actions']" class="flex gap-2">
                        <slot name="toolbar-actions" :on-refresh="handleRefresh" :on-create="handleCreate"
                            :loading="loading" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden">
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center h-full">
                <ProgressSpinner />
            </div>

            <!-- Grid View -->
            <template v-else-if="internalViewMode === 'grid'">
                <div v-if="items.length > 0" class="h-full overflow-auto">
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                        <div v-for="(item, index) in items" :key="item.id || index" @dblclick="handleItemClick(item)"
                            class="bg-white dark:bg-surface-900/40 border border-surface-200 dark:border-surface-700 rounded-lg p-3 sm:p-4 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer min-h-[120px]">
                            <slot name="grid-item" :item="item" :index="index" />
                        </div>
                    </div>
                </div>
            </template>

            <!-- List View -->
            <template v-else>
                <div v-if="items.length > 0" class="h-full overflow-auto hidden sm:block">
                    <div class="bg-white dark:bg-surface-900/30 overflow-hidden rounded-lg">
                        <!-- List Header -->
                        <div v-if="$slots['list-header']"
                            class="px-4 py-3 bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-600">
                            <slot name="list-header" />
                        </div>

                        <!-- List Body -->
                        <div class="divide-y divide-surface-200 dark:divide-surface-700">
                            <div v-for="(item, index) in items" :key="item.id || index"
                                @dblclick="handleItemClick(item)"
                                class="px-3 py-3 hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer transition-colors">
                                <slot name="list-item" :item="item" :index="index" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Empty State -->
            <div v-if="items.length === 0 && !loading" class="flex-1 flex items-center justify-center">
                <slot name="empty-state" :on-clear-filters="handleClearFilters">
                    <div class="text-center">
                        <div
                            class="mb-4 p-6 bg-surface-100 dark:bg-surface-700 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <i class="pi pi-search text-2xl text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Nenhum item encontrado
                        </h3>
                        <p class="text-gray-500 dark:text-gray-500 mb-4">
                            Tente ajustar os filtros ou criar um novo item.
                        </p>
                        <button @click="handleClearFilters"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                            Limpar Filtros
                        </button>
                    </div>
                </slot>
            </div>
        </div>

        <!-- Modal/Drawer Slot -->
        <slot name="modal" />
    </div>
</template>