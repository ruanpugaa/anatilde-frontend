import { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../@types/product';

const UPLOADS_URL = 'https://anatilde.com.br/uploads/produtos/';

export const EasterProductSelector = memo(({ products, selectedId, onSelect }: {
    products: Product[],
    selectedId?: number,
    onSelect: (p: Product) => void
}) => (
    <footer className="relative z-40 bg-[#080808] border-t border-white/5 pt-6 pb-14">
        <div className="w-full mx-auto px-8 md:px-24">
            <div className="flex items-center justify-between mb-4 px-1">
                <h4 className="text-[12px] uppercase tracking-[0.7em] text-slate-600 font-bold italic font-serif">Nossos Sabores</h4>
                <div className="flex gap-4">
                    <button className="nav-prev-v12 p-1 text-slate-700 hover:text-pink-500 cursor-pointer transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="nav-next-v12 p-1 text-slate-700 hover:text-pink-500 cursor-pointer transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={3.5}
                navigation={{ nextEl: '.nav-next-v12', prevEl: '.nav-prev-v12' }}
                breakpoints={{ 1024: { slidesPerView: 6.2 } }}
                /* Ajuste Staff: Adicionamos padding nas laterais e no topo para 
                   acomodar o scale(1.05) sem clipar os pixels. 
                */
                className="pascoa-swiper-final !pt-4 !px-2 -ml-2"
            >
                {products.map((prod) => (
                    <SwiperSlide key={prod.id} className="!overflow-visible">
                        <div 
                            onClick={() => onSelect(prod)}
                            className={`relative cursor-pointer transition-all duration-300 will-change-transform ${
                                selectedId === prod.id ? 'opacity-100 scale-105' : 'opacity-20 grayscale hover:opacity-50'
                            }`}
                        >
                            <div className={`aspect-video rounded-md overflow-hidden border transition-all duration-300 ${
                                selectedId === prod.id 
                                    ? 'border-pink-500 shadow-lg shadow-pink-500/20' 
                                    : 'border-white/5'
                            }`}>
                                <img 
                                    src={prod.image_url.startsWith('http') ? prod.image_url : `${UPLOADS_URL}${prod.image_url}`} 
                                    className="w-full h-full object-cover" 
                                    alt={prod.name} 
                                    loading="lazy"
                                />
                            </div>
                            <p className={`mt-2 text-[10px] font-bold uppercase  text-center truncate ${
                                selectedId === prod.id ? 'text-pink-500' : 'text-slate-700'
                            }`}>
                                {prod.name}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        {/* CSS Scoped para garantir que o overflow não corte o efeito de luxo */}
        <style dangerouslySetInnerHTML={{ __html: `
            .pascoa-swiper-final { 
                overflow: visible !important; 
                clip-path: inset(-20px -20px -20px -20px);
            }
            .pascoa-swiper-final .swiper-wrapper {
                cursor: grab;
            }
            @media (max-width: 768px) {
                .pascoa-swiper-final {
                    padding-left: 10px !important;
                    padding-right: 10px !important;
                }
            }
        `}} />
    </footer>
));

EasterProductSelector.displayName = 'EasterProductSelector';