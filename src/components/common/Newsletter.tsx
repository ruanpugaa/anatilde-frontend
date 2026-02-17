import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Send } from 'lucide-react';

export const Newsletter = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Ajuste a URL para o IP/Domínio onde sua API Node está rodando
            await axios.post('http://127.0.0.1:3001/newsletter', formData);
            setStatus('success');
            setFormData({ name: '', email: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <section className="bg-pink-50 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Adoce sua caixa de entrada ✉️
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Receba promoções exclusivas e o nosso cardápio semanal em primeira mão.
                    </p>

                    {status === 'success' ? (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="p-6 bg-green-100 text-green-700 rounded-2xl font-bold">
                            🎉 Tudo certo! Agora você faz parte da nossa lista VIP.
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                            <input
                                required
                                type="text"
                                placeholder="Seu nome"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="flex-1 px-6 py-4 rounded-full border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none"
                            />
                            <input
                                required
                                type="email"
                                placeholder="Seu melhor e-mail"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="flex-1 px-6 py-4 rounded-full border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none"
                            />
                            <button
                                disabled={status === 'loading'}
                                className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Enviando...' : (
                                    <>Cadastrar <Send size={18} /></>
                                )}
                            </button>
                        </form>
                    )}
                    {status === 'error' && <p className="text-red-500 mt-4">Ops! Algo deu errado ou este e-mail já existe.</p>}
                </motion.div>
            </div>
        </section>
    );
};