import { Debt } from "../types/domain";

export const DebtsStore = {
  getAll: (): Debt[] => [],
  add: (d: Debt) => {},
  markPaid: (id: string, paidAt?: string) => {},
  outstandingTotal: (): number => 0,
};
