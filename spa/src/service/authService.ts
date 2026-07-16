import { api } from "./api";

interface DadosLogin {
    email: string;
    senha: string;
}

interface DadosRegistro {
    nome: string;
    email: string;
    senha: string;
}
export const authService = {
    async login(dados: DadosLogin) {
        const response = await api.post('/login', dados);
        return response.data;
    },

    async register(dados: DadosRegistro) {
        const response = await api.post('/user', dados);
        return response.data;
    }
};