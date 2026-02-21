/**
 * Interface para um item individual dentro do cache
 * Usamos Generics <T> para que o dado mantenha sua tipagem original
 */
export interface ICacheItem<T = any> {
    data: T;
    timestamp: number;
}

/**
 * Estrutura do Storage: uma chave de string mapeando para um item de cache
 */
export type ICacheStorage = Record<string, ICacheItem>;

/**
 * Interface para o Store do Zustand que gerenciará o Cache
 */
export interface ICacheState {
    storage: ICacheStorage;
    
    /**
     * Salva um dado no cache
     * @param key Chave única (ex: 'produtos_pascoa', 'configuracoes_gerais')
     * @param data O dado a ser persistido
     */
    setCache: (key: string, data: any) => void;

    /**
     * Recupera um dado do cache se ele existir e for válido
     * @param key Chave única
     */
    getCache: <T>(key: string) => T | null;

    /**
     * Invalida uma chave específica ou limpa todo o storage
     * @param key Se omitido, limpa todo o cache
     */
    invalidate: (key?: string) => void;
}