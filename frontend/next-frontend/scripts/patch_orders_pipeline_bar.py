import datetime
import pathlib

FILE_PATH = pathlib.Path("/workspaces/bi-technology-ai-api/frontend/next-frontend/app/dashboard/page.tsx")

FUNCTION_ANCHOR = "function OrdersWorkspace() {"
START_MARKER = '<div className="border-b border-slate-100 p-4 sm:p-5">'
END_MARKER = '<div className="hidden overflow-x-auto lg:block">'

NEW_BLOCK = '''        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="mb-4">
            <div className="flex h-11 overflow-hidden rounded-2xl">
              {statuses.filter((item) => item.key !== "الكل").map((item) => {
                const active = statusFilter === item.key;
                const count = orders.filter((order) => order.status === item.key).length;
                const pipeTones: Record<string, string> = {
                  "جديد": "bg-[#dce7ea] text-[#236c83]",
                  "بانتظار الاعتماد": "bg-[#f6dfc2] text-[#92600e]",
                  "قيد التنفيذ": "bg-[#eef1f1] text-[#64748b]",
                  "جاهز للشحن": "bg-[#d3ece6] text-[#147f75]",
                  "مكتمل": "bg-[#236c83] text-white",
                };
                const tone = pipeTones[item.key] ?? "bg-slate-100 text-slate-600";
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(active ? "الكل" : item.key)}
                    title={`عرض ${item.label}`}
                    style={{ flexGrow: Math.max(count, 0.6), flexBasis: 0 }}
                    className={`flex min-w-[56px] items-center justify-center gap-1.5 border-l border-white/50 px-2 text-center transition last:border-l-0 ${tone} ${active ? "ring-2 ring-inset ring-slate-900" : ""}`}
                  >
                    <span className="text-[8px] font-bold opacity-80">{item.label}</span>
                    <span className="text-[11px] font-black">{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between text-[8px] font-bold text-slate-400">
              <button type="button" onClick={() => setStatusFilter("الكل")} className={`rounded-full px-2 py-1 transition ${statusFilter === "الكل" ? "bg-slate-900 text-white" : "hover:text-slate-600"}`}>
                عرض الكل ({orders.length})
              </button>
              <span>القيمة الإجمالية {formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))}</span>
            </div>
          </div>
          <div className="relative w-full xl:w-72">
            <Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث في الطلبات..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[9px] font-medium outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" />
          </div>
        </div>
'''


def main():
    original = FILE_PATH.read_text(encoding="utf-8")
    lines = original.split("\n")

    func_index = None
    for i, line in enumerate(lines):
        if line.strip() == FUNCTION_ANCHOR:
            func_index = i
            break
    if func_index is None:
        print("ABORTED - function anchor not found")
        return

    start_index = None
    for i in range(func_index, len(lines)):
        if lines[i].strip() == START_MARKER:
            start_index = i
            break
    if start_index is None:
        print("ABORTED - start marker not found within OrdersWorkspace")
        return

    end_index = None
    for i in range(start_index + 1, len(lines)):
        if lines[i].strip() == END_MARKER:
            end_index = i
            break
    if end_index is None:
        print("ABORTED - end marker not found after start marker")
        return

    new_lines = lines[:start_index] + NEW_BLOCK.split("\n")[:-1] + lines[end_index:]
    new_content = "\n".join(new_lines)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = FILE_PATH.with_suffix(FILE_PATH.suffix + f".backup_{timestamp}")
    backup_path.write_text(original, encoding="utf-8")

    FILE_PATH.write_text(new_content, encoding="utf-8")
    print(f"Applied: pipeline bar for Orders. Backup: {backup_path.name}")


if __name__ == "__main__":
    main()
