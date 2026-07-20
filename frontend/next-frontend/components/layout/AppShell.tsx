import Sidebar from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
};

export default function AppShell({
  children,
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-h-screen p-6 lg:mr-72">
        {(titleAr || titleEn || subtitleAr || subtitleEn) && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div dir="rtl">
              {titleAr && (
                <h1 className="text-3xl font-black text-slate-900">
                  {titleAr}
                </h1>
              )}

              {subtitleAr && (
                <p className="mt-2 text-sm text-slate-500">
                  {subtitleAr}
                </p>
              )}
            </div>

            {(titleEn || subtitleEn) && (
              <div className="mt-4 border-t border-slate-100 pt-4 text-left">
                {titleEn && (
                  <h2 className="text-lg font-bold text-slate-700">
                    {titleEn}
                  </h2>
                )}

                {subtitleEn && (
                  <p className="mt-1 text-sm text-slate-400">
                    {subtitleEn}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {children}
      </main>
    </div>
  );
}