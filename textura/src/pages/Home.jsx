import React from "react";
import HeroBanner from "../components/HeroBanner";
import ProductSlider from "../components/ProductSlider";
import CategorySection from "../components/CategorySection"; 
import BlogSection from "../components/BlogSection";
import Newsletter from "../components/Newsletter";
import "../index.css";

const App = () => {
  return (
    <>
      {/* <Header /> */}
      <HeroBanner />
      <ProductSlider title="New Arrivals" />
      {/* <ProductSlider title="Back in Stock" /> */}
      <CategorySection />
      <BlogSection />
      <Newsletter />
      {/* <Footer /> */}
    </>
  );
};

export default App;
