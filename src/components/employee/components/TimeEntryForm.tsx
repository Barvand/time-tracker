import { useMemo, useState } from "react";
import InputField from "../../form/InputField";
import type {
  EmployeeAddHourFormProps,
  EmployeeAddHourFormValues,
} from "../../../types";
import ProjectSelectInput from "../form/inputs/ProjectSelectInput";
import AbsenceSelectInput from "../form/inputs/absenceSelectInput";
import { GetAbsenceData } from "../../../api/absence";
import ErrorMessage from "../../UI/UX-messages/ErrorMessage";
import SuccessMessage from "../../UI/UX-messages/SuccessMessage";
import TimeEntrySubmitBtn from "../../UI/buttons/timeEntrySubmitBtn";
import AttentionMessage from "../../UI/UX-messages/AttentionMessage";
import PreviewSection from "../form/PreviewSection";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function EmployeeAddEmployeeAddHourForm({
  projects,
  projectsLoading,
  projectsError,
  submitting,
  successMsg,
  errorMsg,
  resetMessages,
  onSubmit,
}: EmployeeAddHourFormProps) {
  const [formData, setFormData] = useState<EmployeeAddHourFormValues>({
    projectId: "",
    absenceId: "",
    date: "",
    startTime: "",
    endTime: "",
    breakMinutes: 0,
    note: "",
  });

  const queryClient = useQueryClient();
  const [hidden, setHidden] = useState(true);

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

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      await queryClient.invalidateQueries({
        queryKey: ["hours", "all"],
      });
      setFormData({
        projectId: "",
        date: "",
        startTime: "",
        endTime: "",
        breakMinutes: 0,
        note: "",
        absenceId: "",
      });
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

      <button
        onClick={() => setHidden((prev) => !prev)}
        className="
    mb-4 group inline-flex items-center gap-2
    text-sm font-medium text-green-800
    px-2 py-1 rounded-md
    transition-colors duration-200
    hover:bg-green-50
    focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600
  "
        aria-expanded={!hidden}
      >
        <Plus
          className={`
      w-4 h-4
      transition-transform duration-200 ease-out
      ${hidden ? "rotate-0" : "rotate-45"}
    `}
        />

        <span>{hidden ? "Registrer fravær" : "Skjul fravær"}</span>
      </button>

      {hidden ? null : (
        <div className="w-full px-4 py-3 rounded transition">
          <div className="mb-6">
            <AbsenceSelectInput
              absenceId={formData.absenceId}
              onChange={change}
              absence={absence}
              loading={projectsLoading}
              error={projectsError}
            />
          </div>
        </div>
      )}
      <AttentionMessage
        message="Husk å fylle ut både starttid og sluttid for at
            timelisten skal bli riktig."
      />
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
      {preview && <PreviewSection preview={preview} />}
      {/* Error/Success Messages */}
      {errorMsg && <ErrorMessage message={errorMsg} onClose={resetMessages} />}
      {successMsg && (
        <SuccessMessage message={successMsg} onClose={resetMessages} />
      )}

      <TimeEntrySubmitBtn
        submitting={submitting ?? false}
        preview={Boolean(preview)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
