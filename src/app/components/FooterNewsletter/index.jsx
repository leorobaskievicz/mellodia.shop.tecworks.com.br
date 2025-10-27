"use client";

import { useState } from "react";
import { Button, TextField } from "@mui/material";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";
import AlertModal from "@/app/components/AlertModal";
import useAlert from "@/app/hooks/useAlert";

export default function Footer({ children }) {
  const api = new Api();
  const [isLoading, setIsLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!event.target.email.value || !event.target.nome.value) {
      showAlert("error", "Formulário incompleto", `Necessário preencher todos os campos para continuar.`);
      return;
    }

    if (!Diversos.validateEmail(event.target.email.value)) {
      showAlert("error", "E-mail Inválido", "Por favor, digite um E-mail válido para continuar");
      return;
    }

    const param = {
      email: event.target.email.value,
      nome: event.target.nome.value,
      recebeEmail: true,
    };

    setIsLoading(true);

    try {
      const data = await api.post("/customer/newsletter", param, true);

      if (!data.status) {
        throw new Error(data.msg);
      }

      showAlert("success", "Sucesso!", "Seu e-mail foi cadastrado com sucesso!");
    } catch (e) {
      console.error(e);
      if (e.message === "E-mail já cadastrado para receber newsletter") {
        showAlert("success", "Sucesso", `${e.message}`);
      } else {
        showAlert("error", "Atenção", `${e.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField label="Nome" name="nome" fullWidth margin="normal" required size="small" disabled={isLoading} />
        <TextField label="Email" name="email" type="email" fullWidth margin="normal" required size="small" sx={{ mt: 0 }} disabled={isLoading} />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 0 }} disabled={isLoading}>
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>

      <AlertModal open={alert.open} onClose={hideAlert} type={alert.type} title={alert.title} message={alert.message} />
    </>
  );
}
