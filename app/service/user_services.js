import { ApiService } from "@/service/api/api_request_service";
import { MessageError } from "./message_custom";

export class UserService {
    static async index() {
        return ApiService.get('api/v1/users')
    }
    static async show(id) {
        return ApiService.get(`api/v1/users/${id}`)
    }
    static async store(data) {
        return ApiService.post('api/v1/users', data)
    }
    static async update(id, data) {
        return ApiService.put(`api/v1/users/${id}`, data)
    }
    static async handleDelete(id) {
        return ApiService.delete(`api/v1/users/${id}`)
    }

    static async changePassword(id, new_password, password_confirmation) {
        return ApiService.put(`api/v1/users/${id}`, { password: new_password, password_confirmation: password_confirmation })
    }

    static async handleToggleStatus(id, enable) {
        return ApiService.put(`api/v1/users/${id}`, { isActive: !enable })
    }

    static async filtered(field, value) {
        return ApiService.get(`api/v1/users?field=${field}&value=${value}`)
    }

}

export class UserHelpService {
    static getNameInitials(name) {
        if (!name) return '??'
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    static getAvatarClass(isActive) {
        return isActive
            ? 'bg-gradient-to-br from-sky-500 to-purple-700'
            : 'bg-gray-400';
    }
    static getStatusTextClass(isActive) {
        return isActive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400';
    }
    static getStatusClass(isActive) {
    return isActive
        ? 'bg-emerald-500'
        : 'bg-red-500';
}

}