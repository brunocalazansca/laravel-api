import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, ...rest }: ButtonProps) {
    return (
        <button
            className={styles.button}
            {...rest}
        >
            {children}
        </button>
    );
}