/**
 * Small date utilities. All functions should operate on local dates (yyyy-mm-dd).
 * Implement and unit test in next phase to avoid timezone bugs.
 */

export function todayIsoLocal(): string {
  const d = new Date();
  const tzoffset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzoffset);
  return local.toISOString().slice(0, 10);
}

export function dayNameFromIso(dateIso: string): string {
  const d = new Date(dateIso + "T00:00:00");
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[d.getDay()];
}
