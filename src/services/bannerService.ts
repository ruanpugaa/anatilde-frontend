import api from './api';
import { Banner, BannerInput } from '../@types/banner';

export const bannerService = {
    getAll: async (): Promise<Banner[]> => {
        const { data } = await api.get('/admin_banners.php');
        return Array.isArray(data) ? data : [];
    },

    save: async (banner: Banner | BannerInput): Promise<Banner> => {
        const { data } = await api.post('/admin_banners.php', banner);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin_banners.php?id=${id}`);
    }
};