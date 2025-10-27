"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

export default function FreteEEnvio() {
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const googlePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL;
    const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;

    if (/android/i.test(userAgent) && googlePlayUrl) {
      window.location.href = googlePlayUrl;
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream && appStoreUrl) {
      window.location.href = appStoreUrl;
    } else {
      console.log("Sistema operacional desconhecido ou URLs de apps não configuradas");
    }
  }, []);

  return (
    <>
      <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "50px 0" }}>
        {process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL && (
          <div style={{ flex: 1, textAlign: "right", marginRight: 10 }}>
            <Link href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL} target="_blank" title="Baixa versão para Android" rel="noreferrer">
              <Image src={"/diva-disponivel-na-play-store.png"} style={{ width: 200, height: "auto" }} width={200} height={50} alt={`Baixe o app ${process.env.NEXT_PUBLIC_STORE_NAME ? `da ${process.env.NEXT_PUBLIC_STORE_NAME}` : ''} na Play Store para Android`} />
            </Link>
          </div>
        )}
        {process.env.NEXT_PUBLIC_APP_STORE_URL && (
          <div style={{ flex: 1, textAlign: "left", marginLeft: 10 }}>
            <Link href={process.env.NEXT_PUBLIC_APP_STORE_URL} target="_blank" title="Baixa versão para iPhone" rel="noreferrer">
              <Image src={"/diva-disponivel-na-app-store.png"} width={200} height={50} style={{ width: 200, height: "auto" }} alt={`Baixe o app ${process.env.NEXT_PUBLIC_STORE_NAME ? `da ${process.env.NEXT_PUBLIC_STORE_NAME}` : ''} na App Store para iOS`} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
