import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { GetProjects } from "../api/projects";
import { useCreateHour } from "../api/hours";
import HourForm from "../components/employee/components/TimeEntryForm";
import type { HourFormValues } from "../types";
import HourReview from "../components/employee/components/HourReview";
import { GetAbsenceData } from "../api/absence";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const userId = user?.userId;
  const { data: projects = [], isLoading, error } = GetProjects();
  const { data: absence = [] } = GetAbsenceData();
  const createHour = useCreateHour(userId);
  const [weekOffset] = useState(0);
  const now = new Date();
  const monday = new Date(now);
  const day = (now.getDay() + 6) % 7;
  monday.setDate(now.getDate() - day + weekOffset * 7);

  const handleSubmit = async (v: HourFormValues) => {
    if (!userId) {
      throw new Error("User ID is required to log hours.");
    }

    const body: any = {
      userId,
      breakMinutes: v.breakMinutes,
      note: v.note || undefined,
      projectsId: v.projectId || null,
      absenceId: v.absenceId || null,
      startTime: v.startTime ? `${v.date}T${v.startTime}` : null,
      endTime: v.endTime ? `${v.date}T${v.endTime}` : null,
    };

    await createHour.mutateAsync(body);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 rounded-2xl">
      <h1 className="text-center text-3xl font-semibold">
        Registrer arbeidstid
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr,420px]">
        <div>
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
          {userId && (
            <HourReview
              userId={userId}
              weekOffset={weekOffset}
              projects={projects}
              absence={absence}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
