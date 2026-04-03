import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../api";

const normalizeCategory = (value = "") => value.toString().trim().toLowerCase();

const categoryMatches = (product, category) => {
  const target = normalizeCategory(category);
  const raw = normalizeCategory(product?.category);

  if (!raw) return false;
  if (raw === target) return true;

  if (target === "boys") {
    return ["1", "boy", "boys", "men", "male", "kid-boy", "kids-boy"].includes(raw);
  }

  if (target === "girls") {
    return ["2", "girl", "girls", "women", "female", "kid-girl", "kids-girl"].includes(raw);
  }

  return raw.includes(target);
};

const useProductsByCategory = (category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(buildApiUrl("/products"));
        const allProducts = Array.isArray(data?.products) ? data.products : [];
        const byCategory = allProducts.filter((item) => categoryMatches(item, category));

        if (mounted) {
          setProducts(byCategory);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || "Unable to load products right now.");
          setProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [category]);

  return useMemo(
    () => ({ products, loading, error }),
    [products, loading, error]
  );
};

export default useProductsByCategory;
