import React, { createContext, useState, useEffect } from 'react';
import { SettingsService } from '../services/SettingsService';
import { SettingsResponse } from '../@types/settings';

// STAFF: Interface para garantir que o TS conheça as propriedades do Contexto
interface SettingsContextData {
    settings: SettingsResponse | null;
    loading: boolean;
}

// STAFF: Exportação explícita do Contexto e tipagem inicial
export const SettingsContext = createContext<SettingsContextData | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await SettingsService.getSettings();
                setSettings(data);
            } catch (err) {
                console.error("SettingsContext Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};