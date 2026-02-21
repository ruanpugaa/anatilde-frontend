import { useState, useEffect } from 'react';

export const useWishlist = (productId: string | number) => {
    const [isFavorite, setIsFavorite] = useState(false);

    // Checa se o item já está nos favoritos ao carregar ou quando o productId mudar
    useEffect(() => {
        const checkFavorite = () => {
            const saved = localStorage.getItem('@anatilde:wishlist');
            if (saved) {
                const list = JSON.parse(saved) as (string | number)[];
                setIsFavorite(list.includes(productId));
            } else {
                setIsFavorite(false);
            }
        };

        checkFavorite();

        // Escuta atualizações de outros componentes para manter os corações sincronizados
        window.addEventListener('wishlist-updated', checkFavorite);
        return () => window.removeEventListener('wishlist-updated', checkFavorite);
    }, [productId]);

    const toggleFavorite = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const saved = localStorage.getItem('@anatilde:wishlist');
        let list: (string | number)[] = saved ? JSON.parse(saved) : [];

        const isCurrentlyFavorite = list.includes(productId);
        let newList: (string | number)[];

        if (isCurrentlyFavorite) {
            newList = list.filter(id => id !== productId);
            setIsFavorite(false);
        } else {
            newList = [...list, productId];
            setIsFavorite(true);
        }

        localStorage.setItem('@anatilde:wishlist', JSON.stringify(newList));

        // STAFF FIX: Dispara o evento global para que o Header e outros componentes 
        // reajam instantaneamente sem refresh.
        window.dispatchEvent(new Event('wishlist-updated'));
    };

    return { isFavorite, toggleFavorite };
};