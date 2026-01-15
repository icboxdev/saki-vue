<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext'; // Import explícito se não for auto-imported
import Password from 'primevue/password';
import { MessageError, MessageSuccess, MessageWarn } from '@/service/message_custom';
import { AuthService } from '@/service/auth/auth_service';
import { useRouter } from 'vue-router';

const router = useRouter();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const payload = ref({
    token: '',
    password: '',
    password_confirmation: '',
    email: ''
});
const erronOnSubmit = ref('');

async function newToken() {
    try {
        if (!payload.value.email) {
            MessageWarn('Atenção', 'Digite um email válido');
            return;
        }
        const success = await AuthService.passwordResetRequest(payload.value.email);
        await delay(8000);
        if (success) {
            MessageSuccess('Sucesso', 'Token enviado para seu email');
        } else {
            MessageError('Error', 'Erro ao tentar enviar token');
        }
    } catch (error) {
        MessageError('Error', error.response?.data?.message || error.message);
    }
}

async function handleSubmit() {
    try {
        const { token, password, password_confirmation, email } = payload.value;

        if (!token || !password || !password_confirmation || !email) {
            throw new Error('Preencha todos os campos');
        }

        if (password.length < 8) {
            throw new Error('A senha deve ter no mínimo 8 caracteres');
        }

        if (password !== password_confirmation) {
            throw new Error('As senhas não coincidem');
        }
        const success = await AuthService.passwordReset({
            token,
            password,
            password_confirmation,
            email
        });

        if (success) {
            MessageSuccess('Sucesso', 'Senha redefinida com sucesso');
            await delay(2000);
            router.push({ name: 'auth-login' });
        } else {
            throw new Error('Erro ao tentar redefinir senha');
        }
    } catch (error) {
        MessageError('Erro ao tentar redefinir senha', error.response?.data?.message || error.message);
        erronOnSubmit.value = error.response?.data?.message || error.message;
    }
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4" autocomplete="off">
        <p class="text-gray-600 dark:text-gray-400 text-sm">Digite sua nova senha para redefinir o acesso à sua conta.</p>

        <input style="display: none" type="text" name="fakeusernameremembered" />
        <input style="display: none" type="password" name="fakepasswordremembered" />

        <div class="flex flex-col gap-1 mb-5">
            <label for="token" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Código de recuperação</label>
            <InputText id="token" name="reset_token" v-model="payload.token" type="text" placeholder="Digite o código de recuperação" autocomplete="off" role="presentation" />
        </div>

        <div class="flex flex-col w-full gap-1 mb-7">
            <label for="email" class="block font-medium text-gray-700 dark:text-gray-300"> Email </label>
            <input-text id="email" type="email" placeholder="Digite seu email" v-model="payload.email" />
        </div>

        <div class="flex flex-col gap-1">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nova senha</label>
            <Password id="password" name="new_password" toggle-mask v-model="payload.password" type="password" placeholder="Digite sua nova senha" class="flex flex-col w-full" autocomplete="new-password" />
        </div>

        <div class="flex flex-col gap-1 w-full mb-6">
            <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar nova senha</label>
            <Password
                id="passwordConfirmation"
                name="confirm_password"
                toggle-mask
                :feedback="false"
                v-model="payload.password_confirmation"
                type="password"
                placeholder="Repita sua nova senha"
                class="flex flex-col w-full"
                autocomplete="new-password"
            />
        </div>
        <div v-if="erronOnSubmit" class="text-rose-600 dark:text-rose-500 text-sm mt-2 mb-2">{{ erronOnSubmit }}</div>

        <div class="flex gap-3 w-full justify-between">
            <Button type="submit" label="Redefinir senha" severity="success" />
            <Button @click="newToken" label="Reenviar código" severity="help" />
        </div>

        <p class="text-sm text-center mt-4">
            <router-link to="/login" class="text-primary-500 hover:underline">Voltar ao login</router-link>
        </p>
    </form>
</template>
