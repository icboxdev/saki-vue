export const menuUser = [
  { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/user/dash', module: 'dash_user', abilities: ['read', '*'] },
  {
    label: 'Produto',
    icon: 'pi pi-fw pi-home',
    items: [
      { label: 'Usuários', icon: 'pi pi-fw pi-home', to: '/admin/users', module: 'users', abilities: ['read', '*'] },
    ]
  }
]

