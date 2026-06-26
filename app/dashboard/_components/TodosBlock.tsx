// src/app/dashboard/_components/TodosBlock.tsx
import { delay } from "../../lib/utils";

export default async function TodosBlock() {
  // Contrainte obligatoire : délai de 3000 ms côté serveur
  await delay(3000);

  // Contrainte technique du sujet : Charger depuis JSONPlaceholder
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?userId=1",
    {
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Impossible de charger les todos");

  const todos = await res.json();

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 font-bold text-lg">
            🎯
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Suivi des Tâches (User #1)
            </h2>
            <p className="text-xs text-slate-500">
              Pipeline de production externe
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
        {todos && todos.length > 0 ? (
          todos.slice(0, 5).map((todo: any) => {
            return (
              <div
                key={todo.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-4 w-4 shrink-0 rounded-full border-2 ${todo.completed ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}
                  />
                  <span
                    className={`text-sm truncate ${todo.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"}`}
                  >
                    {todo.title}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wider ${todo.completed ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}
                >
                  {todo.completed ? "Fait" : "En Cours"}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-gray-500 text-center py-4">
            Aucune tâche disponible.
          </p>
        )}
      </div>
    </div>
  );
}
