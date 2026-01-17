import { menuUser } from "@/layout/composables/menu"
import accessControlsRoutes from "@/router/user_router"

export default class MenuService {

    static formattedRouter(routerItem) {

        if (routerItem.visible) {
            const item = {
                label: routerItem.label,
                icon: routerItem.icon,
                items: []
            }
            for (const child of routerItem.children) {
                if (child.menu && child.menu.visible) {
                    item.items.push({
                        label: child.menu.label,
                        icon: child.menu.icon,
                        to: routerItem.path + '/' + child.path,
                        module: child.module,
                        abilities: child.menu.abilities
                    })
                }
            }
            if (item.items.length) {
                return item
            } else {
                return null
            }
        }

    }


    static generateMenu(role, abilities) {
        const abilityMap = MenuService.normalizeAbilities(abilities)
        const menu = []

        function filterItems(items) {
            return items
                .map((item) => {
                    // Submenu
                    if (item.items && Array.isArray(item.items)) {
                        const children = filterItems(item.items)

                        if (children.length === 0) return null

                        return {
                            ...item,
                            items: children,
                        }
                    }

                    // Item simples
                    if (!item.module || !item.abilities) {
                        return item
                    }

                    return MenuService.hasPermission(
                        role,
                        abilityMap,
                        item.module,
                        item.abilities
                    )
                        ? item
                        : null
                })
                .filter(Boolean)
        }

        const userItems = filterItems(menuUser)
        if (userItems.length) {
            menu.push(...userItems)
        }
        // ADMIN
        if (role === 'super' || role === 'admin') {
            const menuMembrers = this.formattedRouter(accessControlsRoutes)

            if (menuMembrers && menuMembrers.items.length) {
                const membersItems = filterItems(menuMembrers.items)
                if (membersItems.length) {
                    menu.push({
                        ...menuMembrers,
                        items: membersItems,
                    })
                }
            }
        }

        return menu
    }


    static hasPermission(role, abilityMap, module, requiredAbilities) {
        // Super tem acesso total
        if (role === 'super') return true

        const allowed = abilityMap[module]
        if (!allowed) return false

        // Wildcard
        if (allowed.includes('*')) return true
        if (requiredAbilities.includes('*')) return true

        return requiredAbilities.some((a) => allowed.includes(a))
    }


    static normalizeAbilities(abilities) {
        const map = {}

        for (const item of abilities || []) {
            map[item.module] = item.values || []
        }

        return map
    }


}
