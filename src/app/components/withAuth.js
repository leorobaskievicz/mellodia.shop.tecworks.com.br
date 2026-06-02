import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import { decrypt } from "@/app/lib/encrypt";
import LoadingIndicator from "@/app/components/LoadingIndicator";

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const { state, dispatch } = useApp();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        // Usuário já está no contexto
        if (state.usuario && state.usuario.codigo) {
          setIsLoading(false);
          return;
        }

        // Tenta recuperar do cookie criptografado
        const cookieRaw = document.cookie
          .split("; ")
          .find((r) => r.startsWith("mellodia_user="))
          ?.split("=")[1];

        if (cookieRaw) {
          const userData = decrypt(decodeURIComponent(cookieRaw));
          if (userData && userData.codigo) {
            dispatch({
              type: "LOGIN",
              payload: {
                codigo: userData.codigo,
                nome: userData.nome,
                email: userData.email,
                status: true,
                avatar: "",
                token: null,
                vendedor: userData.vendedor,
              },
            });
            setIsLoading(false);
            return;
          }
        }

        // Sem sessão válida, redireciona para login
        router.replace("/login");
      };

      checkAuth();
    }, [state.usuario]);

    if (isLoading) {
      return <LoadingIndicator />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthComponent;
};

export default withAuth;