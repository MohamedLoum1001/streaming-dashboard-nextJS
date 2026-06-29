// src/app/dashboard/error.tsx
// Obligatoire : Les composants d'erreur de Next.js (error.tsx) doivent être des Client Components pour capturer les erreurs d'hydratation et interagir avec l'utilisateur
"use client";
import { useEffect } from "react";

/**
 * Composant DashboardError : Gère l'affichage de repli (Fallback) global du dashboard
 * en cas de crash critique d'un Server Component ou d'un Client Component enfant.
 * * @param error - L'objet d'erreur contenant le message et un identifiant unique (digest) généré par le serveur
 * @param reset - Une fonction native de Next.js permettant de tenter de restituer/recharger le composant défaillant
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Cycle de vie : Log l'erreur capturée dans la console du navigateur à des fins de débogage / monitoring
  useEffect(() => {
    console.error("Erreur critique capturée par le Dashboard:", error);
  }, [error]);

  return (
    // Conteneur principal : Centrage parfait de l'interface d'erreur en plein écran (Flexbox)
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      {/* Icône d'avertissement visuelle */}
      <div className="h-12 w-12 text-red-500 text-4xl mb-4">⚠️</div>

      {/* Titre principal */}
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl mb-2">
        Une erreur critique est survenue sur le Dashboard
      </h2>

      {/* Message dynamique : Affiche le vrai message d'erreur si disponible, sinon un texte générique de secours */}
      <p className="text-sm text-slate-500 max-w-md mb-6">
        {error.message ||
          "Impossible de charger les données analytiques globales."}
      </p>

      {/* Bouton de récupération : Déclenche l'action native reset() pour retenter le rendu sans recharger toute l'application */}
      <button
        onClick={() => reset()}
        className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition shadow-xs cursor-pointer"
      >
        Réessayer le chargement
      </button>
    </div>
  );
}
