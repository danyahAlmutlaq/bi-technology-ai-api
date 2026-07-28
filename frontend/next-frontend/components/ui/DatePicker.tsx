import type { InputHTMLAttributes } from "react";

type DatePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  error?: string;
};

export default function DatePicker({
  label,
  error,
  className = "",
  id,
  ...props
}: DatePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-bold text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type="date"
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition
          focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200"
          }
          ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}