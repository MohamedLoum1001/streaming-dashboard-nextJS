// src/app/dashboard/_components/CommentsBlock.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CommentsBlock() {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // State local pour isoler l'erreur dans ce bloc uniquement
  const [hasError, setHasError] = useState(false);

  const fetchData = async () => {
    try {
      // Simulation du délai réseau obligatoire de 1.5 seconde
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ⚠️ SIMULATION D'ERREUR DEMANDÉE : Fausse URL pour forcer l'échec du fetch
      const resCom = await fetch(
        "http://localhost:1337/api/comments-qui-nexiste-pas?populate[users_permissions_user][populate]=*&populate[post][populate]=*&sort=createdAt:desc",
      );

      if (!resCom.ok) {
        throw new Error("Erreur lors de la récupération des commentaires");
      }

      const json = await resCom.json();
      setComments(json.data);
      setHasError(false);

      // Récupérer la liste des posts pour le select option
      const resPosts = await fetch("http://localhost:1337/api/posts");
      if (resPosts.ok) {
        const jsonPosts = await resPosts.json();
        setPosts(jsonPosts.data);
      }
    } catch (error) {
      console.error("Erreur isolée capturée sur CommentsBlock :", error);
      setHasError(true); // Active l'interface d'erreur de repli locale
    }
  };

  useEffect(() => {
    fetchData();
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return alert("Vous devez être connecté !");
    if (!selectedPostId) return alert("Sélectionnez un post !");

    const res = await fetch("http://localhost:1337/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          content,
          post: selectedPostId,
          users_permissions_user: user.id,
        },
      }),
    });

    if (res.ok) {
      setContent("");
      fetchData();
      router.refresh();
    }
  };

  // Rendu alternatif de secours (Fallback) si une erreur survient
  if (hasError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center h-full flex flex-col items-center justify-center min-h-[350px]">
        <div className="text-2xl mb-2">⚠️</div>
        <h2 className="text-sm font-semibold text-red-900">
          Commentaires temporairement indisponibles
        </h2>
        <p className="text-xs text-red-600/80 mt-1 max-w-xs">
          Une erreur simulée a empêché le chargement de ce bloc. Les autres
          modules restent opérationnels.
        </p>
        <button
          onClick={fetchData}
          className="mt-4 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-2xs font-bold text-white transition cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold text-lg">
            💬
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Commentaires Récents
            </h2>
            <p className="text-xs text-slate-500">
              Interactions communautaires
            </p>
          </div>
        </div>
      </div>

      {user ? (
        <form
          onSubmit={handleCreateComment}
          className="mb-5 space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100"
        >
          <select
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-2xs focus:outline-none"
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
          >
            <option value="">-- Choisir la publication à commenter --</option>
            {posts.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.attributes?.title || p.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            required
            placeholder="Écrire une réponse..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-2xs focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
          >
            Commenter
          </button>
        </form>
      ) : (
        <p className="text-2xs text-center text-slate-400 bg-slate-50 p-2 rounded-lg mb-4">
          ⚠️ Connectez-vous pour ajouter un commentaire.
        </p>
      )}

      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {comments.length > 0 ? (
          comments.map((comment: any) => {
            const attr = comment.attributes ? comment.attributes : comment;

            const userData =
              attr.users_permissions_user?.data?.attributes ||
              attr.users_permissions_user?.data ||
              comment.users_permissions_user;

            const commentator = userData?.username || "Anonyme";

            const postData = attr.post?.data?.attributes || attr.post?.data;
            const postTitle = postData?.title || "un post";

            return (
              <div
                key={comment.id}
                className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100/70"
              >
                <div className="flex items-center justify-between text-2xs text-slate-400">
                  <span className="font-semibold text-slate-700">
                    👤 {commentator}
                  </span>
                  <span className="italic truncate max-w-[150px]">
                    sur: {postTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                  {attr.content}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-gray-500 text-center py-4">
            Aucun commentaire.
          </p>
        )}
      </div>
    </div>
  );
}
