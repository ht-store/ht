import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../utils/constant";
import { Product, ProductDetail } from "../types";

// Add Product form component
const ProductView: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    brandId: 1,
    categoryId: 1,
    screenSize: "",
    battery: "",
    camera: "",
    processor: "",
    os: "",
    releaseDate: "",
    image: "",
    originalPrice: "",
    details: [{ name: "", slug: "", attributes: [], price: "", stock: 0 }],
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle input changes in the form
  const handleInputChange = (field: keyof Product, value: string | number) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleDetailInputChange = (
    index: number,
    field: keyof ProductDetail,
    value: string | number | { attributeId: number; value: string }[]
  ) => {
    const updatedDetails = [...newProduct.details];
    if (field === "attributes") {
      updatedDetails[index].attributes = value as {
        attributeId: number;
        value: string;
      }[];
    } else {
      updatedDetails[index][field] = value;
    }
    setNewProduct({ ...newProduct, details: updatedDetails });
  };

  // Add a new product detail (e.g., for different SKUs)
  const handleAddDetail = () => {
    const newDetail: ProductDetail = {
      name: "",
      slug: "",
      attributes: [{ attributeId: 1, value: "" }],
      price: "",
      stock: 0,
    };
    setNewProduct({
      ...newProduct,
      details: [...newProduct.details, newDetail],
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: newProduct.name,
        brandId: newProduct.brandId,
        categoryId: newProduct.categoryId,
        screenSize: newProduct.screenSize,
        battery: newProduct.battery,
        camera: newProduct.camera,
        processor: newProduct.processor,
        os: newProduct.os,
        releaseDate: newProduct.releaseDate,
        image: newProduct.image,
        originalPrice: newProduct.originalPrice,
        details: newProduct.details,
      };
      // Send request to API (add product)
      await axios.post(`${API_URL}/products`, payload);
      handleClose();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Product
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <TextField
            label="Brand ID"
            fullWidth
            margin="normal"
            value={newProduct.brandId}
            onChange={(e) => handleInputChange("brandId", e.target.value)}
          />
          <TextField
            label="Category ID"
            fullWidth
            margin="normal"
            value={newProduct.categoryId}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
          />
          {/* Add other fields like screen size, battery, etc. in the same way */}

          {newProduct.details.map((detail, index) => (
            <div key={index}>
              <TextField
                label="Detail Name"
                fullWidth
                margin="normal"
                value={detail.name}
                onChange={(e) =>
                  handleDetailInputChange(index, "name", e.target.value)
                }
              />
              <TextField
                label="Slug"
                fullWidth
                margin="normal"
                value={detail.slug}
                onChange={(e) =>
                  handleDetailInputChange(index, "slug", e.target.value)
                }
              />
              {/* Add attributes handling here */}
              <TextField
                label="Price"
                fullWidth
                margin="normal"
                value={detail.price}
                onChange={(e) =>
                  handleDetailInputChange(index, "price", e.target.value)
                }
              />
              <TextField
                label="Stock"
                fullWidth
                margin="normal"
                value={detail.stock}
                onChange={(e) =>
                  handleDetailInputChange(index, "stock", e.target.value)
                }
              />
            </div>
          ))}
          <Button variant="outlined" color="primary" onClick={handleAddDetail}>
            Add Product Detail
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductView;
