import { memo } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Product } from '../../@types/product';

const UPLOADS_URL = 'https://anatilde.com.br/uploads/produtos/';

export const EasterProductSelector = memo(({ products, selectedId, onSelect }: {
    products: Product[],
    selectedId?: number,
    onSelect: (p: Product) => void
}) => (
    <div className="bg-[#FDFBF7] py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <Swiper
                modules={[FreeMode]}
                spaceBetween={12}
                slidesPerView="auto"
                freeMode={true}
                className="!overflow-visible"
            >
                {products.map((prod) => {
                    const isSelected = selectedId === prod.id;
                    return (
                        <SwiperSlide key={prod.id} style={{ width: 'auto' }}>
                            <div 
                                onClick={() => onSelect(prod)}
                                className="flex flex-col items-center cursor-pointer group"
                            >
                                <motion.div 
                                    initial={false}
                                    animate={{ 
                                        borderColor: isSelected ? '#D4AF37' : '#E5E7EB',
                                        scale: isSelected ? 1 : 0.85,
                                        opacity: isSelected ? 1 : 0.5
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 p-1 ${
                                        isSelected ? 'bg-white shadow-lg' : 'bg-transparent'
                                    }`}
                                >
                                    <img 
                                        src={prod.image_url.startsWith('http') ? prod.image_url : `${UPLOADS_URL}${prod.image_url}`} 
                                        className="w-full h-full object-cover rounded-full"
                                        alt={prod.name} 
                                    />
                                </motion.div>
                                
                                <p className={`mt-2 text-[8px] font-black uppercase tracking-widest text-center transition-colors duration-300 ${
                                    isSelected ? 'text-[#B8860B]' : 'text-stone-300'
                                }`}>
                                    {prod.name.split(' ')[0]}
                                </p>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    </div>
));

EasterProductSelector.displayName = 'EasterProductSelector';