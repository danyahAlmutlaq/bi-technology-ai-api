type LoaderProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-7 w-7 border-3",
  lg: "h-10 w-10 border-4",
};

export default function Loader({
  text = "جاري التحميل...",
  size = "md",
}: LoaderProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <span
        className={`${sizeClasses[size]} animate-spin rounded-full border-slate-200 border-t-emerald-600`}
      />

      {text && (
        <span className="text-sm font-semibold text-slate-600">
          {text}
        </span>
      )}
    </div>
  );
}
