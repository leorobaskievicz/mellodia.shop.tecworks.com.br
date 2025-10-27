"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

export default function LinkComunidade() {
  return (
    <>
      <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "50px 0" }}>
        <div style={{ flex: 1, textAlign: "center", marginRight: 0 }}>
          <Link href="https://chat.whatsapp.com/BIuXHd0XRXrGBd8IF6H45M" target="_blank" title="Baixa versão para Android" rel="noreferrer">
            <Image src={"https://cdn.divacosmeticos.com.br/banner-449-50-2025-07-10T17:42:37-03:00.webp"} style={{ width: 1200, height: "auto" }} width={1200} height={100} alt="Entre na comunidade da Diva Cosméticos no WhatsApp" />
          </Link>
        </div>
      </div>
    </>
  );
}
