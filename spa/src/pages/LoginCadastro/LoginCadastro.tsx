import React, { useState } from 'react';
import { Card } from '@/src/components/Card/Card';
import { Toggle } from '@/src/components/Toggle/Toggle';
import { Input } from '@/src/components/Input/Input';
import { Button } from '@/src/components/Button/Button';
import styles from './LoginCadastro.module.scss';
import estetoscopio from '@/src/assets/estetoscopio.png';
import { authService } from "@/src/service/authService";

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        setEmail('');
        setSenha('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (activeTab === 'login') {
                const response = await authService.login({ email, senha });

                localStorage.setItem('token', response.token);

                alert("Login realizado com sucesso!")!
            } else {
                if (senha !== confirmarSenha) {
                    alert("As senhas não coincidem!");
                    return;
                }

                const resposta = await authService.register({ nome, email, senha });

                if (resposta.data.tipo === 'admin') {
                    alert('Setup inicial concluído! Você é o Administrador. Faça login.');
                } else {
                    alert('Conta criada com sucesso! Aguarde a aprovação da administração.');
                }

                handleTabChange('login');
            }

        } catch (error: any) {
            console.error('Erro na requisição:', error);

            console.log('Erros de validação:', error.response?.data?.errors);

            const mensagem = error.response?.data?.message || 'Ocorreu um erro inesperado.';
            alert(mensagem);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.logo}>
                <img src={estetoscopio} alt="Estetoscópio" className={styles.icone}/>
                <span className={styles.logoText}>
                     PlantãoMed
                </span>
            </div>

            <Card>
                <Toggle activeTab={activeTab} onTabChange={handleTabChange} />

                <form onSubmit={handleSubmit}>
                    {activeTab === "register" && (
                        <Input
                            id="nome"
                            type="name"
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
                            id="senha"
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