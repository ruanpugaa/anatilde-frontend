import { ISettings, SettingsResponse } from '../@types/settings';
import { useCacheStore } from '../store/useCacheStore';

const API_URL = 'https://anatilde.com.br/api';
const SETTINGS_CACHE_KEY = 'global_settings';

export const SettingsService = {
    /**
     * Obtém todas as configurações com estratégia de Cache
     */
    async getSettings(): Promise<SettingsResponse> {
        // 1. Tenta recuperar do cache usando o Generics definido na tipagem
        const cachedData = useCacheStore.getState().getCache<SettingsResponse>(SETTINGS_CACHE_KEY);
        
        if (cachedData) {
            return cachedData;
        }

        try {
            const response = await fetch(`${API_URL}/get_settings.php`);
            if (!response.ok) throw new Error('Falha ao carregar configurações');
            
            const data: SettingsResponse = await response.json();

            // 2. Alimenta o cache com o dado recém buscado
            useCacheStore.getState().setCache(SETTINGS_CACHE_KEY, data);

            return data;
        } catch (error) {
            console.error("SettingsService Get Error:", error);
            throw error;
        }
    },

    /**
     * Atualiza as configurações e invalida o cache
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

            // 3. Invalidação de Cache: Após um update bem-sucedido, limpamos o cache 
            // para garantir que a próxima leitura busque os dados atualizados do banco.
            useCacheStore.getState().invalidate(SETTINGS_CACHE_KEY);

            return result;
        } catch (error) {
            console.error("SettingsService Update Error:", error);
            throw error;
        }
    }
};