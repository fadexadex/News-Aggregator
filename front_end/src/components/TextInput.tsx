interface TextInputProps {
  label?: string;
  type: string;
  id: string;
  name: string;
  className?: string;
  required?: boolean;
}

const TextInput = ({ label, type, id, name, className, required }:TextInputProps) => {
  return (
    <div className="text-sm flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-2 font-semibold">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        className={`bg-transparent border autofill-custom border-stone-600 rounded-lg h-10 outline-gray-500 p-3 placeholder:text-muted-foreground
         transition-all duration-300 ease-in-out ${className}`}
        required={required}
      />
    </div>
  );
};

export default TextInput;
