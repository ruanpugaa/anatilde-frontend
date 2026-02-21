import { SettingsResponse } from '../@types/settings';
import { useCacheStore } from '../store/useCacheStore';

// STAFF INFRA: Centralização de caminhos
const API_URL = 'https://anatilde.com.br/api';
const SETTINGS_CACHE_KEY = 'global_settings';

export const SettingsService = {
    /**
     * Obtém todas as configurações com estratégia de Cache
     * STAFF SYNC: Atualizado para o novo endpoint modular /settings/get.php
     */
    async getSettings(): Promise<SettingsResponse> {
        const cachedData = useCacheStore.getState().getCache<SettingsResponse>(SETTINGS_CACHE_KEY);
        
        if (cachedData) {
            return cachedData;
        }

        try {
            // Alterado da rota legada para a nova arquitetura modular
            const response = await fetch(`${API_URL}/modules/settings/get.php`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Falha ao carregar configurações globais');
            }
            
            // Como o PHP usa FETCH_KEY_PAIR, o 'data' já é o objeto { key: value }
            const data: SettingsResponse = await response.json();

            // Persiste no cache para otimizar performance do Header/Footer
            useCacheStore.getState().setCache(SETTINGS_CACHE_KEY, data);

            return data;
        } catch (error) {
            console.error("SettingsService Get Error:", error);
            throw error;
        }
    },

    /**
     * Atualiza as configurações e invalida o cache
     * STAFF SYNC: Atualizado para o novo endpoint modular /settings/update.php
     */
    async updateSettings(formData: FormData): Promise<{ success: boolean; paths?: any }> {
        try {
            const response = await fetch(`${API_URL}/modules/settings/update.php`, {
                method: 'POST',
                // IMPORTANTE: Ao usar FormData com fetch, NÃO defina Content-Type manual.
                // O navegador fará isso automaticamente incluindo o boundary necessário.
                body: formData,
            });

            const result = await response.json();
            
            if (!response.ok || result.error) {
                throw new Error(result.error || 'Erro ao processar atualização no servidor');
            }

            // Invalida o cache para forçar o sistema a ler os novos dados no próximo render
            useCacheStore.getState().invalidate(SETTINGS_CACHE_KEY);

            return result;
        } catch (error) {
            console.error("SettingsService Update Error:", error);
            throw error;
        }
    }
};