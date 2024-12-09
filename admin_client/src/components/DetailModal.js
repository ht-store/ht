import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const DetailModal = ({ open, onClose, title, fields }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="space-y-5">
          {fields.map(({ label, value }, index) => (
            <div key={index} className="flex justify-between">
              <strong>{label}:</strong> <span>{value}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
