// src/components/hour/hourSummary.ts
import type { HourRow } from "../../api/hours";
import { isoWeekKey, mondayOfISOWeek } from "../../utils/utils";

export type WeeklySummary = {
  groupedByDate: Record<string, HourRow[]>;
  sortedDates: string[];
  weeklyTotal: number;
  monday: Date;
  sunday: Date;
};

export function getWeeklySummary(
  rows: HourRow[],
  weekOffset: number
): WeeklySummary {
  const grouped: Record<string, HourRow[]> = {};
  let weeklyTotal = 0;

  // Target week (today + weekOffset)
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + weekOffset * 7);
  const { year, week, key: targetKey } = isoWeekKey(targetDate);

  // Calculate Monday & Sunday for header display
  const monday = mondayOfISOWeek(year, week);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  for (const row of rows) {
    if (!row.startTime) continue;

    const rowDate = new Date(row.startTime);
    const { key: rowKey } = isoWeekKey(rowDate);

    // Only keep rows from the target week
    if (rowKey !== targetKey) continue;

    const dateKey = rowDate.toISOString().split("T")[0];

    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(row);

    const val = Number(row.hoursWorked);
    if (Number.isFinite(val)) weeklyTotal += val;
  }

  // Sort logs within each day
  Object.keys(grouped).forEach((dateKey) => {
    grouped[dateKey].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  // Sort days chronologically
  const sortedDates = Object.keys(grouped).sort();

  return { groupedByDate: grouped, sortedDates, weeklyTotal, monday, sunday };
}

export function getMonthlyTotal(
  rows: HourRow[],
  baseDate = new Date()
): number {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-based

  return rows.reduce((sum, row) => {
    if (!row.startTime) return sum;

    const d = new Date(row.startTime);
    const isSameMonth = d.getFullYear() === year && d.getMonth() === month;

    if (!isSameMonth) return sum;

    const val = Number(row.hoursWorked);
    return sum + (Number.isFinite(val) ? val : 0);
  }, 0);
}
