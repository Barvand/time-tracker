import { cn } from "../../utils/utils";
type UseFormRegister = any;
type FieldError = any; 
type RegisterOptions = any; 

  type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    };

const InputField = ({name, label, placeholder, type='text', register, error, validation, disabled, value} : FormInputProps) => { 
<div className="space-y-2"> 
    <label htmlFor={name} className="">
        {label}
    </label>
  <input
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                className={cn('form-input', {'opacity-50 cursor-not-allowed': disabled})}
                {...register(name, validation)}
            />
            {error && <p className="text-red-500">{error.message}</p>}
        </div>
}

export default InputField