import { BusinessReport } from "../types/domain";
import { todayIsoLocal, dayNameFromIso } from "./date";

// existing helper functions are above in the file; we'll add getLatestExpectedReport here

/**
 * getLatestExpectedReport
 * Determines the latest expected business report to display on the dashboard. Per PRD:
 * - Always display the latest expected business report (the most recent calendar day up to yesterday?)
 * - Example in PRD: If today is Tuesday, show Monday report (i.e., the latest completed day)
 * We interpret "latest expected" as the most recent past day (yesterday) or the most recent submitted report if newer.
 * Behavior:
 *  - If there is a submitted report for the latest expected day, return it.
 *  - If not, return a virtual "No Business Report Submitted" record for that day with sales/expenses/profit = 0.
 */
export function getLatestExpectedReport(reports: BusinessReport[], refIso?: string): BusinessReport | null {
  // Determine reference date (local). If refIso provided, use it; otherwise use today.
  const todayIso = refIso || todayIsoLocal();
  // Latest expected day is yesterday (one day before today)
  const refDate = new Date(todayIso + "T00:00:00");
  refDate.setDate(refDate.getDate() - 1);
  const tzoffset = refDate.getTimezoneOffset() * 60000;
  const local = new Date(refDate.getTime() - tzoffset);
  const latestIso = local.toISOString().slice(0, 10);

  // find a submitted report for latestIso
  const found = reports.find((r) => r.date === latestIso && r.status === "Submitted");
  if (found) return found;

  // if not found, look for the most recent submitted report before latestIso
  const prior = reports
    .filter((r) => r.status === "Submitted" && r.date <= latestIso)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // descending
  if (prior.length > 0) {
    // Per PRD: Always display the latest expected business report. The PRD also said examples like "Today = Tuesday Display: Monday Report".
    // If no report exists for Monday but an older report exists, we should still display Monday virtual if Monday missing. However PRD states never display more than one report; so prefer the latest expected day (virtual) when missing.
    // Therefore, return virtual for latestIso rather than older prior report.
  }

  // Return virtual missing-day record for latestIso
  return {
    id: `virtual-${latestIso}`,
    date: latestIso,
    day: dayNameFromIso(latestIso) as any,
    sales: 0,
    expenses: 0,
    profit: 0,
    status: "No Business Report Submitted",
    createdAt: new Date().toISOString(),
  };
}
