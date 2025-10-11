// src/pages/EmployeeDashboard.tsx
import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { GetProjects } from "../api/projects";
import { useCreateHour } from "../api/hours";
import HourForm from "../components/employee/TimeEntryForm";
import type { HourFormValues } from "../components/employee/TimeEntryForm";
import HourReview from "../components/employee/HourReview";
import WeekNavigator from "../components/employee/WeekNavigator";
import { getISOWeek } from "../utils/date";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const userId = user?.userId;
  console.log(userId);
  const { data: projects = [], isLoading, error } = GetProjects();
  const createHour = useCreateHour(userId);

  const [weekOffset, setWeekOffset] = useState(0);

  const now = new Date();
  const monday = new Date(now);
  const day = (now.getDay() + 6) % 7;
  monday.setDate(now.getDate() - day + weekOffset * 7);
  const weekNumber = getISOWeek(monday);

  const handleSubmit = async (v: HourFormValues) => {
    if (!userId) {
      throw new Error("User ID is required to log hours.");
    }
    await createHour.mutateAsync({
      userId,
      projectsId: Number(v.projectId),
      startTime: new Date(`${v.date}T${v.startTime}`).toISOString(),
      endTime: new Date(`${v.date}T${v.endTime}`).toISOString(),
      breakMinutes: v.breakMinutes,
      note: v.note || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-center text-3xl font-semibold">Employee dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr,420px]">
        <div>
          <h2 className="text-2xl font-bold">
            Hi {user?.username || user?.username || "there"}, how are you today?
          </h2>

          <HourForm
            projects={projects}
            projectsLoading={isLoading}
            projectsError={error}
            submitting={createHour.isPending}
            successMsg={
              createHour.isSuccess ? "Hours logged successfully!" : null
            }
            errorMsg={(createHour.error as any)?.message ?? null}
            onSubmit={handleSubmit}
          />
        </div>

        <aside className="rounded-lg bg-neutral-100 p-6 lg:sticky lg:top-8 lg:h-fit">
          <WeekNavigator
            weekNumber={weekNumber}
            onPrev={() => setWeekOffset((w) => w - 1)}
            onNext={() => setWeekOffset((w) => w + 1)}
          />
          {userId && <HourReview userId={userId} weekOffset={weekOffset} />}
        </aside>
      </div>
    </div>
  );
}
