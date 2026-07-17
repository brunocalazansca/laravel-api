import React from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
    return (
        <div className={styles.checkboxWrapper}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className={styles.input}
            />
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
        </div>
    );
}