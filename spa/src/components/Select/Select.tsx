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
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = options.find((o) => o.value === value);
    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    function handleSelect(optValue: string | number) {
        onChange?.({ target: { value: String(optValue) } });
        setOpen(false);
        setSearch('');
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
                    <div className={styles.searchWrapper}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            ref={inputRef}
                            className={styles.searchInput}
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className={styles.optionsList}>
                        {filtered.length === 0 ? (
                            <div className={styles.empty}>Nenhum resultado</div>
                        ) : (
                            filtered.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`${styles.option} ${opt.value === value ? styles.optionSelected : ''}`}
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
