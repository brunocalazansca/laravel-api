import React, { useState, useEffect } from 'react';
import { Card } from '@/src/components/Card/Card';
import { Toggle } from '@/src/components/Toggle/Toggle';
import { Input } from '@/src/components/Input/Input';
import { Button } from '@/src/components/Button/Button';
import styles from './LoginCadastro.module.scss';
import estetoscopio from '@/src/assets/estetoscopio.png';
import { authService } from "@/src/service/authService";
import { Toast, type ToastType } from "@/src/components/Toast/Toast";

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);

    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab);
    };

    useEffect(() => {
        setEmail('');
        setSenha('');
        setNome('');
        setConfirmarSenha('');
    }, [activeTab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (activeTab === 'login') {
                const response = await authService.login({ email, senha });
                localStorage.setItem('token', response.token);

                setToast({ message: "Login realizado com sucesso!", type: 'success' });
            } else {
                if (senha !== confirmarSenha) {
                    setToast({ message: "As senhas não coincidem!", type: 'error' });
                    return;
                }

                await authService.register({ nome, email, senha });

                setToast({ message: 'Cadastro realizado com sucesso!', type: 'success' });

                const loginResponse = await authService.login({ email, senha });
                localStorage.setItem('token', loginResponse.token);

                setTimeout(() => {
                    navigate('/completar-perfil');
                }, 1500);
            }

        } catch (error: any) {
            const mensagem = error.response?.data?.message || 'Erro de validação nos dados.';

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
                <img src={estetoscopio} alt="Estetoscópio" className={styles.icone}/>
                <span className={styles.logoText}>
                     PlantãoMed
                </span>
            </div>

            <Card>
                <Toggle activeTab={activeTab} onTabChange={handleTabChange} />

                <form key={activeTab} onSubmit={handleSubmit} autoComplete="off">
                    {activeTab === "register" && (
                        <Input
                            id="nome"
                            type="text"
                            label="Nome completo"
                            placeholder="Seu nome completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    )}

                    <Input
                        id="email"
                        type="email"
                        label="E-mail"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        id="senha"
                        type="password"
                        label="Senha"
                        placeholder="Mínimo 8 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    {activeTab === "register" && (
                        <Input
                            id="confirmarSenha"
                            type="password"
                            label="Confirmar senha"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />
                    )}

                    <Button type="submit">
                        {activeTab === 'login' ? 'Entrar' : 'Criar conta'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}