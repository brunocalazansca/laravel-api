import { api } from "./api";

interface DadosCadastro {
    nome: string;
    email: string;
    senha: string;
}

export const authService = {
    async login(dados: DadosCadastro) {
        const response = await api.post('/login', dados);
        return response.data;
    },

    async register(dados: DadosCadastro) {
        const response = await api.post('/user', dados);
        return response.data;
    }
};