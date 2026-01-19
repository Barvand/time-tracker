import { useMemo, useState } from "react";
import InputField from "../../form/InputField";
import type { HourFormProps, HourFormValues } from "../../../types";
import ProjectSelectInput from "../form/ProjectSelectInput";
import AbsenceSelectInput from "../form/absenceSelectInput";
import { GetAbsenceData } from "../../../api/absence";

export default function HourForm({
  projects,
  projectsLoading,
  projectsError,
  submitting,
  successMsg,
  errorMsg,
  onSubmit,
}: HourFormProps) {
  const [formData, setFormData] = useState<HourFormValues>({
    projectId: "",
    absenceId: "",
    date: "",
    startTime: "",
    endTime: "",
    breakMinutes: 0,
    note: "",
  });

  const { data: absence = [] } = GetAbsenceData();

  const preview = useMemo(() => {
    if (!formData.date || !formData.startTime || !formData.endTime) return null;

    // Add 'Z' to force UTC interpretation
    const start = new Date(`${formData.date}T${formData.startTime}:00`);
    const end = new Date(`${formData.date}T${formData.endTime}:00`);
    const ms = end.getTime() - start.getTime() - formData.breakMinutes * 60000;
    const hours = Math.round((ms / 3600000) * 100) / 100;
    return Number.isFinite(hours) && hours > 0
      ? {
          startStr: formData.startTime,
          endStr: formData.endTime,
          breakStr: `${formData.breakMinutes} minutter`,
          hours,
        }
      : null;
  }, [formData]);

  const change = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  const handleSubmmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit(formData);
      setFormData({
        projectId: "",
        date: "",
        startTime: "",
        endTime: "",
        breakMinutes: 0,
        note: "",
        absenceId: "",
      });
      console.log(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bg-white p-6">
      {/* Project/Absence Selection */}
      <div className="mb-6">
        <ProjectSelectInput
          projectId={formData.projectId}
          onChange={change}
          projects={projects}
          projectsLoading={projectsLoading}
          projectsError={projectsError}
        />
      </div>
      <AbsenceSelectInput
        absenceId={formData.absenceId}
        onChange={change}
        absence={absence}
        loading={projectsLoading}
        error={projectsError}
      />

      {/* Important Note */}
      <div className="mb-6 bg-blue-50 border border-blue-200 p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-blue-900">
            <strong>NB:</strong> Husk å fylle ut både starttid og sluttid for at
            timelisten skal bli riktig.
          </p>
        </div>
      </div>

      {/* Time and Break Inputs */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <InputField
          name="startTime"
          type="time"
          value={formData.startTime}
          onChange={change}
          label="Starttid"
          placeholder="Starttid"
        />
        <InputField
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={change}
          label="Sluttid"
          placeholder="Sluttid"
        />
        <InputField
          name="breakMinutes"
          type="number"
          value={formData.breakMinutes}
          onChange={change}
          label="Pause (minutter)"
          placeholder="0"
        />
      </div>

      {/* Date Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dato
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={change}
          className="w-full md:w-64 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        />
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Oppsummering
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              Du har jobbet fra{" "}
              <strong className="text-gray-900">{preview.startStr}</strong> til{" "}
              <strong className="text-gray-900">{preview.endStr}</strong> med en
              pause på{" "}
              <strong className="text-gray-900">{preview.breakStr}</strong>.
            </p>
            <p className="text-base font-semibold text-blue-600 mt-3">
              Totalt: {preview.hours} timer
            </p>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">{successMsg}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          disabled={!!submitting || !preview}
          onClick={handleSubmmit}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Lagrer...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Registrer arbeidstid
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      {!preview && (
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 text-center">
            Fyll ut alle feltene over for å se en oppsummering av arbeidstiden
            din
          </p>
        </div>
      )}
    </div>
  );
}
