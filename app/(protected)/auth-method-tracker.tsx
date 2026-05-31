"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const LAST_USED_KEY = "lifeflow_last_auth_method";

export default function AuthMethodTracker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const method = searchParams.get("auth");
    if (method === "github" || method === "magic-link") {
      localStorage.setItem(LAST_USED_KEY, method);
      // Nettoie le param de l'URL sans recharger la page
      const params = new URLSearchParams(searchParams.toString());
      params.delete("auth");
      const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  return null;
}
