<script setup>
import { ref } from 'vue';

const visible = ref(false);

const onClose = () => {
    visible.value = false;
};

const getToastClass = (severity) => {
    switch (severity) {
        case 'success':
            return 'bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 border-green-300/50 dark:border-green-600';
        case 'info':
            return 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 border-blue-300/50 dark:border-blue-600';
        case 'warn':
            return 'bg-orange-100 dark:bg-orange-800 text-orange-900 dark:text-orange-100 border-orange-300/50 dark:border-orange-600';
        case 'error':
            return 'bg-rose-300 text-rose-800 border-rose-300/50 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-500';
        default:
            return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300/50 dark:border-gray-600';
    }
};

const getToastIcon = (severity) => {
    switch (severity) {
        case 'success':
            return 'pi pi-check-circle';
        case 'info':
            return 'pi pi-info-circle';
        case 'warn':
            return 'pi pi-exclamation-triangle';
        case 'error':
            return 'pi pi-times-circle';
        default:
            return 'pi pi-bell';
    }
};
</script>

<template>
    <div class="flex justify-center">
        <Toast />
        <Toast position="top-left" group="tl" />
        <Toast position="bottom-left" group="bl" />
        <Toast position="bottom-right" group="br" />
    </div>

    <DynamicDialog />
    <ConfirmDialog group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="p-6 rounded-2xl shadow-xl bg-surface-100 dark:bg-surface-800 w-full max-w-md">
                <div class="flex items-start gap-4">
                    <i :class="message.icon || 'pi pi-question-circle'" class="text-3xl text-primary-500"></i>
                    <div>
                        <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ message.header }}</h2>
                        <p class="text-gray-700 dark:text-gray-300 mt-2">{{ message.message }}</p>
                    </div>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <Button label="Cancelar" severity="secondary" v-on:click="rejectCallback" outlined />
                    <Button label="Confirmar" severity="danger" v-on:click="acceptCallback" />
                </div>
            </div>
        </template>
    </ConfirmDialog>

    <Toast position="bottom-right" group="headless" @close="visible = false">
        <template #container="{ message, closeCallback }">
            <section class="flex flex-col w-full p-2" :class="getToastClass(message.severity)">
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-4">
                        <i :class="getToastIcon(message.severity)" class="text-xl"></i>
                        <span class="font-semibold text-lg">{{ message.detail }}</span>
                    </div>
                    <Button icon="pi pi-times" severity="danger" text rounded size="small" outlined v-on:click="closeCallback" class="ml-4" />
                </div>
                <div class="mt-3 text-xl leading-relaxed" :class="getToastClass(message.severity)">
                   {{ message.summary }} 
                </div>
            </section>
        </template>
    </Toast>

    <ConfirmDialog group="headless-code">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="p-6 rounded-2xl shadow-xl bg-surface-100 dark:bg-surface-800 w-full max-w-md">
                <div class="flex items-start gap-4">
                    <i :class="message.icon || 'pi pi-lock'" class="text-3xl text-red-500"></i>
                    <div>
                        <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {{ message.header }}
                        </h2>
                        <p class="text-gray-700 dark:text-gray-300 mt-2">
                            {{ message.message }}
                        </p>
                    </div>
                </div>

                <div class="mt-4 text-center">
                    <p class="text-gray-600 dark:text-gray-400">Digite o código abaixo para confirmar:</p>
                    <p class="text-xl font-bold tracking-widest text-red-600 mt-1">
                        {{ message.code }}
                    </p>
                    <InputText v-model="message.userInput" class="w-full mt-3" placeholder="Digite o código" />
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <Button :label="message.rejectLabel || 'Cancelar'" severity="secondary" @click="rejectCallback" />
                    <Button :label="message.acceptLabel || 'Excluir'" severity="danger" :disabled="message.userInput !== message.code" @click="acceptCallback" />
                </div>
            </div>
        </template>
    </ConfirmDialog>
</template>
