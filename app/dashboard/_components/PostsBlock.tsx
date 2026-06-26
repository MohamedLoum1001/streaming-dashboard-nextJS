// src/app/dashboard/_components/PostsBlock.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostsBlock() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Charger les posts et l'état utilisateur local
  const fetchPosts = async () => {
    // Contrainte du sujet : Simulation du délai réseau de 2 secondes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 🔄 Correction de l'URL pour forcer Strapi à peupler entièrement la relation User imbriquée
    const res = await fetch(
      "http://localhost:1337/api/posts?populate[users_permissions_user][populate]=*&sort=createdAt:desc&pagination[limit]=10",
    );
    if (res.ok) {
      const json = await res.json();
      setPosts(json.data);
    }
  };

  useEffect(() => {
    fetchPosts();
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return alert("Vous devez être connecté !");

    const res = await fetch("http://localhost:1337/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: { title, content, users_permissions_user: user.id },
      }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      fetchPosts(); // Rechargement local immédiat de la liste
      router.refresh(); // Force Next.js à recalculer les KPI du Server Component parent !
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
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

      {/* Formulaire de création de Post */}
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

      {/* Liste des Posts */}
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {posts.length > 0 ? (
          posts.map((post: any) => {
            const attr = post.attributes ? post.attributes : post;

            // Traitement robuste de l'auteur pour Strapi v4 ou v5
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
                <div className="flex items-center justify-between text-2xs">
                  <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    ✍️ {authorName}
                  </span>
                  <span className="text-slate-400">ID: #{post.id}</span>
                </div>
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
