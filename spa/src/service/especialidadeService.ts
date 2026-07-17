import { api } from "./api";

export const especialidadeService = {
    async getAll() {
        const response = await api.get('/especialidade');
        return response.data.data;
    },
};
