"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // État pour le message de succès d'inscription
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const endpoint = isRegister ? "local/register" : "local";
    const body = isRegister
      ? { username, email, password }
      : { identifier: email, password };

    try {
      const res = await fetch(`http://localhost:1337/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Une erreur est survenue");
      }

      if (isRegister) {
        // --- CAS : INSCRIPTION REUSSIE ---
        setSuccess(
          "🎉 Inscription réussie ! Connectez-vous maintenant avec vos identifiants.",
        );
        setIsRegister(false); // Redirige visuellement l'utilisateur vers la vue Login
        setPassword(""); // Efface le mot de passe par sécurité
        setUsername(""); // Efface le nom d'utilisateur
      } else {
        // --- CAS : CONNEXION REUSSIE ---
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-2">
          {isRegister ? "Créer un compte" : "Se connecter à StreamDash"}
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          {isRegister
            ? "Rejoignez la communauté dès aujourd'hui."
            : "Accédez à votre espace de rendu asynchrone."}
        </p>

        {/* Message d'Erreur */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Message de Succès Suite Inscription */}
        {success && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom d&apos;utilisateur
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none transition"
                placeholder="Ex: Mohamed"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Adresse Email
            </label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none transition"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Chargement..."
              : isRegister
                ? "S'inscrire"
                : "Connexion"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess(""); // Nettoie les messages d'état lors du switch manuel
            }}
            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            {isRegister
              ? "Déjà un compte ? Connectez-vous"
              : "Pas encore de compte ? Inscrivez-vous"}
          </button>
        </div>
      </div>
    </div>
  );
}
