import React, { useState, useEffect } from 'react';
import { Card } from '@/src/components/Card/Card';
import { Input } from '@/src/components/Input/Input';
import { Button } from '@/src/components/Button/Button';
import styles from './FinalizarCadastro.module.scss';
import { authService } from "@/src/service/authService";
import { Toast, type ToastType } from "@/src/components/Toast/Toast";

export default function FinalizarCadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [registroProfissional, setRegistroProfissional] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                        // Dica: Adicione a tag 'disabled' aqui se não quiser que ele mude o email
                    />

                    <Input
                        id="cargo"
                        type="text"
                        label="Cargo ocupado"
                        placeholder="Médico(a), enfermeiro(a)..."
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                    />

                    <Input
                        id="registro-profissional"
                        type="text" /* Corrigido para texto! */
                        label="Registo profissional"
                        placeholder="CRM-12345"
                        value={registroProfissional}
                        onChange={(e) => setRegistroProfissional(e.target.value)}
                    />

                    <Input
                        id="especialidade"
                        type="text"
                        label="Sua especialidade"
                        placeholder="Geral, ortopedista..."
                        value={especialidade}
                        onChange={(e) => setEspecialidade(e.target.value)}
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