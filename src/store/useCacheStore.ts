import { create } from 'zustand';
import { ICacheState } from '../@types/cache';

const CACHE_EXPIRATION_MS = 1000 * 60 * 15; // 15 minutos

export const useCacheStore = create<ICacheState>((set, get) => ({
    storage: {},
    version: Date.now(),

    // Resolve o erro do api.ts e garante sincronia com o PHP
    setVersion: (v) => {
        const currentVersion = get().version;
        if (v !== currentVersion) {
            set({ version: v, storage: {} }); 
            console.log(`[Cache] Sincronizado com backend. Versão: ${v}`);
        }
    },

    setCache: (key, data) => {
        set((state) => ({
            storage: {
                ...state.storage,
                [key]: {
                    data,
                    timestamp: Date.now(),
                },
            },
        }));
    },

    getCache: <T>(key: string): T | null => {
        const item = get().storage[key];
        if (!item) return null;

        const isExpired = Date.now() - item.timestamp > CACHE_EXPIRATION_MS;
        if (isExpired) {
            get().invalidate(key);
            return null;
        }

        return item.data as T;
    },

    invalidate: (key) => {
        if (key) {
            set((state) => {
                const { [key]: _, ...rest } = state.storage;
                return { storage: rest };
            });
        } else {
            // Invalidação total: limpa memória e gera novo bust
            set({ storage: {}, version: Date.now() });
        }
    },
}));