import React, { useState, useEffect } from 'react';
import { Card } from '@/src/components/Card/Card';
import { Toggle } from '@/src/components/Toggle/Toggle';
import { Input } from '@/src/components/Input/Input';
import { Button } from '@/src/components/Button/Button';
import { Checkbox } from '@/src/components/Checkbox/Checkbox'
import styles from './LoginCadastro.module.scss';
import estetoscopio from '@/src/assets/estetoscopio.png';
import { authService } from "@/src/service/authService";
import { Toast, type ToastType } from "@/src/components/Toast/Toast";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
    const navigate = useNavigate();

    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        setMostrarSenha(false);
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
                if (!email.trim() || !senha.trim()) {
                    setToast({ message: "Preencha todos os campos!", type: 'warning' });
                    return;
                }

                await authService.login({ email, senha });

                setToast({ message: "Login realizado com sucesso!", type: 'success' });

                const destino = localStorage.getItem('cadastro_completo') === 'true' ? '/plantoes' : '/finalizar-cadastro';
                setTimeout(() => navigate(destino), 1500);

            } else {
                if (senha !== confirmarSenha) {
                    setToast({ message: "As senhas não coincidem!", type: 'error' });
                    return;
                }

                if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
                    setToast({ message: "Preencha todos os campos!", type: 'warning' });
                    return;
                }

                await authService.register({ nome, email, senha });

                setToast({ message: 'Cadastro realizado com sucesso!', type: 'success' });

                await authService.login({ email, senha });

                setTimeout(() => {
                    navigate('/finalizar-cadastro');
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
                        />
                    )}

                    <Input
                        id="email"
                        type="email"
                        label="E-mail"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        id="senha"
                        type={mostrarSenha ? "text" : "password"}
                        label="Senha"
                        placeholder="Mínimo 8 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    {activeTab === "register" && (
                        <Input
                            id="confirmarSenha"
                            type={mostrarSenha ? "text" : "password"}
                            label="Confirmar senha"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                    )}

                    <Checkbox
                        id="mostrarSenha"
                        label="Mostrar senha"
                        checked={mostrarSenha}
                        onChange={(e) => setMostrarSenha(e.target.checked)}
                    />

                    <Button type="submit">
                        {activeTab === 'login' ? 'Entrar' : 'Criar conta'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}