import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import About from "./src/about";
import Project from "./src/project";
import Education from "./src/education";
import Services from "./src/services";
import Contact from "./src/contact";

export default function MainRouter() {
  // Keep the submitted form in memory while moving back to Home.
  const [message, setMessage] = useState(null);

  return (
    <>
      <Layout />
      <main id="main-content" className="container">
        <Routes>
          <Route path="/" element={<Home message={message} />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/education" element={<Education />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact onSubmit={setMessage} />} />
          <Route path="*" element={<p>Page not found. Please use the navigation above.</p>} />
        </Routes>
      </main>
      <footer>Mohamad Alkurdi · COMP229 React Portfolio</footer>
    </>
  );
}
