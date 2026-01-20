import SelectField from "../../../form/SelectField";
import type { Absence } from "../../../../api/absence";

type AbsenceSelectInputProps = {
  absence: Absence[];
  loading?: boolean;
  error?: unknown;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  absenceId: string | undefined;
};

export default function AbsenceSelectInput({
  absence,
  absenceId,
  onChange,
}: AbsenceSelectInputProps) {
  return (
    <SelectField
      name="absenceId" // ✅ this is what makes change() work
      value={absenceId || ""} // ✅ this binds the correct state
      onChange={onChange}
      label="Fraværsårsaker"
      placeholder="Velg fravær"
      options={absence.map((a) => ({
        value: String(a.id),
        label: a.absenceCode ? `${a.absenceCode} - ${a.name}` : a.name,
      }))}
    />
  );
}
