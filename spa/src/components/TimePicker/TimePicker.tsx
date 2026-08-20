import React, { useState, useRef, useEffect } from 'react';
import styles from './TimePicker.module.scss';
import { Clock } from 'lucide-react';

interface TimePickerProps {
    value: string; // 'HH:mm'
    onChange: (val: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);

    const [h, m] = (value || '').split(':');

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to selected on open
    useEffect(() => {
        if (isOpen) {
            const hEl = hoursRef.current?.querySelector(`.${styles.selected}`);
            const mEl = minutesRef.current?.querySelector(`.${styles.selected}`);
            if (hEl) hEl.scrollIntoView({ block: 'center' });
            if (mEl) mEl.scrollIntoView({ block: 'center' });
        }
    }, [isOpen]);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    function selectHour(hour: string) {
        onChange(`${hour}:${m || '00'}`);
    }

    function selectMinute(minute: string) {
        onChange(`${h || '00'}:${minute}`);
    }

    return (
        <div className={styles.wrapper} ref={containerRef}>
            <button 
                type="button" 
                className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value || '--:--'}</span>
                <Clock size={14} color={isOpen ? "#0F9AA6" : "#94A3B8"} />
            </button>
            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.column} ref={hoursRef}>
                        {hours.map(hour => (
                            <button
                                key={hour}
                                type="button"
                                className={`${styles.item} ${hour === h ? styles.selected : ''}`}
                                onClick={() => selectHour(hour)}
                            >
                                {hour}
                            </button>
                        ))}
                    </div>
                    <div className={styles.column} ref={minutesRef}>
                        {minutes.map(min => (
                            <button
                                key={min}
                                type="button"
                                className={`${styles.item} ${min === m ? styles.selected : ''}`}
                                onClick={() => selectMinute(min)}
                            >
                                {min}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
