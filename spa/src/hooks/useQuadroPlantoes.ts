import React, { useState, useEffect, useCallback, useRef } from "react";
import type { DayId, ShiftId, DragOrigin, Assignments, StaffMember } from "@/src/types/quadroPlantoes";
import type { Day } from "@/src/types/quadroPlantoes";
import { authService } from "@/src/service/authService";
import { plantaoService } from "@/src/service/plantaoService";
import { SHIFT_HOURS } from "@/src/constants/quadroPlantoes";
import type { ShiftHoursMap } from "@/src/types/quadroPlantoes";

function toMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

const DAY_LABEL: string[] = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const DAY_ID: DayId[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

function buildDays(startDate: Date, endDate: Date): Day[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: Day[] = [];
    const cur = new Date(startDate);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    while (cur <= end) {
        const dow = cur.getDay();
        days.push({
            id: DAY_ID[dow],
            label: DAY_LABEL[dow],
            date: cur.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            isToday: cur.getTime() === today.getTime(),
            _iso: formatISO(cur),
        });
        cur.setDate(cur.getDate() + 1);
    }
    return days;
}

function formatISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function cellKey(dayId: DayId, shiftId: ShiftId): string {
    return `${dayId}__${shiftId}`;
}

/* ── mapeamento setor → shiftId ──────────────────────────────────── */

const SETOR_TO_SHIFT: Record<string, ShiftId> = {
    manha: "manha",
    tarde: "tarde",
    noite: "noite",
};

/* ── hook principal ──────────────────────────────────────────────── */

export function useQuadroPlantoes() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [emailUsuario, setEmailUsuario] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [assignments, setAssignments] = useState<Assignments>({});
    const [dragStaffId, setDragStaffId] = useState<string | null>(null);
    const [dragOrigin, setDragOrigin] = useState<DragOrigin | null>(null);
    const [hoverCell, setHoverCell] = useState<string | null>(null);
    const [poolHover, setPoolHover] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shiftHours, setShiftHours] = useState<ShiftHoursMap>({ ...SHIFT_HOURS });
    const [startDate, setStartDate] = useState<Date | null>(() => toMonday(new Date()));
    const [endDate, setEndDate] = useState<Date | null>(() => {
        const d = toMonday(new Date());
        d.setDate(d.getDate() + 6);
        return d;
    });

    // Ref para guardar os days atuais (evita recalcular em callbacks)
    const daysRef = useRef<(Day & { _iso: string })[]>([]);

    function handleRangeChange(start: Date, end: Date) {
        setStartDate(start);
        setEndDate(end);
    }

    const days = startDate && endDate ? buildDays(startDate, endDate) : [];
    daysRef.current = days as (Day & { _iso: string })[];

    /* ── resolve a data ISO a partir de um DayId ─────────────────── */

    function resolveISO(dayId: DayId): string {
        const found = daysRef.current.find((d) => d.id === dayId);
        return found?._iso ?? '';
    }

    /* ── carregamento inicial de usuário e staff ─────────────────── */

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            authService.getById(Number(userId)).then((data) => {
                setEmailUsuario(data.data.email);
                setIsAdmin(data.data.tipo === 'admin');
            });
        }

        authService.getAll().then((data) => {
            const VALID_ROLES = ["Médico(a)", "Enfermeiro(a)", "Técnico(a)"];
            const usuarios: StaffMember[] = data.data.map((u: any) => ({
                id: String(u.id),
                name: u.nome,
                role: VALID_ROLES.includes(u.cargo) ? u.cargo : "Médico(a)",
            }));
            setStaff(usuarios);
        });
    }, []);

    /* ── carregar plantões do período ─────────────────────────────── */

    const loadPlantoes = useCallback(async (inicio: string, fim: string) => {
        setLoading(true);
        try {
            const plantoes = await plantaoService.getPorPeriodo(inicio, fim);
            const newAssignments: Assignments = {};

            for (const p of plantoes) {
                const shiftId = SETOR_TO_SHIFT[p.setor];
                if (!shiftId || !p.medico) continue;

                // Encontrar o dayId correspondente à data do plantão
                const dayEntry = daysRef.current.find((d) => d._iso === p.data);
                if (!dayEntry) continue;

                const key = cellKey(dayEntry.id, shiftId);
                const staffId = String(p.medico.id);

                if (!newAssignments[key]) {
                    newAssignments[key] = [];
                }
                if (!newAssignments[key]!.includes(staffId)) {
                    newAssignments[key]!.push(staffId);
                }
            }

            setAssignments(newAssignments);
        } catch (err) {
            // Se 404 (sem plantões no período), apenas limpar
            setAssignments({});
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            loadPlantoes(formatISO(startDate), formatISO(endDate));
        }
    }, [startDate, endDate, loadPlantoes]);

    const assignedIds = new Set(Object.values(assignments).flatMap((a) => a ?? []));
    const poolStaff = staff.filter((p) => !assignedIds.has(p.id));
    const staffById = Object.fromEntries(staff.map((s) => [s.id, s]));

    function handleDragStart(e: React.DragEvent, staffId: string, origin: DragOrigin | null) {
        setDragStaffId(staffId);
        setDragOrigin(origin);
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", staffId); } catch { /* noop */ }
    }

    function handleDragEnd() {
        setDragStaffId(null);
        setDragOrigin(null);
        setHoverCell(null);
        setPoolHover(false);
    }

    function removeFromOrigin(next: Assignments) {
        if (!dragOrigin || !dragStaffId) return;
        const key = cellKey(dragOrigin.dayId, dragOrigin.shiftId);
        const filtered = (next[key] || []).filter((id) => id !== dragStaffId);
        filtered.length === 0 ? delete next[key] : (next[key] = filtered);
    }

    function handleDropOnCell(e: React.DragEvent, dayId: DayId, shiftId: ShiftId) {
        e.preventDefault();
        if (!dragStaffId) return;

        const staffId = dragStaffId;
        const origin = dragOrigin;

        setAssignments((prev) => {
            const next = { ...prev };
            removeFromOrigin(next);
            const key = cellKey(dayId, shiftId);
            const list = next[key] ? [...(next[key] as string[])] : [];
            if (!list.includes(staffId)) list.push(staffId);
            next[key] = list;
            return next;
        });

        const snapshot = { ...assignments };

        handleDragEnd();

        (async () => {
            try {
                if (origin) {
                    const oldISO = resolveISO(origin.dayId);
                    if (oldISO) {
                        await plantaoService.removeByMatch(
                            Number(staffId),
                            oldISO,
                            origin.shiftId,
                        );
                    }
                }

                const newISO = resolveISO(dayId);
                const hours = shiftHours[shiftId];
                await plantaoService.create({
                    user_id: Number(staffId),
                    data: newISO,
                    hora_inicio: hours.hora_inicio,
                    hora_fim: hours.hora_fim,
                    setor: shiftId,
                });
            } catch (err: any) {
                console.error('Erro ao salvar plantão:', err);
                setAssignments(snapshot);
                const msg = err?.response?.data?.message || 'Erro ao salvar plantão.';
                alert(msg);
            }
        })();
    }

    function handleDropOnPool(e: React.DragEvent) {
        e.preventDefault();
        if (!dragStaffId || !dragOrigin) { handleDragEnd(); return; }

        const staffId = dragStaffId;
        const origin = dragOrigin;
        const snapshot = { ...assignments };

        setAssignments((prev) => { const next = { ...prev }; removeFromOrigin(next); return next; });

        handleDragEnd();

        (async () => {
            try {
                const iso = resolveISO(origin.dayId);
                if (iso) {
                    await plantaoService.removeByMatch(
                        Number(staffId),
                        iso,
                        origin.shiftId,
                    );
                }
            } catch (err: any) {
                console.error('Erro ao remover plantão:', err);
                setAssignments(snapshot);
                const msg = err?.response?.data?.message || 'Erro ao remover plantão.';
                alert(msg);
            }
        })();
    }


    function removeAssignment(dayId: DayId, shiftId: ShiftId, staffId: string) {
        const snapshot = { ...assignments };
        setAssignments((prev) => {
            const key = cellKey(dayId, shiftId);
            const next = { ...prev };
            const filtered = (next[key] || []).filter((id) => id !== staffId);
            filtered.length === 0 ? delete next[key] : (next[key] = filtered);
            return next;
        });

        (async () => {
            try {
                const iso = resolveISO(dayId);
                if (iso) {
                    await plantaoService.removeByMatch(
                        Number(staffId),
                        iso,
                        shiftId,
                    );
                }
            } catch (err: any) {
                console.error('Erro ao remover plantão:', err);
                setAssignments(snapshot);
                const msg = err?.response?.data?.message || 'Erro ao remover plantão.';
                alert(msg);
            }
        })();
    }

    /* ── Edição de horários dos turnos ──────────────────────────── */

    function timeToMinutes(t: string): number {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    }

    function shiftDuration(inicio: string, fim: string): number {
        const a = timeToMinutes(inicio);
        const b = timeToMinutes(fim);
        return b > a ? b - a : 1440 - a + b; // cruza meia-noite
    }

    /**
     * Atualiza os horários de todos os turnos de uma vez.
     * Retorna null em caso de sucesso, ou uma string de erro se os turnos não somarem 24h.
     */
    function updateAllShiftHours(newHours: import("@/src/types/quadroPlantoes").ShiftHoursMap): string | null {
        const total = (['manha', 'tarde', 'noite'] as ShiftId[]).reduce(
            (sum, id) => sum + shiftDuration(newHours[id].hora_inicio, newHours[id].hora_fim),
            0
        );

        if (total !== 1440) {
            return `Os turnos somam ${Math.floor(total / 60)}h${String(total % 60).padStart(2, '0')} — devem somar exatamente 24h00.`;
        }

        setShiftHours(newHours);
        return null;
    }

    return {
        staff,
        emailUsuario,
        isAdmin,
        assignments,
        dragStaffId,
        hoverCell,
        poolHover,
        poolStaff,
        staffById,
        days,
        startDate,
        endDate,
        loading,
        shiftHours,
        handleRangeChange,
        setHoverCell,
        setPoolHover,
        handleDragStart,
        handleDragEnd,
        handleDropOnCell,
        handleDropOnPool,
        removeAssignment,
        updateAllShiftHours,
    };
}
