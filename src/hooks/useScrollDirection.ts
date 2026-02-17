import { useState, useEffect } from "react";

export function useScrollDirection() {
    const [scrollDir, setScrollDir] = useState<"up" | "down">("up");

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
        const updateScrollDir = () => {
            const scrollY = window.pageYOffset;
            if (Math.abs(scrollY - lastScrollY) < 10) return; // threshold
            setScrollDir(scrollY > lastScrollY ? "down" : "up");
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener("scroll", updateScrollDir);
        return () => window.removeEventListener("scroll", updateScrollDir);
    }, []);

    return scrollDir;
}
