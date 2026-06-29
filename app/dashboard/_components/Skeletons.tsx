// src/app/dashboard/_components/Skeletons.tsx

/**
 * Composant BlockSkeleton : Génère un squelette visuel animé (Skeleton Loader).
 * Utilisé comme interface de transition (fallback) par React Suspense pendant le chargement
 * asynchrone progressif (Streaming SSR) de chaque bloc de données du tableau de bord.
 */
export function BlockSkeleton() {
  return (
    // Conteneur de la carte : reproduit les mêmes dimensions, bordures et arrondis que les vrais blocs métiers
    // 'relative' et 'overflow-hidden' sont requis pour masquer le reflet Shimmer qui dépasse des bords lors du balayage
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      {/* Injection locale de l'animation CSS (Shimmer Effect)
          dangerouslySetInnerHTML évite à Next.js d'échapper les chaînes de texte CSS.
          Cette méthode permet de déclarer des keyframes natifs à la volée sans modifier le fichier tailwind.config.js du projet. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `,
        }}
      />

      {/* Reflet brillant linéaire (Shimmer Graphic Component)
          Placé en 'absolute' au-dessus du fond mais sous le texte, il démarre caché à gauche (-translate-x-full) 
          et traverse la carte de gauche à droite à l'infini grâce à l'animation déclarée ci-dessus. */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/80 to-transparent" />

      {/* Squelette de l'en-tête du bloc (Simule un titre et un badge à droite) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        {/* Faux titre de la carte */}
        <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-200" />
        {/* Faux badge ou compteur de métadonnées */}
        <div className="h-4 w-12 animate-pulse rounded-md bg-slate-100" />
      </div>

      {/* Squelette de la liste de contenu (Simule 3 lignes de flux d'activité) */}
      <div className="mt-5 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            {/* Colonne gauche : Bloc principal de texte multi-lignes */}
            <div className="space-y-2 flex-1">
              {/* Ligne supérieure (ex: Nom d'utilisateur ou Titre d'article) */}
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              {/* Ligne inférieure secondaire (ex: adresse email ou description condensée) */}
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
            {/* Colonne droite : Petit élément secondaire isolé (ex: Statut 'En cours' ou ID de l'élément) */}
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
