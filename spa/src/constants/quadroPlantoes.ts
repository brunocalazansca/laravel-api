import type { Shift, Day, StaffMember, Role } from "@/src/types/quadroPlantoes";

export const SHIFTS: Shift[] = [
  { id: "manha", label: "Manhã",  hours: "07h – 13h", bar: "#F2B84B", tint: "#FDF1DC" },
  { id: "tarde", label: "Tarde",  hours: "13h – 19h", bar: "#F0904D", tint: "#FDEBDD" },
  { id: "noite", label: "Noite",  hours: "19h – 07h", bar: "#5D7BD9", tint: "#E9EDFB" },
];

export const DAYS: Day[] = [
  { id: "seg", label: "SEG", date: "29/06" },
  { id: "ter", label: "TER", date: "30/06" },
  { id: "qua", label: "QUA", date: "1/07" },
  { id: "qui", label: "QUI", date: "2/07" },
  { id: "sex", label: "SEX", date: "3/07", isToday: true },
  { id: "sab", label: "SÁB", date: "4/07" },
  { id: "dom", label: "DOM", date: "5/07" },
];

export const ROLE_COLORS: Record<Role, { bg: string }> = {
  "Médico(a)":     { bg: "#0F9AA6" },
  "Enfermeiro(a)": { bg: "#5D7BD9" },
  "Técnico(a)":    { bg: "#9B6BD9" },
};

export const DEFAULT_ROLE_COLOR = { bg: "#94A3B8" };
