import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/ProductsList.css";


const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const nav = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert("Deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Preview</th>
            <th>Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ width: 120 }}>
                {(p.images && p.images[0]) ? (
                  <img src={ (typeof p.images[0] === "string") ? p.images[0] : p.images[0].url } alt={p.name} style={{ width: 80, height: 80, objectFit: "cover" }} />
                ) : <div style={{ width: 80, height: 80, background: "#f0f0f0" }} />}
              </td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.discountPercent ? `${p.discountPercent}%` : "-"}</td>
              <td>{p.stock}</td>
              <td>{p.category}</td>
              <td>
                <button onClick={() => nav(`/admin/edit-product/${p._id}`)}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
