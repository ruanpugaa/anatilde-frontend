import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SettingsService } from '../../services/SettingsService';
import { ISettings } from '../../@types/settings';

export const SEOManager = () => {
    const [settings, setSettings] = useState<Partial<ISettings>>({});

    const loadSettings = async () => {
        try {
            const data = await SettingsService.getSettings();
            setSettings(data);
        } catch (err) {
            console.error("Erro ao carregar SEO via Service:", err);
        }
    };

    useEffect(() => {
        loadSettings();
        window.addEventListener('settingsUpdated', loadSettings);
        return () => window.removeEventListener('settingsUpdated', loadSettings);
    }, []);

    const baseUrl = "https://anatilde.com.br/";
    
    const formatUrl = (path: string | undefined) => {
        if (!path) return null;
        return `${baseUrl}${path.replace(/^\//, '')}`;
    };

    // Prioridade de Título ajustada: Nome da Loja primeiro, Meta Title como fallback
    const displayTitle = settings.site_name || settings.seo_title || "Anatilde Doceria Gourmet";
    
    const faviconUrl = formatUrl(settings.site_favicon) || '/favicon.ico';
    const shareImage = formatUrl(settings.seo_share_image) || `${baseUrl}default-share.jpg`;

    return (
        <Helmet>
            {/* Título dinâmico da aba */}
            <title>{displayTitle}</title>
            
            <meta name="description" content={settings.seo_description || settings.site_description || ""} />
            <meta name="keywords" content={settings.seo_keywords || ""} />
            
            {/* Favicon Dinâmico com cache busting e ID para garantir a troca */}
            <link key="favicon-ico" rel="icon" type="image/x-icon" href={`${faviconUrl}?v=${Date.now()}`} />
            <link key="favicon-png" rel="icon" type="image/png" href={`${faviconUrl}?v=${Date.now()}`} />
            <link key="apple-icon" rel="apple-touch-icon" href={`${faviconUrl}?v=${Date.now()}`} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={settings.seo_title || displayTitle} />
            <meta property="og:description" content={settings.seo_description || settings.site_description || ""} />
            <meta property="og:image" content={shareImage} />
            <meta property="og:url" content={window.location.href} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={settings.seo_title || displayTitle} />
            <meta name="twitter:description" content={settings.seo_description || settings.site_description || ""} />
            <meta name="twitter:image" content={shareImage} />

            {/* Google Analytics dinâmico */}
            {settings.analytics_id && (
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.analytics_id}`}></script>
            )}
            {settings.analytics_id && (
                <script>
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${settings.analytics_id}');
                    `}
                </script>
            )}
        </Helmet>
    );
};