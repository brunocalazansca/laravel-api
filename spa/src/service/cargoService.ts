import { api } from "./api";

export const cargoService = {
    async getAll() {
        const response = await api.get('/cargo');
        return response.data.data;
    },
    async create(nome: string) {
        const response = await api.post('/cargo', { nome });
        return response.data.data;
    },
    async update(id: number, nome: string) {
        const response = await api.put(`/cargo/${id}`, { nome });
        return response.data.data;
    },
    async remove(id: number) {
        await api.delete(`/cargo/${id}`);
    },
};
