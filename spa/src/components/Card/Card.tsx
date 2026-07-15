import { ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps {
    children: ReactNode;
}

export function Card({ children }: CardProps) {
    return (
        <div className={styles.card}>
            {children}
        </div>
    );
}