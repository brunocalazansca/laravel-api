import styles from './Toggle.module.scss';

type TabType = 'login' | 'register';

interface AuthToggleProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Toggle({
    activeTab,
    onTabChange,
}: AuthToggleProps) {
    return (
        <div className={styles.container}>
            <button
                type="button"
                onClick={() => onTabChange('login')}
                className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
            >
                Entrar
            </button>
            <button
                type="button"
                onClick={() => onTabChange('register')}
                className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
            >
                Criar conta
            </button>
        </div>
    );
}