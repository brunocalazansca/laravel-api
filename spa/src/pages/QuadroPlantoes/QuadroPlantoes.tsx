import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  LogOut,
  LayoutGrid,
  X,
  GripVertical,
  Stethoscope,
  Shield,
  Pencil,
} from "lucide-react";
import type { ShiftId } from "@/src/types/quadroPlantoes";

import {
  SHIFTS,
  ROLE_COLORS,
  DEFAULT_ROLE_COLOR,
} from "@/src/constants/quadroPlantoes";

import { useQuadroPlantoes } from "@/src/hooks/useQuadroPlantoes";
import { WeekPicker } from "@/src/components/WeekPicker/WeekPicker";
import { TimePicker } from "@/src/components/TimePicker/TimePicker";
import styles from "./QuadroPlantoes.module.scss";


function initials(name: string): string {
  const parts = name.replace(/^(Dra?\.|Enf\.|Téc\.)\s*/i, "").split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

function cellKey(dayId: string, shiftId: string): string {
  return `${dayId}__${shiftId}`;
}

export default function QuadroPlantoes() {
  const {
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
  } = useQuadroPlantoes();

  /* ── estado do editor de horário ── */
  const [isEditing, setIsEditing] = useState(false);
  const [editHours, setEditHours] = useState<import("@/src/types/quadroPlantoes").ShiftHoursMap | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  function openEditor() {
    setEditHours({ ...shiftHours });
    setEditError(null);
    setIsEditing(true);
  }

  function closeEditor() {
    setIsEditing(false);
    setEditError(null);
  }

  function saveEditor() {
    if (!editHours) return;
    const err = updateAllShiftHours(editHours);
    if (err) {
      setEditError(err);
    } else {
      closeEditor();
    }
  }

  function handleEditChange(shiftId: ShiftId, field: 'hora_inicio' | 'hora_fim', value: string) {
    if (!editHours) return;
    setEditHours({
      ...editHours,
      [shiftId]: {
        ...editHours[shiftId],
        [field]: value
      }
    });
  }

  function formatShiftDisplay(shiftId: ShiftId): string {
    const h = shiftHours[shiftId];
    const fmt = (t: string) => t.replace(':', 'h');
    return `${fmt(h.hora_inicio)} – ${fmt(h.hora_fim)}`;
  }

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  }

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
          
          {isAdmin && (
            <button className={styles.navBtn}
              onClick={() => navigate('/admin')}
            >
              <Shield size={15} />
              Área do Administrador
            </button>
          )}

          <button className={styles.navBtn} onClick={openEditor}>
            <Pencil size={15} />
            Horários
          </button>
        </div>
        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <span>Conectado como</span>
            <span>{emailUsuario}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
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

          <div className={styles.headerActions}>
            <WeekPicker startDate={startDate} endDate={endDate} onChange={handleRangeChange} />
          </div>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.grid}>
            <div className={`${styles.colHeader} ${styles.shiftHeaderCell} ${styles.topLeftCell}`}>
              <span className={styles.turnoBadge}>TURNO</span>
            </div>
            {days.map((d, idx) => (
              <div key={d.id} className={`${styles.colHeader} ${idx === days.length - 1 ? styles.topRightCell : ''}`}>
                <div className={`${styles.dayLabel} ${d.isToday ? styles.today : ""}`}>{d.label}</div>
                <div className={`${styles.dayDate} ${d.isToday ? styles.today : ""}`}>{d.date}</div>
              </div>
            ))}

            {SHIFTS.map((shift, sIndex) => {
              const isLastRow = sIndex === SHIFTS.length - 1;
              return (
              <React.Fragment key={shift.id}>
                <div className={`${styles.shiftLabel} ${isLastRow ? styles.bottomLeftCell : ''}`} style={{ backgroundColor: shift.tint }}>
                  <div className={styles.shiftDot}>
                    <span style={{ backgroundColor: shift.bar }} />
                    <span>{shift.label}</span>
                  </div>
                  <div className={styles.shiftHoursWrap}>
                    <span className={styles.shiftHours}>
                      {formatShiftDisplay(shift.id)}
                    </span>
                  </div>
                </div>

                {days.map((d, dIndex) => {
                  const key = cellKey(d.id, shift.id);
                  const ids = assignments[key] || [];
                  const isHover = hoverCell === key;
                  return (
                    <div
                      key={key}
                      className={`${styles.cell} ${isHover ? styles.cellHover : ""} ${isLastRow && dIndex === days.length - 1 ? styles.bottomRightCell : ''}`}
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
                            style={{ backgroundColor: (ROLE_COLORS[person.role] ?? DEFAULT_ROLE_COLOR).bg, opacity: dragStaffId === id ? 0.4 : 1 }}
                            title={`${person.name} — ${person.role}`}
                          >
                            <GripVertical size={12} color="rgba(255,255,255,0.6)" />
                            <span className={styles.chipAvatar}>{initials(person.name)}</span>
                            <div className={styles.chipInfo}>
                              <span className={styles.chipName}>{person.name}</span>
                              <span className={styles.chipRole}>{person.role}</span>
                            </div>
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
              );
            })}
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
                  style={{ backgroundColor: (ROLE_COLORS[person.role] ?? DEFAULT_ROLE_COLOR).bg, opacity: dragStaffId === person.id ? 0.4 : 1 }}
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

      {isEditing && editHours && (
        <div className={styles.modalOverlay} onClick={closeEditor}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar horários dos turnos</h2>
              <button className={styles.modalClose} onClick={closeEditor}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalSubtitle}>Os 3 turnos devem somar exatamente 24 horas.</p>
              
              {SHIFTS.map((shift) => (
                <div key={shift.id} className={styles.modalRow}>
                  <div className={styles.modalRowLabel}>
                    <span className={styles.modalRowDot} style={{ backgroundColor: shift.bar }} />
                    {shift.label}
                  </div>
                  <div className={styles.modalRowInputs}>
                    <div className={styles.modalInputGroup}>
                      <label>Início</label>
                      <TimePicker 
                        value={editHours[shift.id].hora_inicio} 
                        onChange={(val) => handleEditChange(shift.id, 'hora_inicio', val)} 
                      />
                    </div>
                    <div className={styles.modalInputGroup}>
                      <label>Fim</label>
                      <TimePicker 
                        value={editHours[shift.id].hora_fim} 
                        onChange={(val) => handleEditChange(shift.id, 'hora_fim', val)} 
                      />
                    </div>
                  </div>
                </div>
              ))}

              {editError && <div className={styles.shiftEditorError}>{editError}</div>}
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.shiftEditorCancel} onClick={closeEditor}>Cancelar</button>
              <button className={styles.shiftEditorSave} onClick={saveEditor}>Salvar alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
