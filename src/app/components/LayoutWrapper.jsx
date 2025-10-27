"use client";

import { Container } from "@mui/material";
import { usePathname } from "next/navigation";
import { useState, useEffect, lazy, Suspense, memo } from "react";
import { getNavbarData } from "@/app/components/Navbar/data";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Header from "@/app/components/Header";
import TopNavbar from "@/app/components/TopNavbar";
import TopHeaderTelevendas from "@/app/components/TopHeaderTelevendas";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import dynamic from "next/dynamic";
const PopupRoleta = dynamic(() => import("@/app/components/PopupRoleta"), { ssr: false });

// Lazy loading dos componentes
// export const LazyHeader = lazy(() => import("./Header"));
export const LazyFooter = lazy(() => import("./Footer"));
export const LazyMiniFooter = lazy(() => import("./MiniFooter"));
export const LazyNavbar = lazy(() => import("./Navbar"));
// export const LazyTopNavbar = lazy(() => import("./TopNavbar"));
export const LazyTopHeader = lazy(() => import("./TopHeader"));
export const LazyMiniHeader = lazy(() => import("./MiniHeader"));

// Componente de Suspense otimizado
export const LazyComponent = memo(({ children }) => <Suspense fallback={<LoadingIndicator />}>{children}</Suspense>);

LazyComponent.displayName = "LazyComponent";

// Hook otimizado para dados do Navbar
function useNavbarData() {
  const [data, setData] = useState({ menus: { menu: [] }, marcas: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const loadData = async () => {
      try {
        const result = await getNavbarData();
        if (mounted) {
          setData(result);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do Navbar:", error);
        if (mounted) {
          setError(error);
          setData({ menus: { menu: [] }, marcas: [] });
          setLoading(false);
        }
      }
    };

    // Debounce para evitar múltiplas chamadas
    timeoutId = setTimeout(loadData, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return { data, loading, error };
}

// Componentes de layout específicos
const LoginLayout = memo(({ children }) => (
  <Container
    maxWidth={false}
    sx={{
      width: "100vw",
      height: "100vh",
      p: 0,
      m: 0,
      bgcolor: "background.default",
    }}
    disableGutters
  >
    {children}
    <LazyComponent>
      <LazyMiniFooter />
    </LazyComponent>
  </Container>
));

LoginLayout.displayName = "LoginLayout";

const MiniLayout = memo(({ children }) => (
  <Container
    maxWidth={false}
    sx={{
      width: "100vw",
      height: "100vh",
      p: 0,
      m: 0,
      bgcolor: "background.default",
    }}
    disableGutters
  >
    <PopupRoleta />
    <LazyComponent>
      <LazyMiniHeader />
    </LazyComponent>
    {children}
    <LazyComponent>
      <LazyMiniFooter />
    </LazyComponent>
  </Container>
));

MiniLayout.displayName = "MiniLayout";

// Componente principal otimizado
export default function LayoutWrapper({ children }) {
  const { data, loading, error } = useNavbarData();
  const pathname = usePathname();

  // Verificações de rota otimizadas
  const isLoginPage = ["/login", "/recuperar-senha", "/atualiza-senha", "/cadastro"].includes(pathname);
  const isMiniPage = pathname.includes("/checkout") || pathname.includes("/checkout/pagamento") || pathname === "/auth/callback";

  if (isLoginPage) {
    return <LoginLayout>{children}</LoginLayout>;
  }

  if (isMiniPage) {
    return <MiniLayout>{children}</MiniLayout>;
  }

  // Renderização condicional otimizada
  const shouldRenderNavbar = !loading && data?.menus;

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100vw",
        minHeight: "100vh",
        height: "auto",
        p: 0,
        m: 0,
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
      }}
      disableGutters
    >
      <TopHeaderTelevendas />
      <LazyComponent>
        <LazyTopHeader />
      </LazyComponent>
      <TopNavbar />
      <Header menus={data?.menus || []} marcas={data?.marcas || []} />
      {shouldRenderNavbar && (
        <LazyComponent>
          <LazyNavbar menus={data.menus} marcas={data.marcas} />
        </LazyComponent>
      )}
      {children}
      <LazyComponent>
        <LazyFooter />
      </LazyComponent>
    </Container>
  );
}
