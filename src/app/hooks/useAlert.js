"use client";

import { useState, useCallback } from "react";

export default function useAlert() {
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const showAlert = useCallback((type, title, message) => {
    setAlert({
      open: true,
      type,
      title,
      message,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
}
