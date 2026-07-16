export type ShiftId = "manha" | "tarde" | "noite";
export type DayId = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
export type Role = "Médico(a)" | "Enfermeiro(a)" | "Técnico(a)";

export interface Shift {
  id: ShiftId;
  label: string;
  hours: string;
  bar: string;
  tint: string;
}

export interface Day {
  id: DayId;
  label: string;
  date: string;
  isToday?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
}

export interface DragOrigin {
  dayId: DayId;
  shiftId: ShiftId;
}

export type Assignments = Partial<Record<string, string[]>>;
