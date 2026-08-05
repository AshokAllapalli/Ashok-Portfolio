import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashCursor from "./components/SplashCursor";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";

import AutoGarageCRM from "./pages/projects/AutoGarageCRM";
import BounceCure from "./pages/projects/BounceCure";
import SchoolERP from "./pages/projects/SchoolERP";

function App() {
  return (
    <Router>
      <SplashCursor />

      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />

        {/* Project case studies */}
        <Route path="/projects/auto-garage-crm" element={<AutoGarageCRM />} />
        <Route path="/projects/bounce-cure" element={<BounceCure />} />
        <Route path="/projects/school-erp" element={<SchoolERP />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;