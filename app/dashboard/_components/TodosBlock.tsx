// src/app/dashboard/_components/TodosBlock.tsx

// Importation de la fonction utilitaire personnalisée pour simuler la latence réseau côté serveur
import { delay } from "../../lib/utils";

/**
 * Composant TodosBlock : Server Component Asynchrone (Rendu côté Serveur - SSR).
 * Contrairement aux blocs "Posts" ou "Comments", il ne contient aucune directive "use client".
 * Il s'exécute exclusivement sur le serveur Node.js, ce qui optimise les performances et le SEO.
 */
export default async function TodosBlock() {
  // Contrainte obligatoire du sujet : Simulation d'un délai réseau de 3 000 ms côté serveur.
  // Ce bloc étant le plus lent, son délai met en évidence la puissance du Streaming SSR via React Suspense.
  await delay(3000);

  // Contrainte technique du sujet : Consommer l'API REST publique externe JSONPlaceholder pour l'utilisateur ID #1
  // L'option { cache: "no-store" } force Next.js à contourner le cache à chaque requête pour obtenir des données en temps réel (Dynamic Rendering).
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?userId=1",
    {
      cache: "no-store",
    },
  );

  // Gestion d'erreur native Next.js : Si le serveur distant répond avec un code d'erreur (ex: 404, 500)
  // L'erreur est levée et sera automatiquement interceptée par le fichier error.tsx du dossier parent.
  if (!res.ok) throw new Error("Impossible de charger les todos");

  // Extraction du flux JSON en objet JavaScript typé
  const todos = await res.json();

  return (
    // Layout du bloc : structure identique aux autres cartes pour préserver l'harmonie visuelle de la grille
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* En-tête du module */}
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

      {/* Liste des tâches filtrées et scrollable verticalement */}
      <div className="mt-4 space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
        {todos && todos.length > 0 ? (
          // UX/Performance : slice(0, 5) limite l'affichage aux 5 premières tâches pour des raisons d'ergonomie d'interface
          todos.slice(0, 5).map((todo: any) => {
            return (
              <div
                key={todo.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 shadow-2xs"
              >
                {/* Section Gauche : Statut de la checkbox et libellé de la tâche */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Pastille de statut personnalisée (Verte si complétée, Grise si en attente) */}
                  <span
                    className={`flex h-4 w-4 shrink-0 rounded-full border-2 ${todo.completed ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}
                  />
                  {/* Style dynamique du texte : barré et grisé (line-through) si la tâche est terminée */}
                  <span
                    className={`text-sm truncate ${todo.completed ? "line-through text-slate-400" : "text-slate-700 font-medium"}`}
                  >
                    {todo.title}
                  </span>
                </div>

                {/* Section Droite : Badge textuel d'état (Fait / En Cours) */}
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wider ${todo.completed ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}
                >
                  {todo.completed ? "Fait" : "En Cours"}
                </span>
              </div>
            );
          })
        ) : (
          // Interface de secours si le tableau retourné par l'API est vide
          <p className="text-xs text-gray-500 text-center py-4">
            Aucune tâche disponible.
          </p>
        )}
      </div>
    </div>
  );
}
