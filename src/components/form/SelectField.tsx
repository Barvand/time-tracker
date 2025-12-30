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
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      {label && <label className="text-md font-bold">{label}</label>}
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
