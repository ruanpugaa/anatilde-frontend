/**
 * Staff Level Type Definitions for Cache System
 */

export interface ICacheItem {
    data: any;
    timestamp: number;
}

export interface ICacheStorage {
    [key: string]: ICacheItem;
}

export interface ICacheState {
    storage: ICacheStorage;
    version: string | number; // Versão sincronizada com o backend (Cache Busting)
    
    // Actions
    setVersion: (v: string | number) => void;
    setCache: (key: string, data: any) => void;
    getCache: <T>(key: string) => T | null;
    invalidate: (key?: string) => void;
}