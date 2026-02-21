export interface Product {
    id: number | string;
    name: string;
    description?: string;
    ingredients?: string;
    price: number | string;
    image_url: string;
    category_id: number | string | null; // Adicionado/Corrigido
    category_name?: string;
    extra_info?: string; // Retornado pelo JOIN no PHP
    active: number | boolean;
    slug?: string;
    created_at?: string;
}

// Aproveitando para criar um tipo para o estado de quantidades que usamos
export interface ProductQuantityState {
    [key: number]: number;
}