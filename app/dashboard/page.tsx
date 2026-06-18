// src/app/dashboard/page.tsx
export const dynamic = "force-dynamic"; // Reste un Server Component dynamique pur

import { Suspense } from "react";
import Navbar from "./_components/Navbar"; // On importe la Navbar isolée
import UsersBlock from "./_components/UsersBlock";
import CommentsBlock from "./_components/CommentsBlock";
import PostsBlock from "./_components/PostsBlock";
import TodosBlock from "./_components/TodosBlock";
import { BlockSkeleton } from "./_components/Skeletons";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      {/* Intégration de la Navbar Client dans notre environnement Server */}
      <Navbar />

      <div className="p-6 md:p-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Project Analytics Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Architecture de rendu asynchrone isolée (Streaming SSR & React
              Suspense Boundaries).
            </p>
          </div>
        </header>

        {/* Global KPI Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Cluster Status",
              value: "Healthy",
              color: "text-emerald-600",
            },
            {
              label: "Data Pipeline",
              value: "Active",
              color: "text-indigo-600",
            },
            { label: "API Gateway", value: "99.98%", color: "text-slate-700" },
            {
              label: "Streaming Mode",
              value: "Granular",
              color: "text-violet-600",
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-2xs"
            >
              <p className="text-2xs font-medium uppercase tracking-wider text-slate-400">
                {kpi.label}
              </p>
              <p className={`text-lg font-bold mt-1 ${kpi.color}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* Grille de rendu des 4 blocs indépendants avec Streaming */}
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
