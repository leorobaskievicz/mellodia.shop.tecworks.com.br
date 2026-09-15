"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import PasswordReset from "@/app/components/PasswordReset";
import ShippingEdit from "@/app/components/ShippingEdit";
import withAuth from "@/app/components/withAuth";

/**
 * O cliente mantém o próprio endereço de entrega e a senha. Razão social, CNPJ
 * e Inscrição Estadual são dados fiscais: ficam em leitura no /meu-cadastro e
 * mudam pelo administrador — qualquer outro slug volta para lá.
 */
function EditProfile() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const permitido = slug === "reset-senha" || slug === "endereco";

  useEffect(() => {
    if (!permitido) {
      router.replace("/meu-cadastro");
    }
  }, [permitido, router]);

  if (!permitido) {
    return null;
  }

  return slug === "endereco" ? <ShippingEdit /> : <PasswordReset />;
}

export default withAuth(EditProfile);
