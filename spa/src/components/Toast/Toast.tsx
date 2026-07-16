import React, { useEffect } from 'react';
import { MdError, MdCheckCircle, MdWarning } from 'react-icons/md';
import styles from './Toast.module.scss';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export function Toast({
    message,
    type,
    onClose
}: ToastProps) {

    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    const renderIcon = () => {
        switch (type) {
            case 'error':
                return <MdError className={styles.icon} />;
            case 'success':
                return <MdCheckCircle className={styles.icon} />;
            case 'warning':
                return <MdWarning className={styles.icon} />;
        }
    };

    return (
        <div className={`${styles.toastWrapper} ${styles[type]}`}>
            {renderIcon()}
            <span className={styles.message}>{message}</span>
        </div>
    );
}