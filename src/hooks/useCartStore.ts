import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * STAFF TIP: Interface estrita evita o uso de 'any' em outros componentes.
 * Unificamos 'image_url' para evitar confusão entre 'foto', 'image' e 'url'.
 */
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
    toggleSidebar: () => void;
    setSidebar: (open: boolean) => void;
    addItem: (product: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: number) => void;
    removeFullItem: (productId: number) => void; // Remove o item da lista independente da quantidade
    clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isSidebarOpen: false,

            toggleSidebar: () => set((state) => ({ 
                isSidebarOpen: !state.isSidebarOpen 
            })),

            setSidebar: (open: boolean) => set({ isSidebarOpen: open }),

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

                // STAFF UX: Ao adicionar um item novo, abrimos a sidebar automaticamente
                return { 
                    items: [...state.items, { ...product, quantity: 1 }],
                    isSidebarOpen: true
                };
            }),

            removeItem: (productId) => set((state) => {
                const existingItem = state.items.find(item => item.id === productId);
                
                if (existingItem && existingItem.quantity > 1) {
                    return {
                        items: state.items.map(item =>
                            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                        )
                    };
                }
                
                return { items: state.items.filter((item) => item.id !== productId) };
            }),

            removeFullItem: (productId) => set((state) => ({
                items: state.items.filter((item) => item.id !== productId)
            })),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: '@anatilde:cart-storage', // Nome da chave no LocalStorage
            storage: createJSONStorage(() => localStorage),
            // STAFF: Filtramos o que deve ser persistido (não queremos salvar se a sidebar estava aberta)
            partialize: (state) => ({ items: state.items }),
        }
    )
);