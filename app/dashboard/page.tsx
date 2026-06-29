// src/app/dashboard/page.tsx

// Force Next.js à traiter cette page comme un composant serveur dynamique pur (désactive le cache statique au build)
// Cela garantit que les données des KPI et des blocs restent fraîches à chaque rechargement
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Navbar from "./_components/Navbar";
import UsersBlock from "./_components/UsersBlock";
import CommentsBlock from "./_components/CommentsBlock";
import PostsBlock from "./_components/PostsBlock";
import TodosBlock from "./_components/TodosBlock";
import { BlockSkeleton } from "./_components/Skeletons";

/**
 * 1. Extraction du ruban KPI dans un Server Component asynchrone isolé
 * * En extrayant ce ruban de la page principale, on évite que son `Promise.all` ne bloque
 * le chargement initial du reste de la structure de la page. Ce bloc possède désormais
 * sa propre barrière asynchrone.
 */
async function KpiRibbon() {
  // Initialisation des compteurs par défaut
  let usersCount = 0;
  let postsCount = 0;
  let commentsCount = 0;
  let todosCount = 0;

  try {
    // Parallélisation des requêtes de comptage légères pour des performances optimales.
    // L'utilisation de { cache: "no-store" } force la récupération directe sans passer par le cache.
    const [resUsers, resPosts, resComments, resTodos] = await Promise.all([
      fetch("http://localhost:1337/api/users", { cache: "no-store" }),
      fetch("http://localhost:1337/api/posts", { cache: "no-store" }),
      fetch("http://localhost:1337/api/comments", { cache: "no-store" }),
      fetch("http://localhost:1337/api/todos", { cache: "no-store" }),
    ]);

    // Extraction et assignation des valeurs avec gestion de la structure Strapi (meta/data)
    if (resUsers.ok) {
      const usersData = await resUsers.json();
      usersCount = usersData.length || 0;
    }
    if (resPosts.ok) {
      const postsData = await resPosts.json();
      postsCount =
        postsData.meta?.pagination?.total || postsData.data?.length || 0;
    }
    if (resComments.ok) {
      const commentsData = await resComments.json();
      commentsCount =
        commentsData.meta?.pagination?.total || commentsData.data?.length || 0;
    }
    if (resTodos.ok) {
      const todosData = await resTodos.json();
      todosCount =
        todosData.meta?.pagination?.total || todosData.data?.length || 0;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des KPI dynamiques:", error);
  }

  // Tableau de configuration pour générer proprement les cartes KPI en JSX
  const kpis = [
    {
      label: "Membres Actifs",
      value: `${usersCount} inscrit${usersCount > 1 ? "s" : ""}`,
      color: "text-emerald-600",
    },
    {
      label: "Publications",
      value: `${postsCount} partagée${postsCount > 1 ? "s" : ""}`,
      color: "text-indigo-600",
    },
    {
      label: "Interactions",
      value: `${commentsCount} commentaire${commentsCount > 1 ? "s" : ""}`,
      color: "text-amber-600",
    },
    {
      label: "Objectifs Pipeline",
      value: `${todosCount} tâche${todosCount > 1 ? "s" : ""}`,
      color: "text-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-2xs"
        >
          <p className="text-2xs font-medium uppercase tracking-wider text-slate-400">
            {kpi.label}
          </p>
          <p className={`text-lg font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * 2. Squelette de chargement temporaire (Skeleton) dédié au ruban KPI
 * Affiché pendant la résolution du Promise.all de KpiRibbon.
 */
function KpiRibbonSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-2xs animate-pulse"
        >
          {/* Faux placeholders simulant l'emplacement du texte */}
          <div className="h-3 w-20 bg-slate-200 rounded-sm mb-2" />
          <div className="h-6 w-24 bg-slate-200 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

/**
 * 3. Page principale préservant le streaming asynchrone global
 * * Cette fonction est synchrone au niveau global de la page. Elle envoie immédiatement
 * la structure HTML de base (Navbar, titres) au navigateur. Les blocs lourds enveloppés
 * dans un `<Suspense>` délèguent leur chargement en tâche de fond (Streaming SSR).
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      {/* Composant de navigation global */}
      <Navbar />

      <div className="p-6 md:p-12 max-w-7xl mx-auto">
        {/* En-tête du tableau de bord */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Project Analytics Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Architecture de rendu asynchrone isolée (Streaming SSR & React
              Subpense Boundaries).
            </p>
          </div>
        </header>

        {/* Le ruban KPI se charge de manière isolée sans bloquer le rendu initial de la page */}
        <Suspense fallback={<KpiRibbonSkeleton />}>
          <KpiRibbon />
        </Suspense>

        {/* Grille principale : Rendu granulaire et indépendant des 4 sous-modules métier.
            Chaque bloc possède sa propre zone de Suspense ; ainsi, un ralentissement sur l'un 
            (ex: TodosBlock à 3s) n'empêche pas les autres (ex: UsersBlock à 1s) de s'afficher d'un coup. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<BlockSkeleton />}>
            <UsersBlock />
          </Suspense>

          <Suspense fallback={<BlockSkeleton />}>
            <CommentsBlock />
          </Suspense>

          <Suspense fallback={<BlockSkeleton />}>
            <PostsBlock />
          </Suspense>

          <Suspense fallback={<BlockSkeleton />}>
            <TodosBlock />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
