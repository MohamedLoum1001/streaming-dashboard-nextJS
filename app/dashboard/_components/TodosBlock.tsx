import { delay } from "../../lib/utils";

export default async function TodosBlock() {
  await delay(3000);
  const res = await fetch("http://localhost:1337/api/todos?filters[userId][$eq]=1", { cache: "no-store" });
  if (!res.ok) throw new Error();
  const json = await res.json();
  const todos = json.data;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">✅</div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Suivi des Tâches</h2>
            <p className="text-xs text-slate-500">Assigné au Responsable #1</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {todos?.slice(0, 4).map((todo: any) => {
          const attr = todo.attributes ? todo.attributes : todo;
          return (
            <div key={todo.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`flex h-4 w-4 shrink-0 rounded-full border-2 ${attr.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`} />
                <span className={`text-sm truncate ${attr.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"}`}>
                  {attr.title}
                </span>
              </div>
              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wider ${attr.completed ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
                {attr.completed ? 'Fait' : 'En Cours'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}