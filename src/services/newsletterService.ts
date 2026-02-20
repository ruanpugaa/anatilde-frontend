import axios from 'axios';
import { z } from 'zod';

/**
 * SCHEMA DE VALIDAÇÃO (SSOT - Single Source of Truth)
 */
export const newsletterSchema = z.object({
    name: z.string()
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .max(50, "Nome muito longo"),
    email: z.string()
        .email("Insira um e-mail válido")
        .trim()
        .toLowerCase()
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

const API_URL = 'https://anatilde.com.br/api/newsletter.php';

export const newsletterService = {
    subscribe: async (data: NewsletterData): Promise<void> => {
        try {
            // Runtime Validation
            const validatedData = newsletterSchema.parse(data);

            await axios.post(API_URL, validatedData, {
                timeout: 10000, 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('API Error:', error.response?.data || error.message);
            } else if (error instanceof z.ZodError) {
                // CORREÇÃO: No Zod, usamos .issues para acessar a lista de erros
                console.error('Validation Error:', error.issues);
            } else {
                console.error('Unexpected Error:', error);
            }
            
            throw error;
        }
    }
};