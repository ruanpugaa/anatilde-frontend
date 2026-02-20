import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Usando Named Export para garantir que o Vite encontre o nome exato
export const NavigationHandler = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });

        // Se você tiver uma lógica global para fechar o menu, ela entra aqui.
        // Como medida paliativa até integrarmos com seu store:
        // document.body.style.overflow = 'unset'; 
    }, [pathname]);

    return null;
};