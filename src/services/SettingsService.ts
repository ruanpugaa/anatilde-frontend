import { SettingsResponse } from '../@types/settings';
import { useCacheStore } from '../store/useCacheStore';

const API_URL = 'https://api.anatilde.com.br';
const SETTINGS_CACHE_KEY = 'global_settings';

// STAFF: Variável em escopo de módulo para rastrear requisições em voo (In-flight requests)
let settingsPromise: Promise<SettingsResponse> | null = null;

export const SettingsService = {
    /**
     * Obtém configurações com estratégia de Cache + Request Collapsing
     */
    async getSettings(): Promise<SettingsResponse> {
        // 1. Tenta o Cache (Zustand)
        const cachedData = useCacheStore.getState().getCache<SettingsResponse>(SETTINGS_CACHE_KEY);
        if (cachedData) return cachedData;

        // 2. STAFF PATTERN: Se já houver uma requisição idêntica em andamento, retorna a mesma Promessa.
        // Isso impede que 4 chamadas virem 4 requisições de rede.
        if (settingsPromise) {
            return settingsPromise;
        }

        // 3. Cria a requisição e armazena na variável de controle
        settingsPromise = (async () => {
            try {
                const response = await fetch(`${API_URL}/modules/settings/get.php`);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Falha ao carregar configurações');
                }
                
                const data: SettingsResponse = await response.json();

                // Persiste no cache global
                useCacheStore.getState().setCache(SETTINGS_CACHE_KEY, data);

                return data;
            } catch (error) {
                console.error("SettingsService Get Error:", error);
                throw error;
            } finally {
                // STAFF: Limpa a promessa ao finalizar (sucesso ou erro) para permitir 
                // novos fetches caso o cache seja invalidado.
                settingsPromise = null;
            }
        })();

        return settingsPromise;
    },

    /**
     * Atualiza as configurações e invalida o cache
     */
    async updateSettings(formData: FormData): Promise<{ success: boolean; paths?: any }> {
        try {
            const response = await fetch(`${API_URL}/modules/settings/update.php`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            
            if (!response.ok || result.error) {
                throw new Error(result.error || 'Erro ao processar atualização');
            }

            // Invalida o cache e reseta a promessa de controle
            useCacheStore.getState().invalidate(SETTINGS_CACHE_KEY);
            settingsPromise = null;

            return result;
        } catch (error) {
            console.error("SettingsService Update Error:", error);
            throw error;
        }
    }
};