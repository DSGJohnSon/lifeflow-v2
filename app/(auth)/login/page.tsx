"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message ?? "Une erreur est survenue.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div>
        <h1>Vérifiez vos emails</h1>
        <p>Un lien de connexion a été envoyé à <strong>{email}</strong>.</p>
        <p>Cliquez sur le lien dans l&apos;email pour vous connecter.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Connexion</h1>

      <button
        onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })}
      >
        Se connecter avec GitHub
      </button>

      <hr />

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Adresse email</label>
        <br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="vous@exemple.com"
        />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Envoi en cours…" : "Recevoir le lien de connexion"}
        </button>
      </form>
    </div>
  );
}
