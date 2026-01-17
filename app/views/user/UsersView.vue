<script setup>
import { FormattedService } from '@/service/help/formatted_service';
import { ConfirmBox, MessageError, MessageSuccess } from '@/service/message_custom';
import { UserHelpService, UserService } from '@/service/user_services';
import { ref, computed, onMounted } from 'vue';

// State
const users = ref([]);
const userSelected = ref({});
const createOrUpdateDrawer = ref(false);
const loading = ref(false);
const layout = ref('grid');
const filterField = ref('is_active');
const filterValue = ref('');

// Constants
const FILTER_OPTIONS = Object.freeze([
    { label: 'Status', value: 'is_active' },
    { label: 'Nome do usuário', value: 'name' },
    { label: 'Email ou Login', value: 'email' },
]);

// Computed
const isStatusFilter = computed(() => filterField.value === 'is_active');
const hasUsers = computed(() => users.value.length > 0);

// Methods
async function fetchUsers(field = 'is_active', value = true) {
    try {
        loading.value = true;
        const { data, status } = await UserService.filtered(field, value);

        if (status === 200) {
            users.value = data;
        }
    } catch (error) {
        MessageError('Erro', error.response?.data?.message || 'Erro ao carregar usuários');
    } finally {
        loading.value = false;
    }
}

async function handleToggleStatus(userId, currentStatus) {
    try {
        const { status } = await UserService.handleToggleStatus(userId, currentStatus);

        if (status === 200) {
            await fetchUsers(filterField.value, filterValue.value);
            MessageSuccess('Sucesso', `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
        }
    } catch (error) {
        MessageError('Erro', error.response?.data?.message || 'Erro ao alterar status do usuário');
    }
}

async function handleDelete(userId, userName) {
    ConfirmBox({
        message: `Tem certeza que deseja excluir o usuário ${userName}?`,
        header: 'Confirmar exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, excluir',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                const { status } = await UserService.handleDelete(userId);

                if (status === 204) {
                    MessageSuccess('Sucesso', 'Usuário excluído com sucesso');
                    await fetchUsers('is_active', true);
                }
            } catch (error) {
                MessageError('Erro', error.response?.data?.message || 'Erro ao excluir usuário');
            }
        }
    });
}

async function handleUserClose() {
    createOrUpdateDrawer.value = false;
    await fetchUsers(filterField.value, filterValue.value);
    await fetchUsers('is_active', true);
}


async function handleCreateOrUpdate(payload = null) {
    try {
        createOrUpdateDrawer.value = true;
        if (payload) {
            userSelected.value = {...payload};
        } else {
            userSelected.value = {};
        }
    } catch (error) {

    }
}

function handleSearch() {
    if (!isStatusFilter.value && !filterValue.value.trim()) {
        MessageError('Atenção', 'Informe um valor para busca');
        return;
    }
    fetchUsers(filterField.value, filterValue.value);
}

function getUserInitials(name) {
    return UserHelpService.getNameInitials(name);
}

function formatLastLogin(timestamp) {
    return FormattedService.formattedLastAt(timestamp);
}

function getStatusClass(isActive) {
    return UserHelpService.getStatusClass(isActive);
}

function getStatusTextClass(isActive) {
    return UserHelpService.getStatusTextClass(isActive);
}

function getAvatarClass(isActive) {
    return UserHelpService.getAvatarClass(isActive);
}

// Lifecycle
onMounted(() => {
    fetchUsers('is_active', true);
});

</script>

<template>
    <div class="card">

        <DataView :value="users" :layout="layout">
            <template #header>
                <div class="space-y-4">
                    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Membros do sistema
                    </h1>

                    <!-- Filters Section -->
                    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <!-- Search Controls -->
                        <div class="flex flex-col sm:flex-row gap-3 flex-1">
                            <div class="flex flex-col gap-1.5 min-w-0">
                                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pesquisar por
                                </label>
                                <Select v-model="filterField" :options="FILTER_OPTIONS" option-label="label"
                                    option-value="value" class="w-full sm:w-56" size="small" />
                            </div>

                            <div v-if="!isStatusFilter" class="flex flex-col gap-1.5 flex-1 min-w-0">
                                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Valor
                                </label>
                                <div class="flex gap-2">
                                    <InputText v-model="filterValue" placeholder="Digite para buscar..." class="flex-1"
                                        size="small" @keyup.enter="handleSearch" />
                                    <Button label="Buscar" icon="pi pi-search" size="small" severity="secondary"
                                        :loading="loading" @click="handleSearch" />
                                </div>
                            </div>

                            <div v-else class="flex flex-col gap-1.5">
                                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <div class="flex gap-2">
                                    <Button label="Ativos" icon="pi pi-check-circle" size="small" severity="success"
                                        :loading="loading" outlined @click="fetchUsers('is_active', true)" />
                                    <Button label="Inativos" icon="pi pi-times-circle" size="small" severity="danger"
                                        :loading="loading" outlined @click="fetchUsers('is_active', false)" />
                                </div>
                            </div>
                        </div>

                        <!-- Add Member Button -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                                &nbsp;
                            </label>
                            <Button label="Adicionar Membro" icon="pi pi-user-plus" size="small" severity="success"
                                class="w-full lg:w-auto" @click="handleCreateOrUpdate()" />
                        </div>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div v-if="!hasUsers && !loading" class="text-center py-12">
                    <i class="pi pi-users text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500 dark:text-gray-400">
                        Nenhum membro encontrado
                    </p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
                    <div v-for="user in slotProps.items" :key="user.id"
                        class="bg-white dark:bg-surface-950/80 rounded-lg border dark:border-none  p-4 hover:shadow-md transition-shadow">

                        <!-- Header: Avatar & Status -->
                        <div class="flex items-start justify-between mb-4">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                                :class="getAvatarClass(user.isActive)">
                                {{ getUserInitials(user.name) }}
                            </div>

                            <div class="flex items-center gap-1.5">
                                <div class="w-2 h-2 rounded-full" :class="getStatusClass(user.isActive)" />
                                <span class="text-xs font-medium" :class="getStatusTextClass(user.isActive)">
                                    {{ user.isActive ? 'Ativo' : 'Inativo' }}
                                </span>
                            </div>
                        </div>

                        <!-- User Info -->
                        <div class="space-y-2 mb-4">
                            <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate" :title="user.name">
                                {{ user.name }}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 truncate" :title="user.email">
                                {{ user.email }}
                            </p>

                            <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                                <i class="pi pi-clock"></i>
                                <span>{{ formatLastLogin(user.lastLoginAt) }}</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <Button label="Editar" icon="pi pi-pencil" size="small" outlined class="w-full"
                                @click="handleCreateOrUpdate(user)" />
                            <Button :label="user.isActive ? 'Desativar' : 'Ativar'"
                                :icon="user.isActive ? 'pi pi-ban' : 'pi pi-check'"
                                :severity="user.isActive ? 'secondary' : 'success'" size="small" outlined class="w-full"
                                @click="handleToggleStatus(user.id, user.isActive)" />
                            <Button label="Excluir" icon="pi pi-trash" severity="danger" size="small" outlined
                                class="w-full" @click="handleDelete(user.id, user.name)" />
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
    <Drawer v-model:visible="createOrUpdateDrawer" position="right"
        class="!w-full sm:!w-[100vw] md:!w-[45rem] lg:!w-[50rem]" :show-close-icon="true">
        <template #container>
            <UserComponent :user="userSelected" @close-modal="handleUserClose" />
        </template>
    </Drawer>
</template>