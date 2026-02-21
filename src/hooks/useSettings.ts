import { useState, useEffect } from 'react';
import { SettingsService } from '../services/SettingsService';
import { SettingsResponse } from '../@types/settings';

/**
 * STAFF ARCHITECTURE: useSettings Hook
 * Centraliza o consumo de configurações globais em toda a aplicação.
 * Agora integrado ao SettingsService para suporte a Cache e Nova API.
 */
export const useSettings = () => {
    // Usamos o tipo global SettingsResponse para manter a consistência
    const [settings, setSettings] = useState<SettingsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                // STAFF SYNC: Delegamos a responsabilidade para o Service
                // O Service já busca em /modules/settings/get.php e gerencia o cache local
                const data = await SettingsService.getSettings();
                setSettings(data);
            } catch (err) {
                console.error("Erro ao carregar settings globais no Hook:", err);
            } finally {
                setLoading(false);
            }
        };

        load();

        // Listener opcional para atualizar o estado caso as configurações mudem no Admin
        const handleUpdate = () => load();
        window.addEventListener('settingsUpdated', handleUpdate);
        
        return () => window.removeEventListener('settingsUpdated', handleUpdate);
    }, []);

    // Retornamos também o estado de loading para evitar que o Header 
    // tente renderizar imagens com URL undefined durante o fetch
    return { settings, loading };
};