import React, { useState } from "react";
import axios from "axios";
import "../../styles/BulkAddProducts.css";

const emptyRow = () => ({
  name: "",
  price: "",
  discountPrice: "",
  category: "",
  sizes: "",
  stock: "",
  description: "",
  isFeatured: false,
  productCode: "",
  images: [],
});

const BulkAddProducts = () => {
  const [rows, setRows] = useState([emptyRow()]);
  const [loading, setLoading] = useState(false);

  const addRow = () => setRows([...rows, emptyRow()]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const handleChange = (i, key, value) => {
    const copy = [...rows];
    copy[i][key] = value;
    setRows(copy);
  };

  const handleFiles = (i, files) => {
    const copy = [...rows];
    copy[i].images = Array.from(files).slice(0, 5);
    setRows(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create product payloads WITHOUT images
      const productsPayload = rows.map((r) => ({
        name: r.name,
        price: r.price,
        discountPrice: r.discountPrice || null,
        category: r.category,
        sizes: r.sizes,
        stock: r.stock,
        description: r.description,
        isFeatured: r.isFeatured,
        productCode: r.productCode,
      }));

      const formData = new FormData();
      formData.append("products", JSON.stringify(productsPayload));

      // Attach images as images_0, images_1, images_2...
      rows.forEach((r, idx) => {
        r.images.forEach((file) => {
          formData.append(`images_${idx}`, file);
        });
      });

      const res = await axios.post(
        "http://localhost:5000/api/products/bulk",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
      setRows([emptyRow()]);
    } catch (err) {
      console.error("❌ Bulk Upload Error:", err);
      alert("Bulk add failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-container">
      <h2>Bulk Add Products</h2>

      <form onSubmit={handleSubmit}>
        <table className="bulk-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Category</th>
              <th>Sizes</th>
              <th>Stock</th>
              <th>Images</th>
              <th>Featured</th>
              <th>SKU</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    value={row.name}
                    required
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    required
                    value={row.price}
                    onChange={(e) => handleChange(i, "price", e.target.value)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={row.discountPrice}
                    onChange={(e) =>
                      handleChange(i, "discountPrice", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    value={row.category}
                    onChange={(e) => handleChange(i, "category", e.target.value)}
                  />
                </td>

                <td>
                  <input
                    value={row.sizes}
                    placeholder="S,M,L"
                    onChange={(e) => handleChange(i, "sizes", e.target.value)}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={row.stock}
                    onChange={(e) => handleChange(i, "stock", e.target.value)}
                  />
                </td>

                <td>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(i, e.target.files)}
                  />
                  {row.images.length > 0 && (
                    <small>{row.images.length} selected</small>
                  )}
                </td>

                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={row.isFeatured}
                    onChange={(e) =>
                      handleChange(i, "isFeatured", e.target.checked)
                    }
                  />
                </td>

                <td>
                  <input
                    value={row.productCode}
                    onChange={(e) =>
                      handleChange(i, "productCode", e.target.value)
                    }
                  />
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={addRow}>
            + Add Row
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{ marginLeft: 10 }}
          >
            {loading ? "Uploading..." : "Upload All"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkAddProducts;
