<script setup>
import { MessageError, MessageSuccess, MessageWarn } from '@/service/message_custom';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/service/auth/auth_service';

const router = useRouter();

const await_response = ref(false);
const email = ref('');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function submitForm() {
    try {
        if (!email.value) {
            MessageWarn('Digite um email válido', 'Atenção');
            return;
        }
        await_response.value = true;
        const success = await AuthService.passwordResetRequest(email.value);
        await delay(8000);
        if (success) {
            MessageSuccess('Sucesso', 'Token enviado para seu email');
            await delay(4000);
            next_setup();
        } else {
            MessageError('Erro', 'Erro ao tentar enviar token');
        }
    } catch (error) {
        MessageError('Erro', error.response?.data?.message || error.message);
    } finally {
        await_response.value = false;
    }
}

function next_setup() {
    router.push({ name: 'auth-reset-password' });
}
</script>

<template>
    <form class="flex flex-col gap-4" @submit.prevent="submitForm">
        <p class="text-gray-600 dark:text-gray-300">Digite seu email e enviaremos instruções para redefinir sua senha.</p>

        <div class="flex flex-col w-full gap-1 mb-7">
            <label for="email" class="block font-medium text-gray-700 dark:text-gray-300"> Email </label>
            <input-text id="email" type="email" placeholder="Digite seu email" v-model="email" />
        </div>
        <div class="flex gap-3">
            <Button size="small" type="submit" label="Solicitar código" icon="pi pi-send" class="w-full" :disabled="await_response && !email" :loading="await_response" severity="success" />
            <Button size="small" label="Já tenho um código" icon="pi pi-bolt" class="w-full" :disabled="await_response" severity="help" v-on:click="next_setup" />
        </div>
        <p class="text-center mt-4">
            <router-link to="/auth/login" class="text-primary-500 hover:underline">Voltar ao login</router-link>
        </p>
    </form>
</template>
