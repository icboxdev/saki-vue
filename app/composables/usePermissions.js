/**
 * Composable for permission management
 * Provides unified interface for permission operations
 */

import { computed, ref } from 'vue'
import {
    PERMISSION_MODULES,
    PERMISSION_CATEGORIES,
    getModulesByCategory,
    getModuleById,
    initializePermissionStructure,
    mergePermissionStructure,
} from '@/config/permissions'

export function usePermissions(options = {}) {
    const permissions = ref({})
    const isLoading = ref(false)

    // Initialize permissions
    function initialize() {
        if (options.initialPermissions) {
            permissions.value = mergePermissionStructure(options.initialPermissions)
        } else {
            permissions.value = initializePermissionStructure()
        }
    }

    // Get user role
    const userRole = computed(() => options.user?.role || 'user')

    // Check if user has specific permission
    function hasPermission(moduleId, actionId) {
        return permissions.value[moduleId]?.[actionId]?.includes(userRole.value) || false
    }

    // Toggle permission for current user role
    function togglePermission(moduleId, actionId) {
        if (!permissions.value[moduleId]) {
            permissions.value[moduleId] = {}
        }

        if (!permissions.value[moduleId][actionId]) {
            permissions.value[moduleId][actionId] = []
        }

        const roleList = permissions.value[moduleId][actionId]
        const index = roleList.indexOf(userRole.value)

        if (index > -1) {
            roleList.splice(index, 1)
        } else {
            roleList.push(userRole.value)
        }
    }

    // Toggle all permissions in a module
    function toggleModule(moduleId, enabled) {
        const module = getModuleById(moduleId)
        if (!module) return

        module.actions.forEach((action) => {
            if (enabled) {
                permissions.value[moduleId][action.id] = [userRole.value]
            } else {
                permissions.value[moduleId][action.id] = []
            }
        })
    }

    // Toggle all permissions in a category
    function toggleCategory(categoryId, enabled) {
        const modules = getModulesByCategory(categoryId)
        modules.forEach((module) => {
            toggleModule(module.id, enabled)
        })
    }

    // Get module statistics
    function getModuleStats(moduleId) {
        const module = getModuleById(moduleId)
        if (!module) return { total: 0, granted: 0, percentage: 0 }

        const total = module.actions.length
        const granted = module.actions.filter((action) => hasPermission(moduleId, action.id)).length

        return {
            total,
            granted,
            percentage: total > 0 ? (granted / total) * 100 : 0,
        }
    }

    // Get category statistics
    function getCategoryStats(categoryId) {
        const modules = getModulesByCategory(categoryId)
        let total = 0
        let granted = 0

        modules.forEach((module) => {
            const stats = getModuleStats(module.id)
            total += stats.total
            granted += stats.granted
        })

        return {
            total,
            granted,
            percentage: total > 0 ? (granted / total) * 100 : 0,
        }
    }

    // Check if module is fully granted
    function isModuleFullyGranted(moduleId) {
        const module = getModuleById(moduleId)
        if (!module) return false

        return module.actions.every((action) => hasPermission(moduleId, action.id))
    }

    // Check if category is fully granted
    function isCategoryFullyGranted(categoryId) {
        const modules = getModulesByCategory(categoryId)
        return modules.every((module) => isModuleFullyGranted(module.id))
    }

    // Get total statistics
    const totalStats = computed(() => {
        let total = 0
        let granted = 0

        PERMISSION_MODULES.forEach((module) => {
            const stats = getModuleStats(module.id)
            total += stats.total
            granted += stats.granted
        })

        return {
            total,
            granted,
            percentage: total > 0 ? (granted / total) * 100 : 0,
        }
    })

    // Filter modules
    function filterModules(query) {
        if (!query.trim()) return PERMISSION_MODULES

        const lowerQuery = query.toLowerCase()
        return PERMISSION_MODULES.filter(
            (module) =>
                module.name.toLowerCase().includes(lowerQuery) ||
                module.description.toLowerCase().includes(lowerQuery) ||
                module.actions.some(
                    (action) =>
                        action.name.toLowerCase().includes(lowerQuery) ||
                        action.description?.toLowerCase().includes(lowerQuery)
                )
        )
    }

    // Export permissions
    function exportPermissions() {
        return JSON.parse(JSON.stringify(permissions.value))
    }

    // Import permissions
    function importPermissions(data) {
        permissions.value = mergePermissionStructure(data)
    }

    // Reset permissions
    function reset() {
        permissions.value = initializePermissionStructure()
    }

    // Initialize on creation
    initialize()

    return {
        // State
        permissions,
        isLoading,

        // Computed
        userRole,
        totalStats,

        // Methods
        hasPermission,
        togglePermission,
        toggleModule,
        toggleCategory,
        getModuleStats,
        getCategoryStats,
        isModuleFullyGranted,
        isCategoryFullyGranted,
        filterModules,
        exportPermissions,
        importPermissions,
        reset,

        // Config exports
        modules: PERMISSION_MODULES,
        categories: PERMISSION_CATEGORIES,
        getModulesByCategory,
        getModuleById,
    }
}