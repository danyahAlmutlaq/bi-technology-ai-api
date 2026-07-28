import type { InputHTMLAttributes, ReactNode } from "react";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: ReactNode;
};

export default function Checkbox({
  label,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3"
    >
      <input
        id={id}
        type="checkbox"
        className={`h-5 w-5 rounded border-slate-300 text-emerald-600
          focus:ring-emerald-500
          ${className}`}
        {...props}
      />

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>
    </label>
  );
}