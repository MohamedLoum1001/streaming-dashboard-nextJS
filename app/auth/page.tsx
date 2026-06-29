// Requis : Ce composant d'authentification manipule des états locaux (useState), gère des soumissions de formulaires et utilise le stockage local de session (localStorage)
"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Composant AuthPage : Gère la passerelle d'accès unifiée à l'application.
 * Il intègre à la fois la logique de connexion (Sign In) et d'inscription (Sign Up)
 * en commutant dynamiquement les endpoints et les structures de données envoyées à Strapi.
 */
export default function AuthPage() {
  // Router de Next.js permettant d'effectuer la redirection vers le Dashboard
  const router = useRouter(); 

  // États de contrôle de l'interface graphique (UI)
  // Alternance visuelle : true = Inscription, false = Connexion
  const [isRegister, setIsRegister] = useState(false); 
  // Bloque les double-soumissions pendant les requêtes asynchrones
  const [loading, setLoading] = useState(false); 

  // États de stockage des inputs formulaires
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // États de notification utilisateur
  // Capture et affiche les retours d'erreurs (ex: identifiants incorrects)
  const [error, setError] = useState(""); 
  // Notifie l'utilisateur de la réussite de sa création de compte
  const [success, setSuccess] = useState(""); 

  /**
   * Gestionnaire principal de soumission du formulaire (Connexion / Inscription)
   */
  const handleSubmit = async (e: React.FormEvent) => {
     // Annule le comportement natif de rechargement de page du navigateur
    e.preventDefault();
    // Réinitialise les erreurs précédentes
    setError(""); 
    // Réinitialise les messages de succès précédents
    setSuccess(""); 
    // Enclenche l'état de chargement visuel
    setLoading(true); 

    // Mappings dynamiques basés sur le mode sélectionné (isRegister) :
    // 1. Endpoint ciblé sur l'API native d'authentification Strapi
    const endpoint = isRegister ? "local/register" : "local";

    // 2. Format du payload JSON attendu par Strapi (Inscription : username/email vs Connexion : identifier/password)
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

      // Interception des codes HTTP d'échec (ex: 400 Bad Request, 401 Unauthorized)
      if (!res.ok) {
        throw new Error(data.error?.message || "Une erreur est survenue");
      }

      if (isRegister) {
        // --- CAS 1 : INSCRIPTION RÉUSSIE ---
        setSuccess(
          "🎉 Inscription réussie ! Connectez-vous maintenant avec vos identifiants.",
        );
        // Bascule automatiquement l'interface sur la vue "Connexion"
        setIsRegister(false); 

        // Mesures de sécurité et nettoyage des champs de saisie
        setPassword("");
        setUsername("");
      } else {
        // --- CAS 2 : CONNEXION RÉUSSIE ---
        // Stockage du jeton JWT et du profil de l'utilisateur dans le stockage local du navigateur
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirection vers l'espace applicatif
        router.push("/dashboard");

        // Force Next.js à rafraîchir l'arbre de composants serveurs pour consommer immédiatement la nouvelle session
        router.refresh();
      }
    } catch (err: any) {
      // Capture l'exception et hydrate l'état d'erreur pour l'affichage utilisateur
      setError(err.message); 
    } finally {
      // Libère le formulaire quel que soit le dénouement de la requête
      setLoading(false); 
    }
  };

  return (
    // Centrage de la carte d'authentification sur l'écran
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        {/* Titres et textes dynamiques adaptés au contexte */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-2">
          {isRegister ? "Créer un compte" : "Se connecter à StreamDash"}
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          {isRegister
            ? "Rejoignez la communauté dès aujourd'hui."
            : "Accédez à votre espace de rendu asynchrone."}
        </p>

        {/* Banner d'affichage d'erreur conditionnel */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Banner d'affichage de succès conditionnel */}
        {success && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Nom d'utilisateur : Affiché uniquement en mode inscription */}
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

          {/* Bouton d'action principal doté d'un style d'attente (disabled) pendant le traitement réseau */}
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

        {/* Section Bas de page : Lien d'alternance des modes (Connexion / Inscription) */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Inverse le booléen d'état
              setIsRegister(!isRegister); 
              // Réinitialise les erreurs pour une transition fluide
              setError(""); 
              // Réinitialise les succès pour une transition fluide
              setSuccess(""); 
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
