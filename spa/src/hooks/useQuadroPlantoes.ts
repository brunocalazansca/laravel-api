import React, { useState } from "react";
import type { DayId, ShiftId, DragOrigin, Assignments, StaffMember } from "@/src/types/quadroPlantoes";
import { INITIAL_STAFF } from "@/src/constants/quadroPlantoes";

function cellKey(dayId: DayId, shiftId: ShiftId): string {
  return `${dayId}__${shiftId}`;
}

export function useQuadroPlantoes() {
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

  return {
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
  };
}
