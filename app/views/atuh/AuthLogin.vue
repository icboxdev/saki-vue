<script setup>
import { MessageError, MessageSuccess } from '@/service/message_custom';
import { AuthStore } from '@/store/auth_store';
import { onBeforeMount, ref, watch } from 'vue';

const { auth } = AuthStore();
const { functions } = AuthStore();
const loading = ref(false);

const payload = ref({
    username: '',
    password: ''
});

async function submitForm() {
    try {
        loading.value = true;
        if (!payload.value.username) {
            throw new Error('O usuário deve ser informado');
        }
        if (!payload.value.password) {
            throw new Error('A senha deve ser informada');
        }
        const sucess = await functions.login(payload.value);
        if (!sucess) {
            throw new Error('Erro ao tentar fazer login');
        }
        window.location.href = '/';
        MessageSuccess('Login realizado com sucesso', 'Login');
    } catch (error) {
        console.log(error);
        MessageError('Erro ao tentar fazer login', error.response?.data.message);
    } finally {
        loading.value = false;
    }
}

watch(
    () => auth.isAuthenticated,
    async (statusAuthenticated) => {
        if (statusAuthenticated) {
            window.location.href = '/';
        }
    }
);

onBeforeMount(async() => {
    if (auth.isAuthenticated) {
        window.location.href = '/';
    }
});
</script>

<template>
    <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <label for="x-email" class="block font-medium text-gray-700 dark:text-gray-300"> Usuário ou Email </label>
            <input-text id="x-email" v-model="payload.username" class="w-full" />
        </div>

        <div class="flex flex-col gap-1">
            <label for="x-password" class="block font-medium text-gray-700 dark:text-gray-300"> Senha </label>
            <Password id="x-password" v-model="payload.password" class="flex flex-col w-full" toggle-mask :feedback="false" />
        </div>

        <div class="flex justify-between items-center text-sm">
            <router-link to="/auth/forgot-password" class="text-blue-500 hover:underline"> Esqueceu a senha? </router-link>
            <!-- <router-link to="/auth/register" class="text-primary-500 hover:underline"> Criar conta </router-link> -->
        </div>

        <Button label="Entrar" class="w-full py-2 transition mt-5" :loading="loading" v-on:click="submitForm" />
    </form>
</template>
