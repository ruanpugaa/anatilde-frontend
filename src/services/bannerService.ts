import api from './api';
import { Banner, BannerInput } from '../@types/banner';

/**
 * STAFF ARCHITECTURE: Banner Service
 * Ajustado para o endpoint único modular: /modules/banners/banners.php
 */
export const bannerService = {
    /**
     * Recupera todos os banners (Front e Admin)
     */
    getAll: async (): Promise<Banner[]> => {
        try {
            // STAFF SYNC: Apontando para o arquivo central do módulo
            const { data } = await api.get('/modules/banners/banners.php');
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("BannerService.getAll Error:", error);
            return [];
        }
    },

    /**
     * Salva ou atualiza um banner
     * O backend banners.php diferencia via método POST e presença de ID
     */
    save: async (banner: Banner | BannerInput): Promise<Banner> => {
        try {
            // Se for FormData (para upload de imagem), enviamos diretamente
            // Se for objeto simples, o axios cuida do JSON
            const { data } = await api.post('/modules/banners/banners.php', banner);
            
            if (data.error) throw new Error(data.error);
            return data;
        } catch (error) {
            console.error("BannerService.save Error:", error);
            throw error;
        }
    },

    /**
     * Remove um banner por ID
     * O backend espera o ID via Query String (?id=X) no método DELETE
     */
    delete: async (id: number): Promise<void> => {
        try {
            const { data } = await api.delete(`/modules/banners/banners.php?id=${id}`);
            
            if (data.error) throw new Error(data.error);
        } catch (error) {
            console.error("BannerService.delete Error:", error);
            throw error;
        }
    }
};