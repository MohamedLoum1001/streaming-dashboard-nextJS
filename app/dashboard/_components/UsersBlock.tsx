// src/app/dashboard/_components/UsersBlock.tsx

// Importation de la fonction utilitaire pour simuler la latence réseau côté serveur
import { delay } from "../../lib/utils";

/**
 * Composant UsersBlock : Server Component Asynchrone (Rendu côté Serveur - SSR).
 * Il s'exécute exclusivement sur le serveur Node.js. L'absence de la directive "use client"
 * garantit qu'aucun JavaScript superflu n'est envoyé au navigateur pour ce composant de données principal.
 */
export default async function UsersBlock() {
  // Contrainte obligatoire du sujet : simulation du délai réseau de 1000 ms côté serveur.
  // Grâce à React Suspense, l'application globale n'attend pas la résolution de cette seconde pour s'afficher.
  await delay(1000);

  // Récupération des données utilisateurs depuis l'API locale Strapi
  const res = await fetch("http://localhost:1337/api/users", {
    // Garantit la fraîcheur des données à chaque refresh en désactivant le cache de Next.js (Rendu dynamique strict)
    cache: "no-store",
  });

  // Gestion d'erreur robuste : Si Strapi est éteint ou renvoie une erreur, l'exception est levée
  // et capturée proprement par le fichier global `error.tsx` de ton dashboard.
  if (!res.ok) throw new Error("Impossible de charger les utilisateurs");

  const users = await res.json();

  // Adaptabilité structurelle : Gère la réponse sous forme de tableau direct (Strapi /users standard)
  // ou encapsulée dans une propriété .data (format API standardisé)
  const usersList = Array.isArray(users) ? users : users.data;

  return (
    // Carte conteneur stylisée avec des effets de transition fluides lors du survol de la souris
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Section En-tête : Titre du bloc et compteur total */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          {/* Badge d'icône avec fond vert d'émeraude doux */}
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
        {/* Affichage dynamique du nombre total d'inscrits trouvés */}
        <span className="text-2xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
          {usersList?.length || 0} total
        </span>
      </div>

      {/* Liste défilante des utilisateurs (Hauteur maximale bloquée à 250px avec scrollbar discrète) */}
      <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
        {usersList && usersList.length > 0 ? (
          usersList.map((user: any) => {
            // Normalisation adaptative pour lire les données (Strapi v4 avec .attributes vs Strapi v5 direct)
            const data = user.attributes ? user.attributes : user;

            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100/70 hover:bg-slate-50 transition-all"
              >
                {/* Section Gauche : Avatar + Textes d'informations */}
                <div className="flex items-center gap-2.5">
                  {/* Avatar dynamique générant les 2 premières lettres de l'username en majuscules */}
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-400 text-white font-bold text-2xs flex items-center justify-center uppercase">
                    {(data.username || "U").substring(0, 2)}
                  </div>
                  {/* Informations textuelles tronquées pour éviter les bugs d'affichage sur mobile */}
                  <div className="truncate max-w-[150px]">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {data.username}
                    </p>
                    <p className="text-3xs text-slate-400 truncate">
                      {data.email}
                    </p>
                  </div>
                </div>

                {/* Section Droite : Statut de connexion équipé d'une animation clignotante (pulse) */}
                <span className="text-3xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md animate-pulse">
                  En ligne
                </span>
              </div>
            );
          })
        ) : (
          // Interface de repli si la base de données utilisateurs est vide
          <p className="text-xs text-gray-500 text-center py-4">
            Aucun utilisateur actif.
          </p>
        )}
      </div>
    </div>
  );
}
