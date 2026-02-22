import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICacheState } from '../@types/cache';

const CACHE_EXPIRATION_MS = 1000 * 60 * 15; // 15 minutos

/**
 * STAFF ARCHITECTURE: Persistência Estruturada
 * Utilizamos o persist para salvar o estado no LocalStorage,
 * garantindo que o 'Initial Load' em visitas repetidas seja instantâneo.
 */
export const useCacheStore = create<ICacheState>()(
    persist(
        (set, get) => ({
            storage: {},
            version: 0, // Iniciamos em 0 para forçar a primeira sincronia

            setVersion: (v) => {
                const currentVersion = get().version;
                // STAFF: Se a versão do PHP mudar, limpamos o cache antigo imediatamente (Cache Busting)
                if (v !== currentVersion) {
                    set({ version: v, storage: {} }); 
                    console.log(`[Cache] Sincronizado com backend v${v}. Cache renovado.`);
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

                // Verificação de expiração por TTL
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
                        const newStorage = { ...state.storage };
                        delete newStorage[key];
                        return { storage: newStorage };
                    });
                } else {
                    set({ storage: {}, version: Date.now() });
                }
            },
        }),
        {
            name: '@anatilde:app-cache', // Chave de persistência no navegador
            storage: createJSONStorage(() => localStorage),
            // STAFF: Filtramos apenas o storage para persistir, mantendo a version fluida se necessário
            partialize: (state) => ({ 
                storage: state.storage, 
                version: state.version 
            }),
        }
    )
);