"use client";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm flex items-center justify-center text-white font-black text-xs">
            S
          </span>
          <span className="font-bold text-sm tracking-tight text-slate-800 uppercase">
            StreamDash{" "}
            <span className="text-indigo-600 text-xs font-mono">v1.0</span>
          </span>
        </div>

        {/* Section Droite : Statut + Bouton Déconnexion */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Production Engine Ready
            </span>
          </div>

          {/* Bouton de Déconnexion Client */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
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
