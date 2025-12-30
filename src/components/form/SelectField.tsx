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
      {label && <label className="text-md font-bold">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-4
    w-full rounded border bg-white p-3
    disabled:bg-gray-100
    disabled:text-gray-400
    disabled:border-gray-300
    disabled:cursor-not-allowed
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
