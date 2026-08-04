import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashCursor from "./components/SplashCursor";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";

function App() {
  return (
    <Router>
      <SplashCursor />

      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;