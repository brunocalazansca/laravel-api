import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutGrid,
  X,
  GripVertical,
  Stethoscope,
} from "lucide-react";
import styles from "./QuadroPlantoes.module.scss";

type ShiftId = "manha" | "tarde" | "noite";
type DayId = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
type Role = "Médico(a)" | "Enfermeiro(a)" | "Técnico(a)";

interface Shift {
  id: ShiftId;
  label: string;
  hours: string;
  bar: string;
  tint: string;
}

interface Day {
  id: DayId;
  label: string;
  date: string;
  isToday?: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  role: Role;
}

interface DragOrigin {
  dayId: DayId;
  shiftId: ShiftId;
}

type Assignments = Partial<Record<string, string[]>>;

const SHIFTS: Shift[] = [
  { id: "manha", label: "Manhã",  hours: "07h – 13h", bar: "#F2B84B", tint: "#FDF1DC" },
  { id: "tarde", label: "Tarde",  hours: "13h – 19h", bar: "#F0904D", tint: "#FDEBDD" },
  { id: "noite", label: "Noite",  hours: "19h – 07h", bar: "#5D7BD9", tint: "#E9EDFB" },
];

const DAYS: Day[] = [
  { id: "seg", label: "SEG", date: "29/06" },
  { id: "ter", label: "TER", date: "30/06" },
  { id: "qua", label: "QUA", date: "1/07" },
  { id: "qui", label: "QUI", date: "2/07" },
  { id: "sex", label: "SEX", date: "3/07", isToday: true },
  { id: "sab", label: "SÁB", date: "4/07" },
  { id: "dom", label: "DOM", date: "5/07" },
];

const ROLE_COLORS: Record<Role, { bg: string }> = {
  "Médico(a)":    { bg: "#0F9AA6" },
  "Enfermeiro(a)":{ bg: "#5D7BD9" },
  "Técnico(a)":   { bg: "#9B6BD9" },
};

const INITIAL_STAFF: StaffMember[] = [
  { id: "s1", name: "Dra. Ana Ferreira",   role: "Médico(a)" },
  { id: "s2", name: "Dr. Bruno Calazans",  role: "Médico(a)" },
  { id: "s3", name: "Enf. Camila Rocha",   role: "Enfermeiro(a)" },
  { id: "s4", name: "Enf. Diego Martins",  role: "Enfermeiro(a)" },
  { id: "s5", name: "Téc. Elisa Prado",    role: "Técnico(a)" },
  { id: "s6", name: "Dr. Felipe Souza",    role: "Médico(a)" },
];

function initials(name: string): string {
  const parts = name.replace(/^(Dra?\.|Enf\.|Téc\.)\s*/i, "").split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

function cellKey(dayId: DayId, shiftId: ShiftId): string {
  return `${dayId}__${shiftId}`;
}

export default function QuadroPlantoes(): JSX.Element {
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [dragStaffId, setDragStaffId] = useState<string | null>(null);
  const [dragOrigin, setDragOrigin] = useState<DragOrigin | null>(null);
  const [hoverCell, setHoverCell] = useState<string | null>(null);
  const [poolHover, setPoolHover] = useState(false);

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
    setAssignments((prev) => {
      const next = { ...prev };
      removeFromOrigin(next);
      const key = cellKey(dayId, shiftId);
      const list = next[key] ? [...(next[key] as string[])] : [];
      if (!list.includes(dragStaffId)) list.push(dragStaffId);
      next[key] = list;
      return next;
    });
    handleDragEnd();
  }

  function handleDropOnPool(e: React.DragEvent) {
    e.preventDefault();
    if (!dragStaffId || !dragOrigin) { handleDragEnd(); return; }
    setAssignments((prev) => { const next = { ...prev }; removeFromOrigin(next); return next; });
    handleDragEnd();
  }

  function removeAssignment(dayId: DayId, shiftId: ShiftId, staffId: string) {
    setAssignments((prev) => {
      const key = cellKey(dayId, shiftId);
      const next = { ...prev };
      const filtered = (next[key] || []).filter((id) => id !== staffId);
      filtered.length === 0 ? delete next[key] : (next[key] = filtered);
      return next;
    });
  }

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.brand}>
            <Stethoscope size={20} color="#0F9AA6" strokeWidth={2.2} />
            PlantãoMed
          </div>
          <button className={styles.navBtn}>
            <LayoutGrid size={15} />
            Quadro
          </button>
        </div>
        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <span>Conectado como</span>
            <span>brunocalazansca@gmail.com</span>
          </div>
          <button className={styles.logoutBtn}>
            <LogOut size={15} />
            Sair
          </button>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <Calendar size={22} color="#0F9AA6" />
              Quadro de plantões
            </h1>
            <p className={styles.subtitle}>Escala semanal — arraste um funcionário para qualquer turno</p>
          </div>

          <div className={styles.weekNav}>
            <button className={styles.weekNavBtn}><ChevronLeft size={16} /></button>
            <span className={styles.weekLabel}>29 de jun. – 05 de jul.</span>
            <button className={styles.weekNavBtn}><ChevronRight size={16} /></button>
            <button className={styles.todayBtn}>Hoje</button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.grid}>
            <div className={`${styles.colHeader} ${styles.shiftHeaderCell}`}>
              <span className={styles.turnoBadge}>TURNO</span>
            </div>
            {DAYS.map((d) => (
              <div key={d.id} className={styles.colHeader}>
                <div className={`${styles.dayLabel} ${d.isToday ? styles.today : ""}`}>{d.label}</div>
                <div className={`${styles.dayDate} ${d.isToday ? styles.today : ""}`}>{d.date}</div>
              </div>
            ))}

            {SHIFTS.map((shift) => (
              <React.Fragment key={shift.id}>
                <div className={styles.shiftLabel} style={{ backgroundColor: shift.tint }}>
                  <div className={styles.shiftDot}>
                    <span style={{ backgroundColor: shift.bar }} />
                    <span>{shift.label}</span>
                  </div>
                  <div className={styles.shiftHours}>{shift.hours}</div>
                </div>

                {DAYS.map((d) => {
                  const key = cellKey(d.id, shift.id);
                  const ids = assignments[key] || [];
                  const isHover = hoverCell === key;
                  return (
                    <div
                      key={key}
                      className={styles.cell}
                      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setHoverCell(key); }}
                      onDragLeave={() => setHoverCell((h) => (h === key ? null : h))}
                      onDrop={(e) => handleDropOnCell(e, d.id, shift.id)}
                      style={{
                        backgroundColor: isHover ? "#D7F0F1" : undefined,
                        outline: isHover ? "2px dashed #0F9AA6" : "2px dashed transparent",
                        outlineOffset: "-4px",
                      }}
                    >
                      {ids.length === 0 && !isHover && (
                        <div className={styles.cellEmpty}>—</div>
                      )}
                      {ids.map((id) => {
                        const person = staffById[id];
                        if (!person) return null;
                        return (
                          <div
                            key={id}
                            draggable
                            className={styles.chip}
                            onDragStart={(e) => handleDragStart(e, id, { dayId: d.id, shiftId: shift.id })}
                            onDragEnd={handleDragEnd}
                            style={{ backgroundColor: ROLE_COLORS[person.role].bg, opacity: dragStaffId === id ? 0.4 : 1 }}
                            title={`${person.name} — ${person.role}`}
                          >
                            <GripVertical size={12} color="rgba(255,255,255,0.6)" />
                            <span className={styles.chipAvatar}>{initials(person.name)}</span>
                            <span className={styles.chipName}>{person.name}</span>
                            <button className={styles.chipRemove} onClick={() => removeAssignment(d.id, shift.id, id)}>
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div
          className={`${styles.pool} ${poolHover ? styles.poolHover : ""}`}
          onDragOver={(e) => { e.preventDefault(); setPoolHover(true); }}
          onDragLeave={() => setPoolHover(false)}
          onDrop={handleDropOnPool}
        >
          <div className={styles.poolTitle}>
            Funcionários{poolStaff.length > 0 ? ` (${poolStaff.length} disponível${poolStaff.length > 1 ? "eis" : ""})` : ""}
          </div>

          {staff.length === 0 || poolStaff.length === 0 ? (
            <div className={styles.poolEmpty}>
              {staff.length === 0
                ? "Nenhum funcionário cadastrado ainda."
                : "Todos os funcionários já estão escalados. Arraste um card do quadro até aqui para liberá-lo."}
            </div>
          ) : (
            <div className={styles.poolList}>
              {poolStaff.map((person) => (
                <div
                  key={person.id}
                  draggable
                  className={styles.poolCard}
                  onDragStart={(e) => handleDragStart(e, person.id, null)}
                  onDragEnd={handleDragEnd}
                  style={{ backgroundColor: ROLE_COLORS[person.role].bg, opacity: dragStaffId === person.id ? 0.4 : 1 }}
                  title={`${person.name} — ${person.role}`}
                >
                  <GripVertical size={13} color="rgba(255,255,255,0.6)" />
                  <span className={styles.poolAvatar}>{initials(person.name)}</span>
                  <div>
                    <div className={styles.poolName}>{person.name}</div>
                    <div className={styles.poolRole}>{person.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
