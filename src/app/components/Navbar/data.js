import { getMenus, getMarcas } from "@/app/lib/funcoes";

export async function getNavbarData() {
  try {
    const [menus, marcas] = await Promise.all([getMenus(), getMarcas()]);

    return { menus, marcas };
  } catch (error) {
    console.error("Erro ao carregar dados do Navbar:", error);
    return { menus: { menu: [] }, marcas: [] };
  }
}
