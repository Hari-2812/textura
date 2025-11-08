import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BoysPage from "./pages/BoysPage";

const App = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Router>
      <Header onFilterToggle={() => setShowFilters((prev) => !prev)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/boys"
          element={
            <BoysPage
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
