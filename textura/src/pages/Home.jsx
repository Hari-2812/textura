import React from "react";
import HeroBanner from "../components/HeroBanner";
import ProductSlider from "../components/ProductSlider";
import CategorySection from "../components/CategorySection";
import BlogSection from "../components/BlogSection";
import Newsletter from "../components/Newsletter";
import FeaturedProducts from "../components/FeaturedProducts";

const Home = () => {
  return (
    <>
      <HeroBanner />
      <section id="new-arrivals">
        <ProductSlider title="New Arrivals" />
      </section>
      <FeaturedProducts />
      <section id="categories">
        <CategorySection />
      </section>
      <section id="blog-section">
        <BlogSection />
      </section>
      <Newsletter />
    </>
  );
};

export default Home;
