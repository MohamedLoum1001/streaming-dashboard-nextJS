// src/app/auth/register/page.tsx
// Requis : Ce composant d'inscription manipule des états locaux (useState), interagit avec le routeur et utilise le localStorage
"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
// Composant Next.js optimisé pour la navigation interne sans rechargement de page
import Link from "next/link"; 

/**
 * Composant RegisterPage : Gère la création de nouveaux comptes utilisateurs.
 * Connecté nativement à l'endpoint d'inscription de l'instance Strapi (plugin Users-Permissions).
 */
export default function RegisterPage() {
  // Permet d'effectuer des redirections programmatiques côté client
  const router = useRouter(); 

  // États de stockage locaux des informations de saisie
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // États de gestion de l'interface utilisateur (UI) et retours d'API
   // Capture et affiche les messages d'échec (ex: email déjà pris)
  const [error, setError] = useState("");
   // Désactive le bouton d'envoi pour éviter le spam de clics pendant le traitement
  const [loading, setLoading] = useState(false);

  /**
   * Gestionnaire de soumission du formulaire d'inscription
   */
  const handleRegister = async (e: React.FormEvent) => {
     // Stoppe le comportement de rafraîchissement par défaut du formulaire HTML
    e.preventDefault();
    // Nettoie les erreurs des tentatives précédentes
    setError(""); 
    // Verrouille l'interface (état de chargement)
    setLoading(true); 

    try {
      // Envoi de la requête POST à l'API d'inscription locale de Strapi
      const res = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Payload contenant les identifiants requis
        body: JSON.stringify({ username, email, password }), 
      });

      const data = await res.json();

      // Interception des échecs de validation de Strapi (Statut HTTP != 2xx)
      if (!res.ok) {
        throw new Error(
          data.error?.message ||
            "Une erreur est survenue lors de l'inscription",
        );
      }

      // --- CAS : INSCRIPTION RÉUSSIE ---
      // Astuce UX : On stocke temporairement un message de notification dans le navigateur.
      // Cela permettra à la page de connexion (Login) de le lire et d'afficher un badge de bienvenue vert.
      localStorage.setItem(
        "register_success",
        "Inscription réussie ! Connectez-vous maintenant.",
      );

      // Redirection programmatique instantanée de l'étudiant vers la page d'authentification
      router.push("/auth/login");
    } catch (err: any) {
      // Hydrate le state d'erreur pour alerter visuellement l'utilisateur
      setError(err.message); 
    } finally {
      // Libère le formulaire à la fin du traitement
      setLoading(false); 
    }
  };

  return (
    // Centrage absolu de la carte d'inscription sur l'écran via Flexbox
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        {/* Section En-tête */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-2">
          Créer un compte
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          Rejoignez la communauté dès aujourd'hui.
        </p>

        {/* Bannière d'affichage d'erreur conditionnelle */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Formulaire d'inscription */}
        <form onSubmit={handleRegister} className="space-y-4">
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

          {/* Bouton d'action adaptatif : affiche un indicateur de chargement textuel et se désactive (disabled) pendant la requête */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        {/* Pied de la carte : Lien de redirection vers le login équipé du composant optimisé <Link> */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Déjà un compte ?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
