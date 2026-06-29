// src/app/auth/login/page.tsx
// Requis : Ce composant utilise des hooks d'état (useState, useEffect), interagit avec le stockage client (localStorage) et gère des actions de formulaires
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Composant d'optimisation de Next.js pour le routage rapide sans rechargement de page

import Link from "next/link";
/**
 * Composant LoginPage : Gère l'authentification sécurisée des utilisateurs.
 * Interagit directement avec l'identifiant local de Strapi (endpoint /api/auth/local).
 */
export default function LoginPage() {
  // Permet de piloter la navigation programmatique côté client
  const router = useRouter();

  // États locaux pour la capture des champs de saisie
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // États locaux pour le feedback visuel (erreurs, succès et indicateur de chargement)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Cycle de vie initial (Montage) : Lecture de l'état d'inscription
   * Récupère un éventuel message de succès déposé dans le localStorage par la page RegisterPage
   */
  useEffect(() => {
    const message = localStorage.getItem("register_success");
    if (message) {
      // Hydrate le state pour afficher la bannière verte de bienvenue
      setSuccess(message);

      // Mesure de propreté : On supprime la clé pour éviter que la bannière ne se réaffiche si l'utilisateur rafraîchit la page
      localStorage.removeItem("register_success");
    }
  }, []);

  /**
   * Gestionnaire de soumission du formulaire d'authentification
   */
  const handleLogin = async (e: React.FormEvent) => {
    // Bloque le rechargement standard de la page HTML
    e.preventDefault();
    // Efface les erreurs précédentes
    setError("");
    // Efface les messages de succès précédents
    setSuccess("");
    // Enclenche l'état de chargement visuel du bouton
    setLoading(true);

    try {
      // Envoi des identifiants à l'endpoint local d'authentification Strapi
      // Strapi v4/v5 attend la clé 'identifier' (qui accepte soit l'email, soit l'username)
      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      // Interception des codes d'échec (ex: 400 Bad Request ou 401 Unauthorized)
      if (!res.ok) {
        throw new Error(data.error?.message || "Identifiants incorrects");
      }

      // --- CAS : CONNEXION RÉUSSIE ---
      // Persistance de la session côté client dans le navigateur
      // Stockage du jeton JWT pour authentifier les requêtes futures (ex: création de post/comment)
      localStorage.setItem("token", data.jwt);
      // Stockage du profil utilisateur (id, username, email)
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirection instantanée vers le tableau de bord analytique
      router.push("/dashboard");

      // Crucial : Force Next.js à invalider son cache client pour recalculer les données fraîches du Server Component parent (DashboardPage)
      router.refresh();
    } catch (err: any) {
      // Hydrate le state d'erreur capturé pour la bannière d'alerte rouge
      setError(err.message);
    } finally {
      // Libère le bouton de soumission
      setLoading(false);
    }
  };

  return (
    // Centrage de la carte de connexion sur l'écran (Layout Flexbox)
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        {/* Section Titre */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-2">
          Se connecter à StreamDash
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          Accédez à votre espace de rendu asynchrone.
        </p>

        {/* Bannière d'erreur conditionnelle rouge */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Bannière de succès conditionnelle verte (ex: suite à l'inscription) */}
        {success && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
            🎉 {success}
          </div>
        )}

        {/* Formulaire d'authentification */}
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

          {/* Bouton de soumission adaptatif : Se désactive (disabled) pour bloquer les requêtes multiples */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Connexion en cours..." : "Connexion"}
          </button>
        </form>

        {/* Pied de carte : Navigation optimisée vers l'inscription sans rechargement complet */}
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
