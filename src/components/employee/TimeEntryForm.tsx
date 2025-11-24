// src/components/hour/HourForm.tsx
import { useMemo, useState } from "react";
import type { Project } from "../../types";
import ProjectForm from "../employee/form/ProjectForm";

export type HourFormValues = {
  projectId: string;
  absenceId: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  note?: string;
};

type Props = {
  projects: Project[];
  projectsLoading?: boolean;
  projectsError?: unknown;
  submitting?: boolean;
  successMsg?: string | null;
  errorMsg?: string | null;
  onSubmit: (v: HourFormValues) => void | Promise<void>;
};

export default function HourForm({
  projects,
  projectsLoading,
  projectsError,
  submitting,
  successMsg,
  errorMsg,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<HourFormValues>({
    projectId: "",
    date: "",
    startTime: "",
    endTime: "",
    breakMinutes: 0,
    note: "",
    absenceId: "",
  });

  const preview = useMemo(() => {
    if (!formData.date || !formData.startTime || !formData.endTime) return null;
    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);
    const ms = end.getTime() - start.getTime() - formData.breakMinutes * 60000;
    const hours = Math.round((ms / 3600000) * 100) / 100;
    return Number.isFinite(hours) && hours > 0
      ? {
          startStr: formData.startTime,
          endStr: formData.endTime,
          breakStr: `${formData.breakMinutes} minutes`,
          hours,
        }
      : null;
  }, [formData]);

  const change = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: name === "breakMinutes" ? Number(value) : value,
    }));
  };

  const submit = async () => onSubmit(formData);

  return (
    <>
      <ProjectForm
        projectId={formData.projectId}
        absenceId={formData.absenceId}
        onChange={change}
        projects={projects}
        projectsLoading={projectsLoading}
        projectsError={projectsError}
      />

      <div className="pt-2">
        <p className="text-red-500 font-bold">
          Use your keyboard to enter the hours. e.g. 08:00 - 16:00
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <section className="rounded-lg bg-neutral-100 p-4">
          <label className="block text-sm font-medium">
            What time did you start work?
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={change}
            className="mt-2 w-full rounded border bg-white p-2"
          />
        </section>

        <section className="rounded-lg bg-neutral-100 p-4">
          <label className="block text-sm font-medium">
            What time did you end work?
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={change}
            className="mt-2 w-full rounded border bg-white p-2"
          />
        </section>

        <section className="rounded-lg bg-neutral-100 p-4">
          <label className="block text-sm font-medium">
            Did you take a break?
          </label>
          <input
            type="number"
            min={0}
            name="breakMinutes"
            value={formData.breakMinutes}
            onChange={change}
            className="mt-2 w-full rounded border bg-white p-2"
          />
        </section>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-60">
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={change}
            className="mt-2 w-full rounded border bg-white p-2"
          />
        </div>

        <button
          disabled={!!submitting}
          onClick={submit}
          className="mt-2 inline-flex h-11 items-center justify-center rounded bg-emerald-500 px-5 font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50 sm:mt-0"
        >
          {submitting ? "Submitting…" : "Submit your working day"}
        </button>
      </div>

      {errorMsg && <p className="mt-3 text-sm text-red-600">{errorMsg}</p>}
      {successMsg && (
        <p className="mt-3 text-sm text-emerald-700">{successMsg}</p>
      )}

      <section className="mt-6 rounded-lg bg-neutral-100 p-6">
        {preview ? (
          <>
            <p className="mt-3 text-sm">
              You have worked today from <b>{preview.startStr}</b> to{" "}
              <b>{preview.endStr}</b> and you took a break of{" "}
              <b>{preview.breakStr}</b>.
              <br />
              In total you have worked for <b>{preview.hours} hours</b>
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-4 text-sm font-medium text-red-600 underline"
            >
              Edit your workday
            </button>
          </>
        ) : (
          <p className="mt-2 text-sm font-bold">
            Fill out the form above to see a preview here.
          </p>
        )}
      </section>
    </>
  );
}
