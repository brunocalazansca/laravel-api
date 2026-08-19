import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cargoService } from '../../service/cargoService';
import { especialidadeService } from '../../service/especialidadeService';
import { Toast, type ToastType } from '../../components/Toast/Toast';
import styles from './Admin.module.scss';

type Item = { id: number; nome: string };
type Section = 'cargo' | 'especialidade';
type ToastState = { message: string; type: ToastType } | null;
type ModalState = {
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'primary' | 'danger';
    onConfirm: () => void;
} | null;

export default function Admin() {
    const navigate = useNavigate();
    const [section, setSection] = useState<Section>('cargo');
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editNome, setEditNome] = useState('');
    const [toast, setToast] = useState<ToastState>(null);
    const [modal, setModal] = useState<ModalState>(null);

    function showToast(message: string, type: ToastType) {
        setToast({ message, type });
    }

    function confirm(opts: NonNullable<ModalState>) {
        setModal(opts);
    }

    function closeModal() {
        setModal(null);
    }

    const svc = section === 'cargo' ? cargoService : especialidadeService;

    useEffect(() => {
        load();
    }, [section]);

    async function load() {
        setLoading(true);
        try {
            setItems(await svc.getAll());
        } catch {
            showToast('Erro ao carregar dados.', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!nome.trim()) return;
        confirm({
            title: `Adicionar ${label}`,
            message: `Deseja adicionar "${nome.trim()}" como novo ${label.toLowerCase()}?`,
            confirmLabel: 'Adicionar',
            variant: 'primary',
            onConfirm: async () => {
                closeModal();
                try {
                    const created = await svc.create(nome.trim());
                    setItems(prev => [...prev, created]);
                    setNome('');
                    showToast(`${label} criado com sucesso!`, 'success');
                } catch {
                    showToast('Erro ao criar. Verifique se o nome já existe.', 'error');
                }
            },
        });
    }

    async function handleUpdate(id: number) {
        if (!editNome.trim()) return;
        confirm({
            title: `Editar ${label}`,
            message: `Deseja salvar as alterações para "${editNome.trim()}"?`,
            confirmLabel: 'Salvar',
            variant: 'primary',
            onConfirm: async () => {
                closeModal();
                try {
                    const updated = await svc.update(id, editNome.trim());
                    setItems(prev => prev.map(i => i.id === id ? updated : i));
                    setEditingId(null);
                    showToast(`${label} atualizado com sucesso!`, 'success');
                } catch {
                    showToast('Erro ao atualizar.', 'error');
                }
            },
        });
    }

    async function handleDelete(id: number) {
        const item = items.find(i => i.id === id);
        confirm({
            title: `Excluir ${label}`,
            message: `Tem certeza que deseja excluir "${item?.nome}"? Esta ação não pode ser desfeita.`,
            confirmLabel: 'Excluir',
            variant: 'danger',
            onConfirm: async () => {
                closeModal();
                try {
                    await svc.remove(id);
                    setItems(prev => prev.filter(i => i.id !== id));
                    showToast(`${label} excluído com sucesso!`, 'success');
                } catch {
                    showToast('Erro ao excluir. Pode haver registros vinculados.', 'error');
                }
            },
        });
    }

    function startEdit(item: Item) {
        setEditingId(item.id);
        setEditNome(item.nome);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/login');
    }

    const label = section === 'cargo' ? 'Cargo' : 'Especialidade';

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}>
                    <span className={styles.brandDot} />
                    Admin
                </div>
                <nav className={styles.nav}>
                    <button
                        className={`${styles.navItem} ${section === 'cargo' ? styles.active : ''}`}
                        onClick={() => { setSection('cargo'); setEditingId(null); }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                        Cargos
                    </button>
                    <button
                        className={`${styles.navItem} ${section === 'especialidade' ? styles.active : ''}`}
                        onClick={() => { setSection('especialidade'); setEditingId(null); }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/></svg>
                        Especialidades
                    </button>
                    <button
                        className={styles.navItem}
                        onClick={() => navigate('/plantoes')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Quadro de Plantões
                    </button>
                </nav>
                <button className={styles.logoutBtn} onClick={logout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sair
                </button>
            </aside>

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{label}s</h1>
                    <p className={styles.subtitle}>Gerencie os {label.toLowerCase()}s cadastrados no sistema</p>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Novo {label}</h2>
                    <form className={styles.form} onSubmit={handleCreate}>
                        <input
                            className={styles.input}
                            placeholder={`Nome do ${label.toLowerCase()}`}
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
                        <button className={styles.btnPrimary} type="submit">Adicionar</button>
                    </form>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Lista de {label}s</h2>
                    {loading ? (
                        <p className={styles.empty}>Carregando...</p>
                    ) : items.length === 0 ? (
                        <p className={styles.empty}>Nenhum {label.toLowerCase()} cadastrado.</p>
                    ) : (
                        <ul className={styles.list}>
                            {items.map(item => (
                                <li key={item.id} className={styles.listItem}>
                                    {editingId === item.id ? (
                                        <div className={styles.editRow}>
                                            <input
                                                className={styles.input}
                                                value={editNome}
                                                onChange={e => setEditNome(e.target.value)}
                                                autoFocus
                                            />
                                            <button className={styles.btnPrimary} onClick={() => handleUpdate(item.id)}>Salvar</button>
                                            <button className={styles.btnGhost} onClick={() => setEditingId(null)}>Cancelar</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className={styles.itemName}>{item.nome}</span>
                                            <div className={styles.actions}>
                                                <button className={styles.btnGhost} onClick={() => startEdit(item)}>Editar</button>
                                                <button className={styles.btnDanger} onClick={() => handleDelete(item.id)}>Excluir</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {modal && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <p className={styles.modalTitle}>{modal.title}</p>
                        <p className={styles.modalMessage}>{modal.message}</p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnGhost} onClick={closeModal}>Cancelar</button>
                            <button
                                className={modal.variant === 'danger' ? styles.btnConfirmDanger : styles.btnConfirmPrimary}
                                onClick={modal.onConfirm}
                            >
                                {modal.confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
