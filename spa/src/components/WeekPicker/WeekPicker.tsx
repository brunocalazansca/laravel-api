import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import styles from './WeekPicker.module.scss';

interface WeekPickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (start: Date, end: Date) => void;
}

function addDays(date: Date, n: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function sameDay(a: Date, b: Date) {
    return a.toDateString() === b.toDateString();
}

function isBetween(date: Date, start: Date, end: Date) {
    return date > start && date < end;
}

function formatDate(d: Date) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
}

function formatLabel(start: Date | null, end: Date | null): string {
    if (!start && !end) return 'Selecionar período';
    if (start && !end) return `${formatDate(start)} – ...`;
    if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
    return 'Selecionar período';
}

function getDaysInMonth(year: number, month: number): Date[] {
    const days: Date[] = [];
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    
    // Sunday is 0, so first.getDay() directly maps to the number of offset days we need.
    for (let i = 0; i < first.getDay(); i++) {
        days.push(addDays(first, -(first.getDay() - i)));
    }
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(addDays(days[days.length - 1], 1));
    return days;
}

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEK_DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export function WeekPicker({ startDate, endDate, onChange }: WeekPickerProps) {
    const today = startOfDay(new Date());
    const [open, setOpen] = useState(false);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [viewMonth, setViewMonth] = useState(() => {
        const d = startDate ?? today;
        return { year: d.getFullYear(), month: d.getMonth() };
    });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    function prevMonth() {
        setViewMonth(({ year, month }) =>
            month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
        );
    }

    function nextMonth() {
        setViewMonth(({ year, month }) =>
            month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
        );
    }

    function handleDayHover(day: Date) {
        const diff = day.getDay();
        setHoverDate(addDays(day, -diff));
    }

    function handleDayClick(day: Date) {
        // Start week on Sunday
        const diff = day.getDay();
        const weekStart = addDays(day, -diff);
        const weekEnd = addDays(weekStart, 6);
        onChange(weekStart, weekEnd);
        setOpen(false);
        setHoverDate(null);
    }

    function getDayClass(day: Date): string {
        const classes = [styles.day];
        const isCurrentMonth = day.getMonth() === viewMonth.month;
        if (!isCurrentMonth) classes.push(styles.dayOtherMonth);
        if (sameDay(day, today)) classes.push(styles.dayToday);

        const rangeStart = hoverDate ?? startDate;
        const rangeEnd = rangeStart ? addDays(rangeStart, 6) : endDate;

        if (rangeStart && sameDay(day, rangeStart)) classes.push(styles.dayRangeStart);
        if (rangeEnd && sameDay(day, rangeEnd)) classes.push(styles.dayRangeEnd);
        if (rangeStart && rangeEnd && isBetween(day, rangeStart, rangeEnd)) classes.push(styles.dayInRange);

        return classes.join(' ');
    }

    const days = getDaysInMonth(viewMonth.year, viewMonth.month);

    function shiftDays(n: number) {
        if (startDate && endDate) {
            onChange(addDays(startDate, n), addDays(endDate, n));
        }
    }

    return (
        <div className={styles.wrapper} ref={ref}>
            <div className={styles.weekNav}>
                <button className={styles.navBtn} onClick={() => shiftDays(-7)} title="Período anterior">
                    <ChevronLeft size={16} />
                </button>

                <button className={styles.labelBtn} onClick={() => setOpen(o => !o)}>
                    <Calendar size={14} />
                    <span>{formatLabel(startDate, endDate)}</span>
                </button>

                <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={() => shiftDays(7)} title="Próximo período">
                    <ChevronRight size={16} />
                </button>
                <button className={styles.todayBtn} onClick={() => {
                    const diff = today.getDay();
                    const weekStart = addDays(today, -diff);
                    onChange(weekStart, addDays(weekStart, 6));
                    setOpen(false);
                }}>Hoje</button>
            </div>

            {open && (
                <div className={styles.dropdown}>
                    <div className={styles.calHeader}>
                        <button className={styles.calNavBtn} onClick={prevMonth}><ChevronLeft size={15} /></button>
                        <span className={styles.calTitle}>{MONTH_NAMES[viewMonth.month]} {viewMonth.year}</span>
                        <button className={styles.calNavBtn} onClick={nextMonth}><ChevronRight size={15} /></button>
                    </div>

                    <div className={styles.weekDays}>
                        {WEEK_DAYS.map(d => <span key={d}>{d}</span>)}
                    </div>

                    <div className={styles.daysGrid}>
                        {days.map((day, i) => (
                            <button
                                key={i}
                                className={getDayClass(day)}
                                onClick={() => handleDayClick(day)}
                                onMouseEnter={() => handleDayHover(day)}
                                onMouseLeave={() => setHoverDate(null)}
                            >
                                {day.getDate()}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
