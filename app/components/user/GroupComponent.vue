<script setup>
import { GroupService } from '@/service/group_service';
import { FormattedService } from '@/service/help/formatted_service';
import { ConfirmBox, MessageError, MessageSuccess } from '@/service/message_custom';
import { UserHelpService } from '@/service/user_services';
import { ref } from 'vue';

const emit = defineEmits(['close-modal']);
const props = defineProps({
    group: {
        type: Object,
        required: true
    }
});
const { group } = props;
const loading = ref(false);
const errorValidations = ref('');

function handleCloseModal() {
    emit('close-modal');
}

async function handleSubmit() {
    try {
        if (!group.id) {
            const { status } = await GroupService.store(group);
            if (status === 201) {
                MessageSuccess('Sucesso', 'Usuário criado com sucesso');
                handleCloseModal();
            }
        } else {
            const { status } = await GroupService.update(group.id, group);
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
        <div v-if="group.id">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                    :class="getAvatarClass(group.isActive)">
                    {{ getUserInitials(group.name) }}
                </div>
                <div>
                    <span class="flex items-center gap-1.5 text-xs">Criado</span>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                        <i class="pi pi-clock"></i>
                        <span>{{ formatLastLogin(group.createdAt) }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full" :class="getStatusClass(group.isActive)" />
                    <span class="text-xs font-medium" :class="getStatusTextClass(group.isActive)">
                        {{ group.isActive ? 'Ativo' : 'Inativo' }}
                    </span>
                </div>
            </div>
        </div>
        <div class="space-y-2 mb-4">
            <form @submit.prevent="handleSubmit()" class="flex flex-col gap-4">
                <div>
                    <label for="x-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Grupo
                    </label>
                    <input-text v-model="group.name" size="small" id="x-name" placeholder="Digite seu nome"
                        class="mt-1 w-full px-3 py-2" />
                </div>

                <div>
                    <label for="x-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        description
                    </label>
                    <input-text v-model="group.description" size="small" id="x-description"
                        placeholder="Digite a descrição" class="mt-1 w-full px-3 py-2" />
                </div>

                <div class="flex gap-3">
                    <label for="x-is_active" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Habilitado </label>
                    <Checkbox input-id="x-is_active" v-model="group.isActive" class="mt-1 w-full " binary />
                </div>
                <div v-if="errorValidations" class="text-rose-500 text-sm mt-2 dark:text-rose-800">
                    {{ errorValidations }}
                </div>

                <Button :label="group.id ? 'Atualizar' : 'Criar'" class="w-full py-2 transition mt-5"
                    :loading="loading" type="submit" />

            </form>
        </div>
    </div>
</template>
