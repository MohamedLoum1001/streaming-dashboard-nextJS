// src/app/dashboard/_components/UsersBlock.tsx
import { delay } from "../../lib/utils";

export default async function UsersBlock() {
  // Contrainte obligatoire du sujet : simulation du délai réseau de 1000 ms côté serveur
  await delay(1000);

  const res = await fetch("http://localhost:1337/api/users", {
    // Garantit la fraîcheur des données à chaque refresh
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Impossible de charger les utilisateurs");

  const users = await res.json();
  const usersList = Array.isArray(users) ? users : users.data;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
            👥
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Utilisateurs Actifs
            </h2>
            <p className="text-xs text-slate-500">Mise à jour en direct</p>
          </div>
        </div>
        <span className="text-2xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
          {usersList?.length || 0} total
        </span>
      </div>

      <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
        {usersList && usersList.length > 0 ? (
          usersList.map((user: any) => {
            const data = user.attributes ? user.attributes : user;
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 border border-slate-100/70 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-400 text-white font-bold text-2xs flex items-center justify-center uppercase">
                    {(data.username || "U").substring(0, 2)}
                  </div>
                  <div className="truncate max-w-[150px]">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {data.username}
                    </p>
                    <p className="text-3xs text-slate-400 truncate">
                      {data.email}
                    </p>
                  </div>
                </div>
                <span className="text-3xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md animate-pulse">
                  En ligne
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-gray-500 text-center py-4">
            Aucun utilisateur actif.
          </p>
        )}
      </div>
    </div>
  );
}
