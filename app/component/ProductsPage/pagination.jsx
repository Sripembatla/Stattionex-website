import { Icon } from "@iconify/react";
import React, { useState } from "react";

const Pagination = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-center space-x-2  mt-4  ">
        <div className="w-fit rounded-2xl border   bg-white  py-3 shadow-md flex ">
      {/* Previous Button */}
      
      <button
        className={`px-3 py-1 flex  rounded-md text-gray-500 hover:bg-gray-200 ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <Icon icon="carbon:chevron-left" width={20} height={20} className="mr-2 text-center mt-1"  />
        Previous
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded-full ${
            currentPage === i + 1
              ? "bg-yellow-400 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => handlePageClick(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-3 py-1 flex rounded-md text-gray-500 hover:bg-gray-200 ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
        <Icon icon="carbon:chevron-right" width={20} height={20} className="ml-2 text-center mt-1" />
      </button>
      </div>
    </div>
  );
};

export default Pagination;
