import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/src/components/Card/Card';
import { Input } from '@/src/components/Input/Input';
import { Select } from '@/src/components/Select/Select';
import { Button } from '@/src/components/Button/Button';
import styles from './FinalizarCadastro.module.scss';
import { authService } from "@/src/service/authService";
import { cargoService } from "@/src/service/cargoService";
import { especialidadeService } from "@/src/service/especialidadeService";
import { Toast, type ToastType } from "@/src/components/Toast/Toast";

interface Cargo {
    id: number;
    nome: string;
}

export default function FinalizarCadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [especialidades, setEspecialidades] = useState<Cargo[]>([]);
    const [registroProfissional, setRegistroProfissional] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        cargoService.getAll().then((data) => setCargos(data)).catch(console.error);
        especialidadeService.getAll().then((data) => setEspecialidades(data)).catch(console.error);

        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        authService.getById(Number(userId)).then((data) => {
            const user = data.data ?? data;
            if (user.nome) setNome(user.nome);
            if (user.email) setEmail(user.email);
            if (user.cargo) setCargo(user.cargo);
            if (user.registro_profissional) setRegistroProfissional(user.registro_profissional);
            if (user.especialidade) setEspecialidade(user.especialidade);
            if (user.carga_horaria_maxima) setCargaHoraria(String(user.carga_horaria_maxima));
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        if (!nome.trim() || !email.trim() || !cargo.trim() || !registroProfissional.trim() || !especialidade.trim() || !cargaHoraria.trim()) {
            setToast({ message: 'Preencha todos os campos!', type: 'warning' });
            return;
        }

        try {
            await authService.update(Number(userId), {
                nome,
                email,
                cargo,
                registro_profissional: registroProfissional,
                especialidade,
                carga_horaria_maxima: Number(cargaHoraria),
            });

            setToast({ message: 'Cadastro finalizado com sucesso!', type: 'success' });

            setTimeout(() => navigate('/plantoes'), 1500);
        } catch (error: any) {
            const mensagem = error.response?.data?.message || 'Erro ao salvar os dados.';
            setToast({ message: mensagem, type: 'error' });
        }
    };

    return (
        <div className={styles.page}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className={styles.logo}>
                <span className={styles.logoText}>
                    Finalize aqui o seu cadastro!
                </span>
            </div>

            <Card>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <Input
                        id="nome"
                        type="text"
                        label="Nome completo"
                        placeholder="Seu nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <Input
                        id="email"
                        type="email"
                        label="E-mail"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Select
                        id="cargo"
                        label="Cargo ocupado"
                        placeholder="Selecione um cargo"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        options={cargos.map((c) => ({ value: c.nome, label: c.nome }))}
                    />

                    <Input
                        id="registro-profissional"
                        type="text"
                        label="Registro profissional"
                        placeholder="CRM-12345"
                        value={registroProfissional}
                        onChange={(e) => setRegistroProfissional(e.target.value)}
                    />

                    <Select
                        id="especialidade"
                        label="Especialidade"
                        placeholder="Selecione uma especialidade"
                        value={especialidade}
                        onChange={(e) => setEspecialidade(e.target.value)}
                        options={especialidades.map((e) => ({ value: e.nome, label: e.nome }))}
                    />

                    <Input
                        id="carga-horaria-maxima"
                        type="number"
                        label="Carga horária semanal"
                        placeholder="40, 44..."
                        value={cargaHoraria}
                        onChange={(e) => setCargaHoraria(e.target.value)}
                    />

                    <Button type="submit">
                        Finalizar Cadastro
                    </Button>
                </form>
            </Card>
        </div>
    );
}
