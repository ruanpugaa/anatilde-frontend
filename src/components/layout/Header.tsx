import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react'; // Removi os ícones não usados para limpar
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useCartStore } from '../../store/useCartStore';
import { Link } from 'react-router-dom'; // <--- Importante

export const Header = () => {
    const scrollDir = useScrollDirection();
    const { toggleSidebar, items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: scrollDir === "down" ? -100 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center px-8"
        >
            {/* Logo agora também é um Link para a Home */}
            <Link to="/" className="flex-1 font-bold text-2xl outline-none">
                DOCE<span className="text-pink-500">MAGIA</span>
            </Link>

            <nav className="hidden md:flex flex-[2] justify-center gap-8 font-medium text-gray-700">
                {/* Trocamos 'href' por 'to' e 'a' por 'Link' */}
                <Link to="/" className="hover:text-pink-500 transition">Home</Link>
                <Link to="/delicias" className="hover:text-pink-500 transition">Delícias</Link>
                <Link to="/pascoa" className="hover:text-pink-500 transition">Páscoa 2026</Link>
                <Link to="/quem-somos" className="hover:text-pink-500 transition">Quem Somos</Link>
                <Link to="/contato" className="hover:text-pink-500 transition">Contato</Link>
            </nav>

            <div className="flex-1 flex justify-end">
                <button onClick={toggleSidebar} className="relative p-2 transition-transform hover:scale-110">
                    <ShoppingBag size={24} />
                    {itemCount > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center"
                        >
                            {itemCount}
                        </motion.span>
                    )}
                </button>
            </div>
        </motion.header>
    );
};