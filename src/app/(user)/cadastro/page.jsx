import { redirect } from "next/navigation";

/**
 * Loja B2B: não existe autocadastro — o acesso é criado pelo administrador.
 * A rota continua existindo só para não quebrar link antigo; manda para o login.
 * O formulário original ficou em page.jsx.desativado.
 */
export default function Cadastro() {
  redirect("/login");
}
