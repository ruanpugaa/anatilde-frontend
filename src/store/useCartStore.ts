import { create } from 'zustand';

export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
}

interface CartStore {
    items: Product[];
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    addItem: (product: Omit<Product, 'quantity'>) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    totalValue: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
            set({
                items: items.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                ),
            });
        } else {
            set({ items: [...items, { ...product, quantity: 1 }] });
        }
        set({ isSidebarOpen: true }); // Abre a barra ao adicionar
    },

    removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

    updateQuantity: (id, delta) => set({
        items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
    }),

    totalValue: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));