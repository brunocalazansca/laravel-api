import { api } from './api';

export interface PlantaoPayload {
    user_id: number;
    data: string;       // YYYY-MM-DD
    hora_inicio: string; // HH:mm
    hora_fim: string;    // HH:mm
    setor: string;
}

export interface Plantao {
    id: number;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    setor: string;
    status: string;
    medico: { id: number; nome: string; cargo: string };
}

export const plantaoService = {
    async create(payload: PlantaoPayload): Promise<Plantao> {
        const res = await api.post('/plantao', payload);
        return res.data;
    },

    async update(id: number, payload: Partial<PlantaoPayload>): Promise<Plantao> {
        const res = await api.put(`/plantao/${id}`, payload);
        return res.data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/plantao/${id}`);
    },

    async getPorPeriodo(inicio: string, fim: string): Promise<Plantao[]> {
        const res = await api.get('/plantao/periodo', { params: { inicio, fim } });
        // 404 quando vazio é tratado como lista vazia
        return res.data?.data ?? res.data ?? [];
    },

    async removeByMatch(userId: number, data: string, setor: string): Promise<void> {
        await api.delete('/plantao/match', { params: { user_id: userId, data, setor } });
    },
};
