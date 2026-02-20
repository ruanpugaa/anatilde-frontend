import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../@types/product';
import { Category } from '../@types/category';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { CategoryCircleSelector } from '../components/common/CategoryCircleSelector';
import { ProductShelf } from '../components/common/ProductShelf'; 
import { Loader2 } from 'lucide-react';

export const Delicias = () => {
    // 1. Tipagem rigorosa do parâmetro de rota
    const { categorySlug } = useParams<{ categorySlug?: string }>();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // 2. Lógica centralizada de resolução de ID por Slug/ID
    // Evita duplicação de lógica no useEffect e nos handlers
    const findCategoryInList = useCallback((list: Category[], identifier: string) => {
        return list.find(c => String(c.slug) === identifier || String(c.id) === identifier);
    }, []);

    useEffect(() => {
        let isMounted = true; // Previne atualização de estado em componente desmontado

        const loadInitialData = async () => {
            try {
                const [prods, cats] = await Promise.all([
                    productService.getAllActive(),
                    categoryService.getAll()
                ]);

                if (!isMounted) return;

                const activeCats = cats || [];
                setProducts(prods || []);
                setCategories(activeCats);

                // Sincronização URL -> Estado (Staff Logic)
                if (categorySlug) {
                    const found = findCategoryInList(activeCats, categorySlug);
                    if (found) setSelectedId(Number(found.id));
                }
            } catch (err) {
                console.error("Critical Load Error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadInitialData();
        return () => { isMounted = false; };
    }, [categorySlug, findCategoryInList]);

    // 3. Handler memorizado para garantir que o CircleSelector (memo) funcione de fato
    const handleSelectCategory = useCallback((id: number | null) => {
        setSelectedId(id);
        
        if (!id) {
            navigate('/delicias');
            return;
        }

        const cat = categories.find(c => Number(c.id) === id);
        const path = cat?.slug || cat?.id;
        
        if (path) navigate(`/delicias/${path}`);
    }, [categories, navigate]);

    // 4. Performance: Otimização de filtragem
    // Usamos Number() uma única vez para evitar casting dentro do loop de milhares de produtos
    const filteredProducts = useMemo(() => {
        if (!selectedId) return products;
        const targetId = Number(selectedId);
        return products.filter(p => Number((p as any).category_id) === targetId);
    }, [products, selectedId]);

    const currentTitle = useMemo(() => {
        if (!selectedId) return "Todas as Delícias";
        return categories.find(c => Number(c.id) === selectedId)?.name || "Categoria";
    }, [selectedId, categories]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#FFFCFB]">
            <Loader2 className="animate-spin text-pink-400" size={32} strokeWidth={1.5} />
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FFFCFB] pt-28 pb-20">
            {/* O memo do CategoryCircleSelector agora é respeitado pelo useCallback */}
            <CategoryCircleSelector 
                categories={categories} 
                selectedId={selectedId} 
                onSelect={handleSelectCategory} 
            />

            <ProductShelf 
                title={currentTitle}
                subtitle="Cardápio"
                products={filteredProducts}
                limit={filteredProducts.length} 
            />
        </main>
    );
};