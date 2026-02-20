export interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_url: string;
    active: number | string;
}

// Aproveitando para criar um tipo para o estado de quantidades que usamos
export interface ProductQuantityState {
    [key: number]: number;
}