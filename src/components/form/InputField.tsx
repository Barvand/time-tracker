type InputFieldProps = {
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
};

export default function InputField({
  name,
  value,
  onChange,
  label,
  type,
}: InputFieldProps) {
  return (
    <div className="w-full">
      {label && <label className="text-md font-bold">{label}</label>}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded border bg-white px-4 py-2.5 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
      ></input>
    </div>
  );
}
