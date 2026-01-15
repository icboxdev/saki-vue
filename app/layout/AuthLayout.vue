<script setup></script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-surface-100 dark:bg-surface-950">
        <div class="flex flex-col w-screen h-screen justify-center md:max-w-md md:h-min bg-white dark:bg-surface-900 rounded-lg shadow-lg p-8">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-primary">Controle de Acesso</h1>
            </div>
            <router-view />
        </div>
    </div>
    <Messages />
</template>
