<script setup>
import { onMounted } from 'vue';
import { initializeMessaging } from '@/service/message_custom';

onMounted(() => {
    initializeMessaging();
});
</script>

<template>
    <router-view />
</template>
