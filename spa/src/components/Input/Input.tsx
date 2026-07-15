import { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Input({ label, id, ...rest }: InputProps) {
    return (
        <div className={styles.container}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input
                id={id}
                className={styles.input}
                {...rest}
            />
        </div>
    );
}