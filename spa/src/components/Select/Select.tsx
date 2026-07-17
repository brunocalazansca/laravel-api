import { useState, useRef, useEffect } from 'react';
import styles from './Select.module.scss';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    id?: string;
    label: string;
    options: SelectOption[];
    placeholder?: string;
    value?: string | number;
    onChange?: (e: { target: { value: string } }) => void;
}

export function Select({ label, id, options, placeholder, value, onChange }: SelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSelect(optValue: string | number) {
        onChange?.({ target: { value: String(optValue) } });
        setOpen(false);
    }

    return (
        <div className={styles.container} ref={ref}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <div
                id={id}
                className={`${styles.select} ${open ? styles.open : ''}`}
                onClick={() => setOpen((o) => !o)}
            >
                <span className={selected ? styles.selectedText : styles.placeholder}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg className={`${styles.arrow} ${open ? styles.arrowUp : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
            {open && (
                <div className={styles.dropdown}>
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`${styles.option} ${opt.value === value ? styles.optionSelected : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
