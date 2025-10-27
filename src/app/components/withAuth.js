// src/components/withAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/app/lib/supabaseClient";
import LoadingIndicator from "@/app/components/LoadingIndicator";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { state, dispatch } = useApp();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            throw new Error("Erro ao verificar sessão");
          }

          // Se não houver sessão no Supabase mas houver no contexto, faz logout
          if (!session && state.usuario) {
            dispatch({ type: "LOGOUT" });
            router.replace("/login");
            return;
          }

          // Se não houver usuário no contexto ou não houver sessão, redireciona
          if (!state.usuario || !state.usuario.codigo || !session) {
            router.replace("/login");
            return;
          }

          setIsLoading(false);
        } catch (err) {
          // console.error("Erro na autenticação:", err);
          router.replace("/login");
        }
      };

      checkAuth();
    }, [state.usuario, router, dispatch]);

    if (isLoading) {
      return <LoadingIndicator />;
    }

    return <WrappedComponent {...props} />;
  };
};

withAuth.displayName = "withAuth";

export default withAuth;
