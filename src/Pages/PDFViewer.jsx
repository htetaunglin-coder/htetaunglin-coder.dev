import React from "react";
import Resume from "../assets/Htet_Aung Lin_Resume.pdf";
import Transition from "../components/animation/Transition";

const PDFViewer = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        title="resume"
        src={Resume}
        width="100%"
        height="100%"
        style={{ border: "none" }} // Add this to remove iframe border
      />
    </div>
  );
};

export default Transition(PDFViewer);
