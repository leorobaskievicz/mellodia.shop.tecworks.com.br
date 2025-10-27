import { useEffect } from "react";

export default function Comentarios({ produto }) {
  useEffect(() => {
    if (typeof window !== "undefined" && produto?.CODIGO) {
      window.CUSDIS_LOCALE = {
        powered_by: ".",
        post_comment: "Enviar comentário",
        loading: "Carregando...",
        email: "Email (opcional)",
        nickname: "Nome",
        reply_placeholder: "Responder...",
        reply_btn: "Responder",
        sending: "Enviando...",
        mod_badge: "MOD",
        content_is_required: "Conteúdo é obrigatório",
        nickname_is_required: "Nome é obrigatório",
        comment_has_been_sent: "Seu comentário foi enviado. Aguardando aprovação.",
      };

      // Cria o script com ID correto
      const commentsUrl = process.env.NEXT_PUBLIC_COMMENTS_URL;
      if (commentsUrl) {
        const script = document.createElement("script");
        script.src = `${commentsUrl}/js/cusdis.es.js`;
        script.async = true;
        script.defer = true;
        script.id = "cusdis-script"; // <- importante para o cleanup
        document.body.appendChild(script);
      }
    }

    return () => {
      // Remove iframe
      const commentsUrl = process.env.NEXT_PUBLIC_COMMENTS_URL;
      if (commentsUrl) {
        const iframe = document.querySelector(`iframe[src*="${commentsUrl}"]`);
        if (iframe?.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }

      // Remove script
      const oldScript = document.getElementById("cusdis-script");
      if (oldScript?.parentNode) {
        oldScript.parentNode.removeChild(oldScript);
      }
    };
  }, [produto?.CODIGO]); // <- roda novamente quando o produto mudar

  return (
    <div
      id="cusdis_thread"
      data-host={process.env.NEXT_PUBLIC_COMMENTS_URL || ""}
      data-app-id={process.env.NEXT_PUBLIC_COMMENTS_APP_ID || ""}
      data-page-id={produto?.CODIGO}
      data-page-url={typeof window !== "undefined" ? window.location.href : ""}
      data-page-title={`${produto?.NOME} - ${process.env.NEXT_PUBLIC_STORE_NAME || 'Loja'}`}
      data-theme="auto"
    />
  );
}
