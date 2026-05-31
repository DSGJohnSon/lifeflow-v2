import { getSession } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const session = (await getSession())!;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Connecté en tant que <strong>{session.user.email}</strong></p>
      {session.user.name && <p>Nom : {session.user.name}</p>}
      {session.user.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={session.user.image} alt="avatar" width={48} height={48} />
      )}
      <p>Session expire le : {new Date(session.session.expiresAt).toLocaleString("fr-FR")}</p>
      <SignOutButton />
    </div>
  );
}
