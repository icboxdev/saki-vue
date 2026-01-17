import { PreferenceService } from '@/service/preferences_service';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

export const PreferenceStore = defineStore('preference_store', () => {
    const state = reactive({
        preferences: [],
    });
    async function fetchPreferences() {
        const { status, data } = await PreferenceService.index()
        if (status === 200) {
            state.preferences = data
        }
    }

    function get(key, defaultValue = null) {
        try {
            if (!key) return defaultValue
            
            const searchKey = PreferenceService.toCamelCase(key)

            const preference = state.preferences.find(p => {
                return PreferenceService.toCamelCase(p.name) === searchKey
            })

            if (preference) {
                return preference.value
            }
            return defaultValue
        } catch (error) {
            return defaultValue
        }
    }

    const functions = {
        get,
        fetchPreferences
    }

    return {
        functions,
        preferences: computed(() => state.preferences),
    };
});
