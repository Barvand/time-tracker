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
  disabled?: boolean; // 👈 add this
  className?: string;
};

export default function SelectField({
  name,
  value,
  onChange,
  label,
  options,
  placeholder,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      {label && <label className="text-md font-bold mb-2">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded border bg-white px-4 py-2.5 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors
  "
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
