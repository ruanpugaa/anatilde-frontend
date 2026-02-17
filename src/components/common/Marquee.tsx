import { motion } from "framer-motion";

const messages = [
    "ENTREGA GRÁTIS ACIMA DE R$ 150,00",
    "PRODUTOS ARTESANAIS FEITOS COM AMOR",
    "ENCOMENDAS PELO WHATSAPP: (11) 9999-9999",
    "ACEITAMOS CARTÕES E PIX",
    "SABORES NOVOS TODA SEMANA!",
];

export const Marquee = () => {
    return (
        <div className="bg-pink-600 py-3 overflow-hidden whitespace-nowrap flex border-y border-pink-700">
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex gap-10 items-center text-white font-bold uppercase tracking-widest text-sm"
            >
                {/* Renderizamos duas vezes para criar o loop infinito */}
                {[...messages, ...messages].map((msg, i) => (
                    <span key={i} className="flex items-center gap-10">
                        {msg} <span className="text-pink-300">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
};
