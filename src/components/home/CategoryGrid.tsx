import { motion } from "framer-motion";

const categories = [
    {
        id: 1,
        title: "Brigadeiros Gourmet",
        size: "col-span-2 row-span-2",
        img: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=800",
    },
    {
        id: 2,
        title: "Bolos de Pote",
        size: "col-span-1 row-span-1",
        img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800",
    },
    {
        id: 3,
        title: "Presentes",
        size: "col-span-1 row-span-2",
        img: "https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?q=80&w=800",
    },
    {
        id: 4,
        title: "Especial Páscoa",
        size: "col-span-1 row-span-1",
        img: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?q=80&w=800",
    },
];

export const CategoryGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[800px]">
            {categories.map((cat, index) => (
                <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative group overflow-hidden rounded-3xl ${cat.size}`}
                >
                    <img
                        src={cat.img}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                        <h3 className="text-white text-2xl font-bold">{cat.title}</h3>
                    </div>
                    <button className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver Produtos
                    </button>
                </motion.div>
            ))}
        </div>
    );
};
