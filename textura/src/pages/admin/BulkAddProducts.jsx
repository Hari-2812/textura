import React, { useState } from "react";
import axios from "axios";
import "../../styles/BulkAddProducts.css";

const AGE_SIZES = [
  "2-3Y",
  "3-4Y",
  "4-5Y",
  "5-6Y",
  "6-7Y",
  "7-8Y",
  "9-10Y",
  "11-12Y",
  "13-14Y",
  "14-15Y",
];

const emptyRow = () => ({
  name: "",
  price: "",
  discountPrice: "",
  category: "",
  sizes: [], // now an array of { label, stock }
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
    copy[i].images = Array.from(files).slice(0, 5); // limit to 5 per product
    setRows(copy);
  };

  // Sizes helpers
  const addSizeToRow = (rowIndex) => {
    const copy = [...rows];
    // default to first age size and empty stock
    copy[rowIndex].sizes.push({ label: AGE_SIZES[0], stock: "" });
    setRows(copy);
  };

  const updateSizeLabel = (rowIndex, sizeIndex, newLabel) => {
    const copy = [...rows];
    copy[rowIndex].sizes[sizeIndex].label = newLabel;
    setRows(copy);
  };

  const updateSizeStock = (rowIndex, sizeIndex, newStock) => {
    const copy = [...rows];
    // allow only non-negative integers or empty
    copy[rowIndex].sizes[sizeIndex].stock = newStock.replace(/\D/g, "");
    setRows(copy);
  };

  const removeSizeFromRow = (rowIndex, sizeIndex) => {
    const copy = [...rows];
    copy[rowIndex].sizes = copy[rowIndex].sizes.filter(
      (_, idx) => idx !== sizeIndex
    );
    setRows(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build product payloads
      const productsPayload = rows.map((r) => ({
        name: r.name,
        price: Number(r.price) || 0,
        discountPrice: r.discountPrice ? Number(r.discountPrice) : null,
        category: r.category,
        sizes: r.sizes.map((s) => ({
          label: s.label,
          stock: Number(s.stock) || 0,
        })),
        description: r.description,
        isFeatured: Boolean(r.isFeatured),
        productCode: r.productCode,
      }));

      const formData = new FormData();
      formData.append("products", JSON.stringify(productsPayload));

      // Attach images as images_0, images_1, ...
      rows.forEach((r, idx) => {
        r.images.forEach((file) => {
          formData.append(`images_${idx}`, file);
        });
      });

      const res = await axios.post(
        "https://textura-z80b.onrender.com/api/products/bulk",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message || "Uploaded successfully");
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
      <h2 className="bulk-heading">Bulk Add Products</h2>

      <form onSubmit={handleSubmit}>
        <table className="bulk-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Category</th>
              <th>Sizes (age → stock)</th>
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
                    className="text-input"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    min="0"
                    required
                    value={row.price}
                    onChange={(e) => handleChange(i, "price", e.target.value)}
                    className="text-input"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    min="0"
                    value={row.discountPrice}
                    onChange={(e) =>
                      handleChange(i, "discountPrice", e.target.value)
                    }
                    className="text-input"
                  />
                </td>

                <td>
                  <input
                    value={row.category}
                    onChange={(e) =>
                      handleChange(i, "category", e.target.value)
                    }
                    className="text-input"
                  />
                </td>

                {/* Sizes cell */}
                <td>
                  <div className="sizes-cell">
                    {row.sizes.length === 0 && (
                      <div className="no-sizes-note">No sizes added</div>
                    )}

                    {row.sizes.map((s, si) => (
                      <div className="size-row" key={si}>
                        <select
                          value={s.label}
                          onChange={(e) =>
                            updateSizeLabel(i, si, e.target.value)
                          }
                          className="size-select"
                        >
                          {AGE_SIZES.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="stock"
                          value={s.stock}
                          onChange={(e) =>
                            updateSizeStock(i, si, e.target.value)
                          }
                          className="stock-input"
                        />

                        <button
                          type="button"
                          className="small-icon-btn delete-size"
                          onClick={() => removeSizeFromRow(i, si)}
                          title="Remove size"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="add-size-btn"
                      onClick={() => addSizeToRow(i)}
                    >
                      + Add Size
                    </button>
                  </div>
                </td>

                <td>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(i, e.target.files)}
                  />
                  {row.images.length > 0 && (
                    <small className="selected-count">
                      {row.images.length} selected
                    </small>
                  )}
                </td>

                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={row.isFeatured}
                    onChange={(e) =>
                      handleChange(i, "isFeatured", e.target.checked)
                    }
                    title="Feature product on homepage"
                  />
                </td>

                <td>
                  <input
                    value={row.productCode}
                    onChange={(e) =>
                      handleChange(i, "productCode", e.target.value)
                    }
                    className="text-input"
                    placeholder="SKU"
                  />
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                    className="small-icon-btn remove-row"
                    title="Remove product row"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bulk-actions">
          <button type="button" onClick={addRow} className="primary-btn">
            + Add Row
          </button>

          <button
            type="submit"
            disabled={loading}
            className="primary-btn upload-btn"
            style={{ marginLeft: 12 }}
          >
            {loading ? "Uploading..." : "Upload All"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkAddProducts;
