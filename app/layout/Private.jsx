import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
const Private = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Private;
