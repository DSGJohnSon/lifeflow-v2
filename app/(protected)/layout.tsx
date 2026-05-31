import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Suspense } from "react";
import AuthMethodTracker from "./auth-method-tracker";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Suspense>
        <AuthMethodTracker />
      </Suspense>
      {children}
    </>
  );
}
