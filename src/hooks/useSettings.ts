import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

/**
 * STAFF ARCHITECTURE: useSettings Hook
 * Consome o estado global de configurações sem disparar novas requisições.
 */
export const useSettings = () => {
    const context = useContext(SettingsContext);

    // STAFF: Se o contexto for undefined, significa que o Provider não envolveu o componente
    if (!context) {
        // Fallback seguro para evitar crash em tempo de execução, 
        // embora o ideal seja garantir o Provider no App.tsx
        return { settings: null, loading: true };
    }

    return {
        settings: context.settings,
        loading: context.loading
    };
};