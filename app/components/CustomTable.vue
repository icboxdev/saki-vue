<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    keyField: {
        type: String,
        default: 'id'
    },
    paginator: {
        type: Boolean,
        default: true
    },
    rows: {
        default: 10
    },
    rowsPerPageOptions: {
        type: Array,
        default: () => [5, 10, 20, 50, 100]
    },
    columns: {
        type: Array,
        default: () => null
    },
    filterFunction: {
        type: Function,
        default: (item, filterText) => {
            const filterLower = filterText.toLowerCase();
            return Object.values(item).some((value) => String(value).toLowerCase().includes(filterLower));
        }
    },
    responsive: {
        type: Boolean,
        default: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    dblclick: {
        type: Function
    }
});

// Layout control{id:10, name:'Ideion'}
const layoutOptions = ['list', 'grid'];
const layout = ref('list');
const filterText = ref('');
const isMobile = ref(false);

// Computed: get effective columns (user provided or inferred)
const effectiveColumns = computed(() => {
    if (props.columns) return props.columns;
    if (!props.items.length) return [];

    return Object.keys(props.items[0]).map((field) => ({
        field,
        header: field,
        sortable: true
    }));
});

// Fields for global filtering
const globalFilterFields = computed(() => {
    return effectiveColumns.value.map((col) => col.field);
});

// Mobile detection
function checkMobile() {
    if (!props.responsive) return;
    isMobile.value = window.matchMedia('(max-width: 640px)').matches;
    if (isMobile.value) layout.value = 'grid';
}

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
});

// Computed: filtered items
const filteredItems = computed(() => {
    if (!filterText.value) return props.items;
    return props.items.filter((item) => props.filterFunction(item, filterText.value));
});

// Function to get row key
const getKey = (item, index) => (item[props.keyField] !== undefined ? item[props.keyField] : index);

// For DataView pagination
const pagedItems = computed(() => filteredItems.value);

// Function to get display value with label mapping
const getDisplayValue = (item, column) => {
    const value = item[column.field];

    if (!column.labels || !Array.isArray(column.labels)) {
        return value;
    }

    const labelMapping = column.labels.find((label) => label.value === value);
    return labelMapping ? labelMapping.label : value;
};
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex mb-3">
            <slot name="buttons" />
        </div>

        <div class="flex justify-between items-center mb-3 gap-2 flex-wrap">

            <SelectButton v-if="!isMobile" v-model="layout" :options="layoutOptions" :allowEmpty="false" size="small"
                class="border-none">
                <template #option="{ option }">
                    <i :class="[option === 'list' ? 'pi pi-desktop' : 'pi pi-mobile']" />
                </template>
            </SelectButton>

            <template v-if="$slots.filter?.().length">
                <slot name="filter" :filterText="filterText" />
            </template>

            <template v-else>
                <div class="flex flex-col">
                    <label for="filter" class="text-sm text-surface-700 dark:text-surface-300">Pesquisar</label>
                    <InputText v-model="filterText" class="w-full" size="small" />
                </div>
            </template>

        </div>

        <!-- Lista -->
        <div v-if="layout === 'list'">
            <DataTable size="small" :value="filteredItems" :paginator="props.paginator" :rows="props.rows"
                @row-dblclick="dblclick" :rowsPerPageOptions="props.rowsPerPageOptions" selectionMode="single"
                :globalFilterFields="globalFilterFields" striped-rows :loading="loading">
                <Column v-for="col in effectiveColumns" :key="col.field" :field="col.field"
                    :header="col.header || col.field" :sortable="col.sortable !== false">
                    <template #body="{ data }">
                        <slot :name="`cell-${col.field}`" :item="data" :value="getDisplayValue(data, col)">
                            <slot name="cell" :item="data" :field="col.field" :value="getDisplayValue(data, col)">
                                {{ getDisplayValue(data, col) }}
                            </slot>
                        </slot>
                    </template>
                </Column>

                <Column v-if="$slots.actions" header="Ações" :exportable="false" class="text-right">
                    <template #body="{ data }">
                        <slot name="actions" :item="data" />
                    </template>
                </Column>

                <template #empty>
                    <slot name="empty">
                        <div class="text-center py-4 text-surface-800 dark:text-surface-200">Nenhum item encontrado
                        </div>
                    </slot>
                </template>
            </DataTable>
        </div>
        <div v-else class="flex">
            <!-- Grid -->
            <DataView :value="pagedItems" layout="grid" :paginator="props.paginator" :rows="props.rows"
                :rowsPerPageOptions="props.rowsPerPageOptions" class="flex-grow bg-surface-50 dark:bg-surface-900">
                <template #grid="slotProps">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 p-3 ">
                        <div v-for="(item, index) in slotProps.items" :key="getKey(item, index)"
                            class="bg-surface-50 dark:bg-surface-900 border rounded-sm dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-950/40 transition-shadow duration-200 cursor-pointer p-4 flex flex-col">
                            <slot name="item" :item="item">
                                <div v-for="col in effectiveColumns" :key="col.field" class="mb-1">
                                    <strong class="text-sm text-surface-500 dark:text-surface-300"> {{ col.header ||
                                        col.field }}: </strong>
                                    <div class="mt-1">
                                        <slot :name="`grid-${col.field}`" :item="item"
                                            :value="getDisplayValue(item, col)">
                                            {{ getDisplayValue(item, col) }}
                                        </slot>
                                    </div>
                                </div>
                            </slot>

                            <div class="mt-auto pt-2 flex justify-end gap-2">
                                <slot name="actions" :item="item" />
                            </div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <slot name="empty">
                        <div class="text-center py-4 text-surface-500 dark:text-surface-400">Nenhum dado encontrado
                        </div>
                    </slot>
                </template>
            </DataView>
        </div>
    </div>
</template>
