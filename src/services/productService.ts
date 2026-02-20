import api from './api';
import { Product } from '../@types/product';

export const productService = {
    async getAllActive(): Promise<Product[]> {
        const { data } = await api.get<Product[]>('/products.php');
        const products = Array.isArray(data) ? data : [];
        return products.filter(p => Number(p.active) === 1);
    },

    async getById(id: number): Promise<Product | undefined> {
        const products = await this.getAllActive();
        return products.find(p => p.id === id);
    }
    
    // Futuro: getByCategory(category: string)
};