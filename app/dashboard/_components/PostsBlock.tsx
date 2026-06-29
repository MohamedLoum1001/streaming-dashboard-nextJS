// src/app/dashboard/_components/PostsBlock.tsx
// Obligatoire : Gère les interactions utilisateur (soumissions, états locaux de formulaires) et l'hydratation côté client
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostsBlock() {
  // Permet de notifier l'arborescence Next.js d'un changement de données
  const router = useRouter();
  // États locaux (States) pour stocker les publications et les valeurs des inputs
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // États de session hydratés depuis le localStorage du navigateur
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  /**
   * Récupération asynchrone des publications depuis Strapi
   */
  const fetchPosts = async () => {
    // Contrainte obligatoire du sujet : Simulation d'un délai réseau de 2 secondes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Requête Strapi : populate poussé pour lier l'auteur, tri par récence, et limite stricte aux 10 premiers éléments exigée par le sujet
    const res = await fetch(
      "http://localhost:1337/api/posts?populate[users_permissions_user][populate]=*&sort=createdAt:desc&pagination[limit]=10",
    );
    if (res.ok) {
      const json = await res.json();
      // Stockage du tableau d'objets reçus
      setPosts(json.data);
    }
  };

  /**
   * Effet de montage : Chargement initial des données et récupération des jetons d'authentification
   */
  useEffect(() => {
    fetchPosts();
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  /**
   * Soumission du formulaire : Création d'une nouvelle publication en base de données
   */
  const handleCreatePost = async (e: React.FormEvent) => {
    // Empêche le rechargement natif de la page HTML
    e.preventDefault();
    if (!token || !user) return alert("Vous devez être connecté !");

    const res = await fetch("http://localhost:1337/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Envoi du token JWT Strapi dans les headers de sécurité
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // Payload mappant le modèle Strapi
        data: { title, content, users_permissions_user: user.id },
      }),
    });

    if (res.ok) {
      // Nettoyage des champs de saisie
      setTitle("");
      // Nettoyage des champs de saisie
      setContent("");
      // Rechargement asynchrone local immédiat du flux de posts
      fetchPosts();

      // Crucial : Indique à Next.js de recalculer les données des Server Components parents (met à jour le compteur global du ruban KPI !)
      router.refresh();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* En-tête du module */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
            📝
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Publications de la Communauté
            </h2>
            <p className="text-xs text-slate-500">
              Exprimez-vous en temps réel (10 max)
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire protégé : Soumis à la condition d'avoir un utilisateur authentifié */}
      {user ? (
        <form
          onSubmit={handleCreatePost}
          className="mb-5 space-y-2.5 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100"
        >
          <input
            type="text"
            required
            placeholder="Titre de votre publication..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            required
            placeholder="Que voulez-vous partager ?"
            rows={2}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
          >
            Publier sur le flux
          </button>
        </form>
      ) : (
        <p className="text-2xs text-center text-slate-400 bg-slate-50 p-2 rounded-lg mb-4">
          ⚠️ Connectez-vous pour ajouter un post.
        </p>
      )}

      {/* Container de la liste : scroll vertical limité à 250px */}
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {posts.length > 0 ? (
          posts.map((post: any) => {
            // Normalisation adaptative de la structure des données reçues de l'API (Strapi v4 vs v5)
            const attr = post.attributes ? post.attributes : post;

            // Mapping robuste et sécurisé pour extraire l'username de l'auteur réel
            const authorData =
              attr.users_permissions_user?.data?.attributes ||
              attr.users_permissions_user?.data ||
              post.users_permissions_user;

            const authorName = authorData?.username || "Auteur anonyme";

            return (
              <div
                key={post.id}
                className="group flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50/30 p-3.5 hover:border-amber-200 transition-all"
              >
                {/* Métadonnées de l'article (Auteur et ID unique de la ligne) */}
                <div className="flex items-center justify-between text-2xs">
                  <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    ✍️ {authorName}
                  </span>
                  <span className="text-slate-400">ID: #{post.id}</span>
                </div>
                {/* Contenu textuel */}
                <h3 className="text-xs font-bold text-slate-800">
                  {attr.title}
                </h3>
                <p className="text-2xs text-slate-500 line-clamp-2">
                  {attr.content}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-gray-500 text-center py-4">
            Aucune publication.
          </p>
        )}
      </div>
    </div>
  );
}
