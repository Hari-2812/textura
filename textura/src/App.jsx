import React from "react";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import ProductSlider from "./components/ProductSlider";
import BlogSection from "./components/BlogSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import "./index.css";

const App = () => {
  return (
    <>
      <Header />
      <HeroBanner />
      <ProductSlider title="New Arrivals" />
      {/* <ProductSlider title="Back in Stock" /> */}
      <BlogSection />
      <Newsletter />
      <Footer />
    </>
  );
};

export default App;
