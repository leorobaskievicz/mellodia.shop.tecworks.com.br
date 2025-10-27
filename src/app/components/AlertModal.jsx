"use client";

import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Box } from "@mui/material";
import { CheckCircle, Error, Close } from "@mui/icons-material";

export default function AlertModal({ open, onClose, type = "success", title, message }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle color="success" sx={{ fontSize: 40 }} />;
      case "error":
        return <Error color="error" sx={{ fontSize: 40 }} />;
      default:
        return null;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "success":
        return "success.main";
      case "error":
        return "error.main";
      default:
        return "text.primary";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getIcon()}
            <Typography variant="h6" color={getTitleColor()}>
              {title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 2, pt: 1 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
