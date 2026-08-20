import { api } from './api';
import type { ShiftHoursMap } from '@/src/types/quadroPlantoes';

export const configuracaoService = {
    async getShiftHours(): Promise<ShiftHoursMap | null> {
        const res = await api.get('/configuracao/shift-hours');
        return res.data;
    },

    async updateShiftHours(hours: ShiftHoursMap): Promise<ShiftHoursMap> {
        const res = await api.put('/configuracao/shift-hours', hours);
        return res.data;
    }
};
