const routes = {
    path: '/access',
    label: 'Controle de acesso',
    visible: true,
    icon: 'pi pi-shield',
    children: [
        {
            path: 'members',
            name: 'access-members',
            menu: {
                icon: 'pi pi-users',
                label: 'Membros',
                module: 'users',
                visible: true,
                abilities: ['read', '*']
            },
            component: () => import('@/views/user/UsersView.vue'),
            meta: { title: 'Membros do sistema' }
        },
        {
            path: 'groups',
            name: 'access-groups',
            menu: {
                icon: 'pi pi-slack',
                label: 'Grupos',
                module: 'groups',
                visible: true,
                abilities: ['read', '*']
            },
            component: () => import('@/views/user/GroupsView.vue'),
            meta: { title: 'Grupos de acesso' }
        },
    ]
}

export default routes;

