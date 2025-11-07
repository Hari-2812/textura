import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BoysPage from "./pages/BoysPage";

const App = () => {
  return (
    <Router>
      {/* Common Header */}
      <Header />

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />        {/* ✅ Homepage */}
        <Route path="/boys" element={<BoysPage />} /> {/* ✅ Boys Page */}
      </Routes>

      {/* Common Footer */}
      <Footer />
    </Router>
  );
};

export default App;
