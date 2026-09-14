"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import LoadingIndicator from "@/app/components/LoadingIndicator";

/**
 * Loja B2B: tudo que está em (privado) — o checkout inteiro — exige cliente
 * logado. O AppProvider só renderiza os filhos depois de ler o localStorage e o
 * cookie, então quando este layout monta o usuário já está no estado; se não
 * estiver, é porque não há sessão.
 */
export default function PrivadoLayout({ children }) {
  const { state } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const logado = Boolean(state && state.usuario && state.usuario.codigo);

  useEffect(() => {
    if (!logado) {
      const destino = pathname || "/checkout";
      router.replace(`/login?redirect=${encodeURIComponent(destino)}`);
    }
  }, [logado, pathname, router]);

  if (!logado) {
    return <LoadingIndicator />;
  }

  return children;
}
