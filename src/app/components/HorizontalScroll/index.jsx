"use client";

import { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Colors } from "@/app/style.constants";
import { styleContainer, styleScrollButton } from "./style";

export default function HorizontalScroll({ children, sx, noPadding = false }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Criar ResizeObserver para monitorar mudanças no tamanho do container
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(container);

    // Verificar scroll inicial
    checkScroll();

    // Adicionar listener de scroll
    container.addEventListener("scroll", checkScroll);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ position: "relative", ...sx }}>
      {showLeftArrow && (
        <IconButton onClick={() => scroll(-1)} sx={styleScrollButton} className="scroll-button left" size="small">
          <ChevronLeft />
        </IconButton>
      )}
      <Box ref={scrollContainerRef} onScroll={checkScroll} sx={{ ...styleContainer, p: noPadding ? 0 : 1, scrollBehavior: "smooth", "&::-webkit-scrollbar": { display: "none" } }}>
        {children}
      </Box>
      {showRightArrow && (
        <IconButton onClick={() => scroll(1)} sx={styleScrollButton} className="scroll-button right" size="small">
          <ChevronRight />
        </IconButton>
      )}
    </Box>
  );
}
