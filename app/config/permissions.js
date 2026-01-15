/**
 * Centralized Permission Configuration
 * 
 * This file defines all available permissions in the system.
 * Add new modules/actions here as the system scales.
 */

/**
 * Permission Categories for grouping modules
 */
export const PERMISSION_CATEGORIES = [
  { id: 'core', name: 'Sistema', icon: 'pi-cog', order: 1 },
  { id: 'management', name: 'Gerenciamento', icon: 'pi-users', order: 2 },
  { id: 'reports', name: 'Relatórios', icon: 'pi-chart-line', order: 3 },
  // { id: 'finance', name: 'Financeiro', icon: 'pi-dollar', order: 4 },
  { id: 'operations', name: 'Operações', icon: 'pi-briefcase', order: 5 },
]

/**
 * Standard CRUD actions (reusable)
 */
const CRUD_ACTIONS = [
  { id: 'read', name: 'Visualizar', description: 'Ver listagens e detalhes', icon: 'pi-eye' },
  { id: 'create', name: 'Criar', description: 'Adicionar novos registros', icon: 'pi-plus' },
  { id: 'update', name: 'Editar', description: 'Modificar registros existentes', icon: 'pi-pencil' },
  { id: 'delete', name: 'Excluir', description: 'Remover registros', icon: 'pi-trash' },
]

/**
 * All permission modules in the system
 */
export const PERMISSION_MODULES = [
  // ==================== CORE ====================
  {
    id: 'users',
    name: 'Usuários',
    description: 'Gerenciamento de usuários do sistema',
    icon: 'pi-users',
    color: 'blue',
    category: 'management',
    actions: CRUD_ACTIONS,
  },
  {
    id: 'roles',
    name: 'Perfis de Acesso',
    description: 'Gerenciamento de perfis e permissões',
    icon: 'pi-shield',
    color: 'purple',
    category: 'management',
    actions: [
      ...CRUD_ACTIONS,
      { id: 'assign', name: 'Atribuir', description: 'Atribuir perfis a usuários', icon: 'pi-user-plus' },
    ],
  },
  {
    id: 'settings',
    name: 'Configurações',
    description: 'Configurações do sistema',
    icon: 'pi-cog',
    color: 'gray',
    category: 'core',
    actions: [
      { id: 'read', name: 'Visualizar', icon: 'pi-eye' },
      { id: 'update', name: 'Editar', icon: 'pi-pencil' },
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Acesso ao painel principal',
    icon: 'pi-th-large',
    color: 'orange',
    category: 'core',
    actions: [
      { id: 'read', name: 'Visualizar', icon: 'pi-eye' },
      { id: 'customize', name: 'Personalizar', description: 'Customizar widgets', icon: 'pi-sliders-h' },
      { id: 'export', name: 'Exportar', description: 'Exportar dados', icon: 'pi-download' },
    ],
  },

  // ==================== REPORTS ====================
  {
    id: 'reports',
    name: 'Relatórios',
    description: 'Geração e visualização de relatórios',
    icon: 'pi-chart-bar',
    color: 'green',
    category: 'reports',
    actions: [
      { id: 'read', name: 'Visualizar', icon: 'pi-eye' },
      { id: 'create', name: 'Criar', icon: 'pi-plus' },
      { id: 'export', name: 'Exportar', description: 'Exportar relatórios', icon: 'pi-download' },
      { id: 'share', name: 'Compartilhar', description: 'Compartilhar com outros', icon: 'pi-share-alt' },
      { id: 'schedule', name: 'Agendar', description: 'Agendar geração', icon: 'pi-calendar' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Análises avançadas e métricas',
    icon: 'pi-chart-line',
    color: 'teal',
    category: 'reports',
    actions: [
      { id: 'read', name: 'Visualizar', icon: 'pi-eye' },
      { id: 'export', name: 'Exportar', icon: 'pi-download' },
    ],
  },

  // ==================== FINANCE ====================
  {
    id: 'invoices',
    name: 'Faturas',
    description: 'Gerenciamento de faturas',
    icon: 'pi-file-invoice',
    color: 'indigo',
    category: 'finance',
    actions: [
      ...CRUD_ACTIONS,
      { id: 'approve', name: 'Aprovar', description: 'Aprovar faturas', icon: 'pi-check' },
      { id: 'cancel', name: 'Cancelar', description: 'Cancelar faturas', icon: 'pi-times' },
    ],
  },
  {
    id: 'payments',
    name: 'Pagamentos',
    description: 'Processamento de pagamentos',
    icon: 'pi-credit-card',
    color: 'emerald',
    category: 'finance',
    actions: [
      { id: 'read', name: 'Visualizar', icon: 'pi-eye' },
      { id: 'process', name: 'Processar', description: 'Processar pagamentos', icon: 'pi-send' },
      { id: 'refund', name: 'Reembolsar', description: 'Processar reembolsos', icon: 'pi-replay' },
    ],
  },

  // ==================== OPERATIONS ====================
  {
    id: 'projects',
    name: 'Projetos',
    description: 'Gerenciamento de projetos',
    icon: 'pi-folder',
    color: 'cyan',
    category: 'operations',
    actions: CRUD_ACTIONS,
  },
  {
    id: 'tasks',
    name: 'Tarefas',
    description: 'Gerenciamento de tarefas',
    icon: 'pi-check-square',
    color: 'lime',
    category: 'operations',
    actions: [
      ...CRUD_ACTIONS,
      { id: 'assign', name: 'Atribuir', description: 'Atribuir a usuários', icon: 'pi-user-plus' },
      { id: 'complete', name: 'Concluir', description: 'Marcar como concluída', icon: 'pi-check' },
    ],
  },
  {
    id: 'clients',
    name: 'Clientes',
    description: 'Gerenciamento de clientes',
    icon: 'pi-building',
    color: 'pink',
    category: 'operations',
    actions: [
      ...CRUD_ACTIONS,
      { id: 'export', name: 'Exportar', icon: 'pi-download' },
    ],
  },
]

/**
 * Get modules by category
 */
export function getModulesByCategory(categoryId) {
  return PERMISSION_MODULES.filter((m) => m.category === categoryId)
}

/**
 * Get module by ID
 */
export function getModuleById(moduleId) {
  return PERMISSION_MODULES.find((m) => m.id === moduleId)
}

/**
 * Get all unique module IDs
 */
export function getAllModuleIds() {
  return PERMISSION_MODULES.map((m) => m.id)
}

/**
 * Get all unique action IDs across all modules
 */
export function getAllActionIds() {
  const actions = new Set()
  PERMISSION_MODULES.forEach((module) => {
    module.actions.forEach((action) => actions.add(action.id))
  })
  return Array.from(actions)
}

/**
 * Validate permission structure
 */
export function validatePermissionStructure(permissions) {
  if (!permissions || typeof permissions !== 'object') return false

  for (const moduleId of Object.keys(permissions)) {
    const module = getModuleById(moduleId)
    if (!module) continue

    for (const actionId of Object.keys(permissions[moduleId])) {
      const hasAction = module.actions.some((a) => a.id === actionId)
      if (!hasAction) {
        console.warn(`Action ${actionId} not found in module ${moduleId}`)
      }
    }
  }

  return true
}

/**
 * Initialize empty permission structure
 */
export function initializePermissionStructure() {
  const structure = {}

  PERMISSION_MODULES.forEach((module) => {
    structure[module.id] = {}
    module.actions.forEach((action) => {
      structure[module.id][action.id] = []
    })
  })

  return structure
}


export function mergePermissionStructure(existingPermissions) {
  const baseStructure = initializePermissionStructure()

  if (!existingPermissions || typeof existingPermissions !== 'object') {
    return baseStructure
  }

  // Merge existing permissions into new structure
  Object.keys(existingPermissions).forEach((moduleId) => {
    if (baseStructure[moduleId]) {
      Object.keys(existingPermissions[moduleId]).forEach((actionId) => {
        if (baseStructure[moduleId][actionId] !== undefined) {
          baseStructure[moduleId][actionId] = existingPermissions[moduleId][actionId] || []
        }
      })
    }
  })

  return baseStructure
}