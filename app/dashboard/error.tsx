// src/app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur critique capturée par le Dashboard:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="h-12 w-12 text-red-500 text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl mb-2">
        Une erreur critique est survenue sur le Dashboard
      </h2>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        {error.message ||
          "Impossible de charger les données analytiques globales."}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition shadow-xs"
      >
        Réessayer le chargement
      </button>
    </div>
  );
}
