import { ApiService } from "./api/api_request_service";

export class GroupService {

    static async index() {
        return await ApiService.get('api/v1/groups');
    }

    static async show(id) {
        return await ApiService.get(`api/v1/groups/${id}`);
    }

    static async store(data) {
        return await ApiService.post('api/v1/groups', data);
    }

    static async update(id, data) {
        return await ApiService.put(`api/v1/groups/${id}`, data);
    }

    static async delete(id) {
        return await ApiService.delete(`api/v1/groups/${id}`);
    }

    static handleToggleStatus(id, enable) {
        return ApiService.put(`api/v1/groups/${id}`, { isActive: !enable });
    }
    
    static async filtered(field, value) {
        return ApiService.get(`api/v1/groups?field=${field}&value=${value}`);
    }

}