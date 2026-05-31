"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { GithubLogo, CircleNotch, PaperPlaneTilt, EnvelopeSimple } from "@phosphor-icons/react";

type AuthMethod = "github" | "magic-link";

const LAST_USED_KEY = "lifeflow_last_auth_method";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loadingMethod, setLoadingMethod] = useState<AuthMethod | null>(null);
  const [lastUsed, setLastUsed] = useState<AuthMethod | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_USED_KEY) as AuthMethod | null;
    if (stored === "github" || stored === "magic-link") setLastUsed(stored);
  }, []);

  async function handleGitHub() {
    setLoadingMethod("github");
    setError("");
    const { error } = await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard?auth=github" });
    if (error) {
      setError(error.message ?? "Une erreur est survenue avec GitHub.");
      setLoadingMethod(null);
    }
    // Pas de reset si succès : la page sera redirigée vers GitHub
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoadingMethod("magic-link");
    setError("");

    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: "/dashboard?auth=magic-link",
    });

    if (error) {
      setError(error.message ?? "Une erreur est survenue.");
      setLoadingMethod(null);
    } else {
      setSent(true);
      setLoadingMethod(null);
    }
  }

  const isLoading = loadingMethod !== null;

  if (sent) {
    return (
      <div className="w-full max-w-sm mx-auto text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <EnvelopeSimple weight="duotone" className="w-7 h-7 text-green-600" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">Vérifiez vos emails</h1>
          <p className="text-sm text-gray-500">
            Un lien de connexion a été envoyé à{" "}
            <span className="font-medium text-gray-700">{email}</span>.
          </p>
          <p className="text-sm text-gray-400">Cliquez sur le lien pour vous connecter.</p>
        </div>
        <button
          onClick={() => setSent(false)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
        >
          Renvoyer ou changer d&apos;adresse
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Connexion</h1>
        <p className="text-sm text-gray-500">Connectez-vous pour continuer !</p>
      </div>

      {/* GitHub */}
      <div className="relative">
        <button
          onClick={handleGitHub}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMethod === "github" ? (
            <CircleNotch className="w-4 h-4 animate-spin text-gray-500" />
          ) : (
            <GithubLogo weight="fill" className="w-4 h-4 text-gray-800" />
          )}
          {loadingMethod === "github" ? "Connexion en cours…" : "Continuer avec GitHub"}
        </button>
        {lastUsed === "github" && (
          <LastUsedBadge />
        )}
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Magic link */}
      <form onSubmit={handleMagicLink} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="vous@exemple.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 shadow-xs outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {lastUsed === "magic-link" && (
              <LastUsedBadge />
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gray-900 text-sm font-medium text-white hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          {loadingMethod === "magic-link" ? (
            <CircleNotch className="w-4 h-4 animate-spin" />
          ) : (
            <PaperPlaneTilt weight="fill" className="w-4 h-4" />
          )}
          {loadingMethod === "magic-link" ? "Envoi en cours…" : "Recevoir le lien de connexion"}
        </button>
      </form>
    </div>
  );
}

function LastUsedBadge() {
  return (
    <span className="absolute -top-2 -right-2 text-[10px] font-semibold bg-gray-900 text-white px-1.5 py-0.5 rounded-full leading-none tracking-wide shadow-sm">
      Dernière connexion
    </span>
  );
}
