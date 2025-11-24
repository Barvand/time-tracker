type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  options: Option[];
  placeholder?: string;
};

export default function SelectField({
  name,
  value,
  onChange,
  label,
  options,
  placeholder = "Select…",
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded border bg-white p-3"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
