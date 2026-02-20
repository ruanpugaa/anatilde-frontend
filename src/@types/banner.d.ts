export interface Banner {
    id: number;
    title: string;
    subtitle?: string; // Opcional, caso queira um banner só com título
    image_url: string;
    button_text: string;
    button_link: string;
    order_priority: number;
    is_active: boolean;
    created_at?: string;
}

// Útil para o formulário de criação no Admin, onde o ID ainda não existe
export type BannerInput = Omit<Banner, 'id' | 'created_at'>;