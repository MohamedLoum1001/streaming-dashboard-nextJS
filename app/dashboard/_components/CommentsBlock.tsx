"use client";

import { useState, useEffect } from "react";

export default function CommentsBlock() {
  const [comments, setComments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchData = async () => {
    // Récupérer les commentaires
    const resCom = await fetch(
      "http://localhost:1337/api/comments?populate=*&sort=createdAt:desc",
    );
    if (resCom.ok) {
      const json = await resCom.json();
      setComments(json.data);
    }
    // Récupérer la liste des posts disponibles pour le select option
    const resPosts = await fetch("http://localhost:1337/api/posts");
    if (resPosts.ok) {
      const json = await resPosts.json();
      setPosts(json.data);
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
    }
  };

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

      {/* Formulaire de création de Commentaire */}
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
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-bold text-white transition"
          >
            Commenter
          </button>
        </form>
      ) : (
        <p className="text-2xs text-center text-slate-400 bg-slate-50 p-2 rounded-lg mb-4">
          ⚠️ Connectez-vous pour ajouter un commentaire.
        </p>
      )}

      {/* Liste des Commentaires */}
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {comments.length > 0 ? (
          comments.map((comment: any) => {
            const attr = comment.attributes ? comment.attributes : comment;
            const userData =
              attr.users_permissions_user?.data?.attributes ||
              attr.users_permissions_user?.data;
            const commentator = userData?.username || "Anonyme";
            const postTitle = attr.post?.data?.attributes?.title || "un post";

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
