import { Instagram, Phone, MessageCircle } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                {/* Coluna 1: Logo e Bio */}
                <div className="space-y-4">
                    <h3 className="text-white text-2xl font-bold">DOCE<span className="text-pink-500">MAGIA</span></h3>
                    <p className="text-sm leading-relaxed">
                        Criando momentos inesquecíveis através de doces artesanais desde 2015. Qualidade e carinho em cada detalhe.
                    </p>
                </div>

                {/* Coluna 2: Links Rápidos */}
                <div>
                    <h4 className="text-white font-bold mb-6">Navegação</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="/sabores" className="hover:text-pink-500 transition">Cardápio de Sabores</a></li>
                        <li><a href="/pascoa" className="hover:text-pink-500 transition">Especial de Páscoa</a></li>
                        <li><a href="/quem-somos" className="hover:text-pink-500 transition">Nossa História</a></li>
                    </ul>
                </div>

                {/* Coluna 3: Contato */}
                <div>
                    <h4 className="text-white font-bold mb-6">Contato</h4>
                    <div className="space-y-4 text-sm">
                        <p className="flex items-center gap-2"><Phone size={16} /> (11) 4002-8922</p>
                        <p className="flex items-center gap-2"><MessageCircle size={16} /> (11) 99999-9999</p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-white"><Instagram size={20} /></a>
                        </div>
                    </div>
                </div>

                {/* Coluna 4: Localização */}
                <div>
                    <h4 className="text-white font-bold mb-6">Loja Física</h4>
                    <p className="text-sm">
                        Rua das Confeitarias, 123<br />
                        Bairro Doce - Cidade/UF<br />
                        CEP: 00000-000
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60 gap-4">
                <p>© 2026 Doce Magia Sobremesas S.A. - CNPJ: 00.000.000/0001-00</p>
                <p>Desenvolvido com ❤️ para momentos doces.</p>
            </div>
        </footer>
    );
};