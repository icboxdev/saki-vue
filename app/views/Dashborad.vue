<script setup>
import accessControlsRoutes from '@/router/user_router';
import MenuService from '@/service/help/menu_services';

const userMenu = MenuService.formattedRouter(accessControlsRoutes);

</script>
<template>
    <div>
        {{ userMenu }}
    </div>
</template>
