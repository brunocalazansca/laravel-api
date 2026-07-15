import React, { useState } from 'react';
import { Card } from '@/src/components/Card/Card';
import { Toggle } from '@/src/components/Toggle/Toggle';
import { Input } from '@/src/components/Input/Input';
import { Button } from '@/src/components/Button/Button';
import styles from './LoginCadastro.module.scss';
import estetoscopio from '@/src/assets/estetoscopio.png';

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'login') {
            console.log('Fazendo login com:', { email, senha });
        } else {
            console.log('Criando conta com:', { email, senha });
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
                <Toggle activeTab={activeTab} onTabChange={setActiveTab} />

                <form onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        type="email"
                        label="E-mail"
                        placeholder="exemplo@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        id="senha"
                        type="password"
                        label="Senha"
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    <Button type="submit">
                        {activeTab === 'login' ? 'Entrar' : 'Criar conta'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}