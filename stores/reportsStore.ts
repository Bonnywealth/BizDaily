/**
 * Placeholder for a reports store module.
 * Next phase: implement Zustand store and persist middleware here.
 */

import { BusinessReport } from "../types/domain";

export const ReportsStore = {
  getAll: (): BusinessReport[] => {
    return [];
  },
  add: (report: BusinessReport) => {},
  getByDate: (dateIso: string): BusinessReport | null => {
    return null;
  },
};
