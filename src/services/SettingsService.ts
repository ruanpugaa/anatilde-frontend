// src/services/SettingsService.ts
import { ISettings, SettingsResponse } from '../@types/settings';

const API_URL = 'https://anatilde.com.br/api';

export const SettingsService = {
    /**
     * Obtém todas as configurações do backend
     */
    async getSettings(): Promise<SettingsResponse> {
        try {
            const response = await fetch(`${API_URL}/get_settings.php`);
            if (!response.ok) throw new Error('Falha ao carregar configurações');
            return await response.json();
        } catch (error) {
            console.error("SettingsService Get Error:", error);
            throw error;
        }
    },

    /**
     * Atualiza as configurações via FormData
     */
    async updateSettings(formData: FormData): Promise<{ status: string; paths?: any }> {
        try {
            const response = await fetch(`${API_URL}/settings.php`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            
            if (!response.ok || result.error) {
                throw new Error(result.error || 'Erro ao processar atualização');
            }

            return result;
        } catch (error) {
            console.error("SettingsService Update Error:", error);
            throw error;
        }
    }
};