import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const DetailModal = ({ subdata, open, onClose, title, fields }) => {
  console.log(subdata);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        {/* Hiển thị các trường thông tin cơ bản */}
        <div className="space-y-5">
          {fields.map(({ label, value }, index) => (
            <div key={index} className="flex justify-between">
              <strong>{label}</strong> <span>{value}</span>
            </div>
          ))}
        </div>

        {/* Hiển thị danh sách sản phẩm nếu tồn tại */}
        {subdata?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Sản phẩm đã đặt:</h3>
            <div className="space-y-4">
              {subdata.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-300 rounded-md shadow-sm"
                >
                  <div className="flex justify-between">
                    <strong>SKU:</strong>
                    <span>{item.skuId}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Tên:</strong>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Số lượng:</strong>
                    <span>{item.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Giá:</strong>
                    <span>{item.price} VND</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
