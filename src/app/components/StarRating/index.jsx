"use client";

import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const StarRating = ({ value, onChange, size = "small" }) => {
  return (
    <Rating
      name="rating"
      value={value}
      precision={0.5} // Permite valores fracionários como 4.5
      onChange={(event, newValue) => onChange(newValue)}
      icon={<StarIcon fontSize={size} />}
      emptyIcon={<StarIcon fontSize={size} sx={{ opacity: 0.3 }} />}
    />
  );
};

export default StarRating;
