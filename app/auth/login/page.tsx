"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupérer un éventuel message de succès après une inscription réussie
  useEffect(() => {
    const message = localStorage.getItem("register_success");
    if (message) {
      setSuccess(message);
      localStorage.removeItem("register_success"); // On le supprime pour ne pas l'afficher indéfiniment
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Identifiants incorrects");
      }

      // Stockage du token et des infos utilisateur
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
      router.refresh();
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
          Se connecter à StreamDash
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          Accédez à votre espace de rendu asynchrone.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
            🎉 {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? "Connexion en cours..." : "Connexion"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Pas encore de compte ?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
