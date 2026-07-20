"use client";

type ModulePageProps = {
  title: string;
  subtitle: string;
  endpoint: string;
  addButtonText?: string;
};

export default function ModulePage({
  title,
  subtitle,
  endpoint,
  addButtonText = "إضافة جديد",
}: ModulePageProps) {
  return (
    <section dir="rtl" className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {title}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white"
          >
            {addButtonText}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-slate-700">
          API Endpoint:
        </p>

        <code className="mt-3 block rounded-xl bg-slate-100 p-4 text-left text-sm text-slate-700">
          {endpoint}
        </code>
      </div>
    </section>
  );
}