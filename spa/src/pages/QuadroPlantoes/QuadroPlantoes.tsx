import React from "react";
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

import {
  SHIFTS,
  DAYS,
  ROLE_COLORS
} from "@/src/constants/quadroPlantoes";

import { useQuadroPlantoes } from "@/src/hooks/useQuadroPlantoes";
import styles from "./QuadroPlantoes.module.scss";


function initials(name: string): string {
  const parts = name.replace(/^(Dra?\.|Enf\.|Téc\.)\s*/i, "").split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

function cellKey(dayId: string, shiftId: string): string {
  return `${dayId}__${shiftId}`;
}

export default function QuadroPlantoes(): JSX.Element {
  const {
    staff,
    assignments,
    dragStaffId,
    hoverCell,
    poolHover,
    poolStaff,
    staffById,
    setHoverCell,
    setPoolHover,
    handleDragStart,
    handleDragEnd,
    handleDropOnCell,
    handleDropOnPool,
    removeAssignment,
  } = useQuadroPlantoes();

  return (
    <div className={styles.page}>
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
