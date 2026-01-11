import type { HourRow } from "../api/hours";
import { isoWeekKey, mondayOfISOWeek } from "./utils";

export interface DateGroupedData {
  groupedByDate: Record<string, HourRow[]>;
  sortedDates: string[];
  total: number;
  startDate: Date;
  endDate: Date;
}

export interface MonthTotal {
  year: number;
  month: number;
  total: number;
  label: string;
}

export interface MonthlyUserSummary {
  userId: number;
  name: string;
  totalHours: number;
}

/**
 * Get the date for a given month offset from today
 */
export function getOffsetMonthDate(monthOffset: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + monthOffset);
  return date;
}

/**
 * Format a month date to display string
 */
export function formatMonthName(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Group hours by week with offset
 */
export function getWeeklySummary(
  rows: HourRow[],
  weekOffset: number
): DateGroupedData {
  const grouped: Record<string, HourRow[]> = {};
  let total = 0;

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
    if (Number.isFinite(val)) total += val;
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

  return {
    groupedByDate: grouped,
    sortedDates,
    total,
    startDate: monday,
    endDate: sunday,
  };
}

/**
 * Group hours by month for a specific date
 */
export function getMonthlySummary(
  rows: HourRow[],
  baseDate = new Date()
): DateGroupedData {
  const grouped: Record<string, HourRow[]> = {};
  let total = 0;

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
    if (Number.isFinite(val)) total += val;
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

  return {
    groupedByDate: grouped,
    sortedDates,
    total,
    startDate: firstDay,
    endDate: lastDay,
  };
}

/**
 * Get all monthly totals from all hours
 */
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
        label: formatMonthName(date),
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

  return months;
}

/**
 * Group hours by user for a specific month (for accountant view)
 */
export function getMonthlyUserSummary(
  rows: HourRow[],
  baseDate: Date,
  userMap: Record<number, string>
): MonthlyUserSummary[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const userHours: Record<number, MonthlyUserSummary> = {};

  rows.forEach((hour) => {
    const date = new Date(hour.startTime);
    if (date.getFullYear() === year && date.getMonth() === month) {
      if (!userHours[hour.userId]) {
        userHours[hour.userId] = {
          userId: hour.userId,
          name: userMap[hour.userId] || `User ${hour.userId}`,
          totalHours: 0,
        };
      }
      userHours[hour.userId].totalHours += Number(hour.hoursWorked) || 0;
    }
  });

  // Convert to array and sort by name
  return Object.values(userHours).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Calculate total hours from an array of user summaries
 */
export function calculateTotalHours(summaries: MonthlyUserSummary[]): number {
  return summaries.reduce((sum, user) => sum + user.totalHours, 0);
}
