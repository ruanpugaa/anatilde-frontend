import { create } from 'zustand';
import { ICacheState, ICacheStorage } from '../@types/cache';

// Tempo de expiração global: 15 minutos (ajustável)
const CACHE_EXPIRATION_MS = 1000 * 60 * 15;

export const useCacheStore = create<ICacheState>((set, get) => ({
    storage: {},

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
            // Opcional: remover do storage automaticamente se expirado
            get().invalidate(key);
            return null;
        }

        return item.data as T;
    },

    invalidate: (key) => {
        if (key) {
            set((state) => {
                const newStorage = { ...state.storage };
                delete newStorage[key];
                return { storage: newStorage };
            });
        } else {
            set({ storage: {} });
        }
    },
}));