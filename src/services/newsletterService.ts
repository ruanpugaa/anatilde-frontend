import api from './api'; 
import { z } from 'zod';

/**
 * SCHEMA DE VALIDAÇÃO (SSOT)
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

export const newsletterService = {
    /**
     * STAFF SYNC: Corrigido para apontar para o arquivo real /modules/forms/process_newsletter.php
     */
    subscribe: async (data: NewsletterData): Promise<void> => {
        try {
            // 1. Validação em Runtime com Zod
            const validatedData = newsletterSchema.parse(data);

            // 2. Chamada para o endpoint correto
            // STAFF FIX: O caminho real é este abaixo
            await api.post('/modules/forms/process_newsletter.php', validatedData);

        } catch (error: any) {
            if (error instanceof z.ZodError) {
                console.error('Validation Error (Zod):', error.issues);
                throw new Error("Dados de inscrição inválidos.");
            }
            
            // Repassa o erro para o componente tratar com toast
            throw error;
        }
    }
};