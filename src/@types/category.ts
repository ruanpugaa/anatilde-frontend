export interface Category {
    id: number;
    name: string;
    slug?: string;           // Adicionado para suportar rotas delicias/[slug]
    image_url: string;
    active: number | string; // Mantido: Flexibilidade para o retorno do PHP
    created_at?: string;
    updated_at?: string;     // Adicionado para consistência de metadados
}

// Para o Admin e formulários de criação/edição
export interface CategoryFormData {
    name: string;
    slug?: string;           // Útil se você permitir editar a URL amigável
    image: File | null;
    active: number;
}