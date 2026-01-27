import type { HourRow } from "../../api/hours";
import { isoWeekKey, mondayOfISOWeek } from "../../utils/utils";

export type WeeklySummary = {
  groupedByDate: Record<string, HourRow[]>;
  sortedDates: string[];
  weeklyTotal: number;
  monday: Date;
  sunday: Date;
};

export type MonthTotal = {
  year: number;
  month: number;
  total: number;
  label: string;
};

export function getWeeklySummary(
  rows: HourRow[],
  weekOffset: number,
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
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  });

  // Sort days chronologically
  const sortedDates = Object.keys(grouped).sort();

  return { groupedByDate: grouped, sortedDates, weeklyTotal, monday, sunday };
}

export function getMonthlySummary(
  rows: HourRow[],
  baseDate = new Date(),
): WeeklySummary {
  const grouped: Record<string, HourRow[]> = {};
  let monthlyTotal = 0;

  const targetYear = baseDate.getFullYear();
  const targetMonth = baseDate.getMonth();

  // Calculate first and last day of the month for display
  const firstDay = new Date(targetYear, targetMonth, 1);
  const lastDay = new Date(targetYear, targetMonth + 1, 0);

  for (const row of rows) {
    if (!row.startTime) continue;
    const rowDate = new Date(row.startTime);

    // Only keep rows from the target month
    if (
      rowDate.getFullYear() !== targetYear ||
      rowDate.getMonth() !== targetMonth
    ) {
      continue;
    }

    const dateKey = rowDate.toISOString().split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(row);

    const val = Number(row.hoursWorked);
    if (Number.isFinite(val)) monthlyTotal += val;
  }

  // Sort logs within each day
  Object.keys(grouped).forEach((dateKey) => {
    grouped[dateKey].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  });

  // Sort days chronologically
  const sortedDates = Object.keys(grouped).sort();

  return {
    groupedByDate: grouped,
    sortedDates,
    weeklyTotal: monthlyTotal, // Using weeklyTotal property name for compatiblity
    monday: firstDay,
    sunday: lastDay,
  };
}

export function getMonthlyTotal(
  rows: HourRow[],
  baseDate = new Date(),
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

export function getAllMonthlyTotals(rows: HourRow[]): MonthTotal[] {
  const monthMap = new Map<string, number>();

  rows.forEach((row) => {
    if (!row.startTime) return;
    const d = new Date(row.startTime);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${month}`;

    const val = Number(row.hoursWorked);
    const hours = Number.isFinite(val) ? val : 0;

    monthMap.set(key, (monthMap.get(key) || 0) + hours);
  });

  // Convert to array and sort by date (newest first)
  const months: MonthTotal[] = Array.from(monthMap.entries())
    .map(([key, total]) => {
      const [year, month] = key.split("-").map(Number);
      const date = new Date(year, month);
      return {
        year,
        month,
        total,
        label: date.toLocaleDateString("nb-NO", {
          month: "long",
          year: "numeric",
        }),
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

  return months;
}
