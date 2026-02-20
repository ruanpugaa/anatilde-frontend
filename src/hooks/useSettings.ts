import { useState, useEffect } from 'react';

// Atualizamos a interface para incluir a descrição
export interface Settings {
    site_logo: string;
    site_description: string; // Adicionado aqui
    store_address: string;
    whatsapp_number: string;
    instagram_url: string;
    facebook_url: string;
    contact_email: string;
}

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('https://anatilde.com.br/api/get_settings.php');
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error("Erro ao carregar settings globais");
            }
        };
        load();
    }, []);

    return settings;
};