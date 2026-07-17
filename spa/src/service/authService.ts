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
        const { access_token, user } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user_id', user.id);

        const cadastroCompleto = user.cargo && user.registro_profissional && user.especialidade && user.carga_horaria_maxima;
        localStorage.setItem('cadastro_completo', cadastroCompleto ? 'true' : 'false');

        return response.data;
    },

    async register(dados: DadosRegistro) {
        const response = await api.post('/user', dados);
        return response.data;
    },

    async getById(id: number) {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },

    async update(id: number, dados: Record<string, unknown>) {
        const response = await api.put(`/user/${id}`, dados);
        return response.data;
    },

    async getAll() {
        const response = await api.get('/user');
        return response.data;
    }
};