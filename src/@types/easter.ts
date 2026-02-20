export interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_url: string;
    active: number | string;
    category_id?: number | string;
}