import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
// Usando sua interface de Category (se não tiver, me avise para criarmos o arquivo @types)
import { Category } from '../@types/category'; 

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await categoryService.getAll();
                // Filtramos apenas as ativas para o usuário final
                const actives = data.filter((c: any) => Number(c.active) === 1);
                setCategories(actives);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCats();
    }, []);

    return { categories, loading };
};