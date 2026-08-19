import { api } from "./api";

export const especialidadeService = {
    async getAll() {
        const response = await api.get('/especialidade');
        return response.data.data;
    },
    async create(nome: string) {
        const response = await api.post('/especialidade', { nome });
        return response.data.data;
    },
    async update(id: number, nome: string) {
        const response = await api.put(`/especialidade/${id}`, { nome });
        return response.data.data;
    },
    async remove(id: number) {
        await api.delete(`/especialidade/${id}`);
    },
};
