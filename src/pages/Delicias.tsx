import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../@types/product';
import { Category } from '../@types/category';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { CategoryCircleSelector } from '../components/common/CategoryCircleSelector';
import { ProductShelf } from '../components/common/ProductShelf'; 
import { Loader2 } from 'lucide-react';

export const Delicias = () => {
    const { categorySlug } = useParams<{ categorySlug?: string }>();
    const navigate = useNavigate();
    const isFirstRender = useRef(true);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Memoização da busca de categoria (Referencialmente estável)
    const findCategoryInList = useCallback((list: Category[], identifier: string) => {
        return list.find(c => String(c.slug) === identifier || String(c.id) === identifier);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            // Se já temos dados no cache (verificado internamente nos services),
            // o Promise.all resolve quase instantaneamente.
            try {
                const [prods, cats] = await Promise.all([
                    productService.getAllActive(),
                    categoryService.getAll()
                ]);

                if (!isMounted) return;

                setProducts(prods);
                setCategories(cats);

                // Sincronização URL -> Estado
                if (categorySlug) {
                    const found = findCategoryInList(cats, categorySlug);
                    if (found) setSelectedId(Number(found.id));
                } else {
                    setSelectedId(null);
                }
            } catch (err) {
                console.error("Critical Load Error:", err);
            } finally {
                if (isMounted) setLoading(false);
                isFirstRender.current = false;
            }
        };

        loadInitialData();
        return () => { isMounted = false; };
    }, [categorySlug, findCategoryInList]);

    // 2. Handler de seleção com navegação (Evita re-renders no CircleSelector)
    const handleSelectCategory = useCallback((id: number | null) => {
        if (id === selectedId) return; // Short-circuit se já estiver selecionado

        if (!id) {
            navigate('/delicias');
            setSelectedId(null);
            return;
        }

        const cat = categories.find(c => Number(c.id) === id);
        const path = cat?.slug || cat?.id;
        
        if (path) navigate(`/delicias/${path}`);
    }, [categories, navigate, selectedId]);

    // 3. Filtro em memória (Ultra performático devido ao Cache do Service)
    const filteredProducts = useMemo(() => {
        if (!selectedId) return products;
        const targetId = Number(selectedId);
        return products.filter(p => Number((p as any).category_id) === targetId);
    }, [products, selectedId]);

    const currentTitle = useMemo(() => {
        if (!selectedId) return "Todas as Delícias";
        return categories.find(c => Number(c.id) === selectedId)?.name || "Categoria";
    }, [selectedId, categories]);

    // 4. Loading State (Apenas no primeiro load frio)
    if (loading && isFirstRender.current) return (
        <div className="h-screen flex items-center justify-center bg-[#FFFCFB]">
            <Loader2 className="animate-spin text-pink-400" size={32} strokeWidth={1.5} />
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FFFCFB] pb-20">
            {/* O CategoryCircleSelector deve estar envolto em React.memo para performance total */}
            <CategoryCircleSelector 
                categories={categories} 
                selectedId={selectedId} 
                onSelect={handleSelectCategory} 
            />

            <ProductShelf 
                title={currentTitle}
                subtitle="Cardápio"
                products={filteredProducts}
                // O limite é o total de filtrados para mostrar tudo nesta página
                limit={filteredProducts.length} 
            />
        </main>
    );
};