// src/app/dashboard/_components/Navbar.tsx
// Requis : Ce composant interagit directement avec les API globales du navigateur (localStorage, redirection via window.location)
"use client"; 

/**
 * Composant Navbar : Barre de navigation supérieure globale pour l'interface StreamDash.
 * Sa nature de Client Component isolé permet aux Server Components de la page principale
 * de s'exécuter et d'effectuer le Streaming SSR sans interférence.
 */
export default function Navbar() {
  return (
    // Barre de navigation stylisée : sticky pour rester en haut, flou d'arrière-plan (backdrop-blur) et z-50 pour la superposition
    <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Section Gauche : Branding & Identité visuelle du projet */}
        <div className="flex items-center gap-3">
          {/* Logo avec dégradé moderne */}
          <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm flex items-center justify-center text-white font-black text-xs">
            S
          </span>
          {/* Titre et tag de versioning mono-espacé */}
          <span className="font-bold text-sm tracking-tight text-slate-800 uppercase">
            StreamDash{" "}
            <span className="text-indigo-600 text-xs font-mono">v1.0</span>
          </span>
        </div>

        {/* Section Droite : Indicateur de statut de production + Bouton Déconnexion */}
        <div className="flex items-center gap-5">
          {/* Badge de statut système en direct */}
          <div className="flex items-center gap-2">
            {/* Pastille verte animée avec effet de pulsation pour simuler une activité dynamique */}
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Production Engine Ready
            </span>
          </div>

          {/* Bouton de Déconnexion Client */}
          <button
            onClick={() => {
              // 1. Purge complète des données de session stockées dans le navigateur
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              // 2. Redirection stricte de l'utilisateur vers la barrière d'authentification globale
              window.location.href = "/auth";
            }}
            className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
