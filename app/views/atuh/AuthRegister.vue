<script setup>
import { MessageError, MessageSuccess } from '@/service/message_custom';
import { ref } from 'vue';
import { AuthService } from '@/service/auth/auth_service';
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);
const errorValidations = ref('');
const payload = ref({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function submitRegister() {
    try {
        loading.value = true;
        if (!payload.value.name) {
            throw new Error('O nome deve ser informado');
        }
        if (!payload.value.email) {
            throw new Error('O email deve ser informado');
        } else {
            // validar para que o username seja um email valido caso nao seja dispara o erro
        }
        if (!payload.value.password || !payload.value.password_confirmation) {
            throw new Error('A senha deve ser informada');
        }
        if (payload.value.password !== payload.value.password_confirmation) {
            throw new Error('As senhas devem ser iguais');
        }

        const sucess = await AuthService.registerSuperUser(payload.value);
        if (sucess) {
            MessageSuccess('Sucesso', 'Conta criada com sucesso');
            await delay(4000);
            router.push({ name: 'auth-login' });
        } else {
            throw new Error('Erro ao criar conta');
        }
    } catch (error) {
        MessageError(error.message, 'Erro ao criar conta');
        errorValidations.value = error.message;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <form @submit.prevent="submitRegister" class="flex flex-col gap-4">
        <div>
            <p class="text-gray-600 dark:text-gray-400 ">Crie sua conta administrativa para acessar o sistema Esta conta
                tem o acesso total ao sistema Não compartilhe as informações com terceiros</p>
        </div>

        <div>
            <label for="x-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Nome completo
            </label>
            <input-text v-model="payload.name" size="small" id="x-name" placeholder="Digite seu nome"
                class="mt-1 w-full px-3 py-2" />
        </div>

        <div>
            <label for="x-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Email </label>
            <input-text v-model="payload.email" size="small" id="x-email" placeholder="Digite seu email"
                class="mt-1 w-full px-3 py-2" />
        </div>
        <div>
            <label for="x-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Senha </label>
            <input-text v-model="payload.password" size="small" id="x-password" type="password"
                placeholder="Digite sua senha" class="mt-1 w-full px-3 py-2" />
        </div>

        <div>
            <label for="x-password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar senha </label>
            <input-text v-model="payload.password_confirmation" size="small" id="x-password_confirmation"
                type="password" placeholder="Repita sua senha" class="mt-1 w-full px-3 py-2" />
        </div>

        <div v-if="errorValidations" class="text-rose-500 text-sm mt-2 dark:text-rose-800">
            {{ errorValidations }}
        </div>

        <Button label="Criar Conta" class="w-full py-2 transition mt-5" :loading="loading" type="submit" />

    </form>
</template>
