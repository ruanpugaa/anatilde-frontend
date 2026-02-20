// src/@types/settings.ts

export interface ISettings {
    // Identidade & Geral
    site_name: string;
    site_logo: string;
    site_favicon: string;
    site_description: string;
    store_address: string;

    // Contato
    whatsapp_number: string;
    contact_email: string;

    // Redes Sociais
    instagram_url: string;
    facebook_url: string;

    // SEO & Analytics
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    seo_share_image: string;
    analytics_id: string;
}

// Para o retorno do Service que pode ser parcial ou dinâmico
export type SettingsResponse = Partial<ISettings>;