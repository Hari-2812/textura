import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    sizes: "",
    stock: "",
    description: "",
  });

  const [images, setImages] = useState([]);

  // Handle Input Text Fields
  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("sizes", productData.sizes); // comma separated S,M,L
    formData.append("stock", productData.stock);
    formData.append("description", productData.description);

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await axios.post(
        "https://textura-z80b.onrender.com/api/products",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Product Added Successfully!");
      console.log(res.data);

    } catch (err) {
      console.log(err);
      alert("Error adding product");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="text"
          name="category"
          placeholder="Category (ex: Boys)"
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="text"
          name="sizes"
          placeholder="Sizes (Ex: S,M,L)"
          onChange={handleChange}
        /><br /><br />

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          onChange={handleChange}
        /><br /><br />

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="file"
          multiple
          onChange={handleImageChange}
          accept="image/*"
          required
        /><br /><br />

        <button type="submit">Add Product</button>

      </form>
    </div>
  );
};

export default AddProduct;
