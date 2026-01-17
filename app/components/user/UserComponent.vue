<script setup>
import { FormattedService } from '@/service/help/formatted_service';
import { ConfirmBox, MessageError, MessageSuccess } from '@/service/message_custom';
import { UserHelpService, UserService } from '@/service/user_services';
import { ref } from 'vue';

const emit = defineEmits(['close-modal']);
const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});
const { user } = props;
const loading = ref(false);
const errorValidations = ref('');

const ROLES_OPTIONS = Object.freeze([
    { label: 'Administrador', value: 'admin' },
    { label: 'Usuário', value: 'user' },
]);

function handleCloseModal() {
    emit('close-modal');
}

async function handleSubmit() {
    try {
        if (!user.id) {
            const { status } = await UserService.store(user);
            if (status === 201) {
                MessageSuccess('Sucesso', 'Usuário criado com sucesso');
                handleCloseModal();
            }
        } else {
            const { status } = await UserService.update(user.id, user);
            if (status === 200) {
                MessageSuccess('Sucesso', 'Usuário atualizado com sucesso');
                handleCloseModal();
            }
        }

    } catch (error) {
        MessageError('Erro', error.response?.data?.message || 'Erro ao criar usuário');
    } finally {
        loading.value = false;
    }
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
</script>

<template>
    <div class="card">
        <div v-if="user.id">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                    :class="getAvatarClass(user.isActive)">
                    {{ getUserInitials(user.name) }}
                </div>
                <div>
                    <span class="flex items-center gap-1.5 text-xs">Ultimo acesso</span>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                        <i class="pi pi-clock"></i>
                        <span>{{ formatLastLogin(user.lastLoginAt) }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full" :class="getStatusClass(user.isActive)" />
                    <span class="text-xs font-medium" :class="getStatusTextClass(user.isActive)">
                        {{ user.isActive ? 'Ativo' : 'Inativo' }}
                    </span>
                </div>
            </div>
        </div>
        <div class="space-y-2 mb-4">
            <form @submit.prevent="handleSubmit()" class="flex flex-col gap-4">
                <div>
                    <label for="x-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Nome
                        completo
                    </label>
                    <input-text v-model="user.name" size="small" id="x-name" placeholder="Digite seu nome"
                        class="mt-1 w-full px-3 py-2" />
                </div>

                <div>
                    <label for="x-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Email
                    </label>
                    <input-text v-model="user.email" size="small" id="x-email" placeholder="Digite seu username"
                        class="mt-1 w-full px-3 py-2" />
                </div>

                <div v-if="!user.id">
                    <label for="x-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Senha
                    </label>
                    <input-text v-model="user.password" size="small" id="x-password" type="password"
                        placeholder="Digite sua senha" class="mt-1 w-full px-3 py-2" />
                </div>

                <div v-if="!user.id">
                    <label for="x-password_confirmation"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirmar senha </label>
                    <input-text v-model="user.password_confirmation" size="small" id="x-password_confirmation"
                        type="password" placeholder="Repita sua senha" class="mt-1 w-full px-3 py-2" />
                </div>
                <div>
                    <label for="x-role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cargo </label>
                    <span v-if="user.role === 'super'">
                        Acesso total
                    </span>
                    <Select v-else id="x-role" v-model="user.role" :options="ROLES_OPTIONS" option-label="label"
                        option-value="value" class="mt-1 w-full " size="small" />
                </div>
                <div class="flex gap-3">
                    <label for="x-is_active" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Habilitado </label>
                    <Checkbox input-id="x-is_active" v-model="user.isActive" class="mt-1 w-full " binary />
                </div>
                <div v-if="errorValidations" class="text-rose-500 text-sm mt-2 dark:text-rose-800">
                    {{ errorValidations }}
                </div>

                <Button :label="user.id ? 'Atualizar' : 'Criar Conta'" class="w-full py-2 transition mt-5"
                    :loading="loading" type="submit" />

            </form>
        </div>
    </div>
</template>
