import { api } from "./api";

export const cargoService = {
    async getAll() {
        const response = await api.get('/cargo');
        return response.data;
    },

    async create(nome: string) {
        const response = await api.post('/cargo', { nome });
        return response.data;
    }
};
