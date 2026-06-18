import { delay } from "../../lib/utils";

export default async function UsersBlock() {
  await delay(1000);
  const res = await fetch("http://localhost:1337/api/users", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error();
  const users = await res.json();
  const usersList = Array.isArray(users) ? users : users.data;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
            👥
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Utilisateurs Actifs
            </h2>
            <p className="text-xs text-slate-500">Mise à jour en direct</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
          {usersList?.length || 0} total
        </span>
      </div>

      <div className="mt-4 divide-y divide-slate-50">
        {usersList?.slice(0, 4).map((user: any) => {
          const data = user.attributes ? user.attributes : user;
          return (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-xs">
                  {(data.username || "U").substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700">
                    {data.username}
                  </span>
                  <span className="text-xs text-slate-400">{data.email}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                En ligne
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
