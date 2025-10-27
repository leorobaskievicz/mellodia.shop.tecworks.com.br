import { useState } from "react";
import Image from "next/image";
import { Box } from "@mui/material";

const ZoomableImage = ({ src, alt }) => {
  const [zoomActive, setZoomActive] = useState(false);

  const handleMouseMove = (e) => {
    if (!zoomActive) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.backgroundPosition = `${x}% ${y}%`;
  };

  const handleMouseEnter = (e) => {
    setZoomActive(true);
    e.currentTarget.style.backgroundSize = "200%";
  };

  const handleMouseLeave = (e) => {
    setZoomActive(false);
    e.currentTarget.style.backgroundSize = "contain";
    e.currentTarget.style.backgroundPosition = "center";
  };

  return (
    <Box
      component="div"
      sx={{
        width: 600,
        height: 600,
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        backgroundImage: `url(${src})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-size 0.3s ease",
        cursor: "zoom-in",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100%"
        style={{
          objectFit: "contain",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default ZoomableImage;
