"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import PasswordReset from "@/app/components/PasswordReset";
import withAuth from "@/app/components/withAuth";

/**
 * Loja B2B: cadastro é mantido pelo administrador. E-mail, dados pessoais e
 * endereço ficam só em leitura em /meu-cadastro — aqui sobrou a troca de senha,
 * que é do próprio cliente. Qualquer outro slug volta para o cadastro.
 */
function EditProfile() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const permitido = slug === "reset-senha";

  useEffect(() => {
    if (!permitido) {
      router.replace("/meu-cadastro");
    }
  }, [permitido, router]);

  if (!permitido) {
    return null;
  }

  return <PasswordReset />;
}

export default withAuth(EditProfile);
