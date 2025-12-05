import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/EditProduct.css";


const EditProduct = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [newFiles, setNewFiles] = useState([]); // files to upload
  const [removePublicIds, setRemovePublicIds] = useState([]); // public_ids or urls to remove
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`https://textura-z80b.onrender.com/api/products/${id}`);
        const p = res.data.product;
        // Normalize images to array of {url, public_id}
        p.images = (p.images || []).map(img => (typeof img === "string" ? { url: img, public_id: "" } : img));
        setProduct(p);
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      }
    };
    load();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const toggleRemoveImage = (img) => {
    const key = img.public_id || img.url;
    setRemovePublicIds(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files).slice(0,5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      // fields
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("discountPrice", product.discountPrice || "");
      formData.append("category", product.category);
      formData.append("sizes", (product.sizes || []).join(","));
      formData.append("stock", product.stock);
      formData.append("description", product.description);
      formData.append("isFeatured", product.isFeatured ? "true" : "false");
      formData.append("productCode", product.productCode || "");
      // remove images array
      formData.append("removeImages", JSON.stringify(removePublicIds));
      // new files all as "images" (backend accepts any and maps)
      newFiles.forEach(f => formData.append("images", f));

      const res = await axios.put(`https://textura-z80b.onrender.com/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Updated");
      nav("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Name</label>
            <input value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} required />

            <label>Price</label>
            <input type="number" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} required />

            <label>Discount Price (optional)</label>
            <input type="number" value={product.discountPrice || ""} onChange={(e) => setProduct({...product, discountPrice: e.target.value})} />

            <label>Category</label>
            <input value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} required />

            <label>Sizes (comma separated)</label>
            <input value={(product.sizes || []).join(",")} onChange={(e) => setProduct({...product, sizes: e.target.value.split(",")})} />

            <label>Stock</label>
            <input type="number" value={product.stock} onChange={(e) => setProduct({...product, stock: e.target.value})} />

            <label>SKU</label>
            <input value={product.productCode || ""} onChange={(e) => setProduct({...product, productCode: e.target.value})} />

            <label>Description</label>
            <textarea value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} />

            <label>
              Featured
              <input type="checkbox" checked={product.isFeatured} onChange={(e) => setProduct({...product, isFeatured: e.target.checked})} />
            </label>
          </div>

          <div style={{ width: 320 }}>
            <label>Existing Images (click to toggle remove)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.images.map((img, idx) => {
                const key = img.public_id || img.url;
                const marked = removePublicIds.includes(key);
                return (
                  <div key={idx} style={{ position: "relative" }}>
                    <img src={img.url} alt="" style={{ width: 120, height: 120, objectFit: "cover", opacity: marked ? 0.4 : 1 }} />
                    <div style={{ textAlign: "center" }}>
                      <button type="button" onClick={() => toggleRemoveImage(img)}>
                        {marked ? "Undo" : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <label style={{ display: "block", marginTop: 12 }}>Add New Images (max 5)</label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <div>
              {newFiles.length > 0 && <small>{newFiles.length} files selected</small>}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
