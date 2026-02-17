import { create } from 'zustand';

interface CartItem {
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isSidebarOpen: boolean;
    // Ações
    toggleSidebar: () => void;
    addItem: (product: any) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
    items: [],
    isSidebarOpen: false,

    // Abre/Fecha o carrinho lateral
    toggleSidebar: () => set((state) => ({ 
        isSidebarOpen: !state.isSidebarOpen 
    })),

    // Adiciona item ou incrementa quantidade
    addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);

        if (existingItem) {
            return {
                items: state.items.map((item) =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                ),
            };
        }

        return { 
            items: [...state.items, { ...product, quantity: 1 }],
            isSidebarOpen: true // Opcional: abre o carrinho ao adicionar
        };
    }),

    // Remove ou decrementa quantidade
    removeItem: (productId) => set((state) => {
        const existingItem = state.items.find(item => item.id === productId);
        
        if (existingItem && existingItem.quantity > 1) {
            return {
                items: state.items.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
            };
        }

        return {
            items: state.items.filter((item) => item.id !== productId)
        };
    }),

    clearCart: () => set({ items: [] }),
}));