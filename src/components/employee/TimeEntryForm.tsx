// src/components/hour/HourForm.tsx
import { useMemo, useState } from "react";
import type { Project } from "../../types";
import ProjectForm from "../employee/form/ProjectForm";
import InputField from "../form/InputField";

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

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: name === "breakMinutes" ? Number(value) : value,
      };

      if (name === "projectId" && value) next.absenceId = "";
      if (name === "absenceId" && value) next.projectId = "";

      return next;
    });
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
        <p className="text-red-600 text-sm font-bold m-2">
          NB: Husk å fylle ut både starttid og sluttid for at timelisten skal
          bli riktig.
        </p>
      </div>

      <div className="mb-5 mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <section className="rounded-lg p-4">
          <InputField
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={change}
            label="Velg time"
            placeholder="Start tid"
          />
        </section>

        <section className="rounded-lg p-4">
          <InputField
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={change}
            label="Slutt time"
            placeholder="Slutt tid"
          />
        </section>

        <section className="rounded-lg p-4">
          <InputField
            name="breakMinutes"
            type="number"
            value={formData.breakMinutes}
            onChange={change}
            label="Hvor lang pause har du hatt? (i minutter)"
            placeholder="Pause i minutter"
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
