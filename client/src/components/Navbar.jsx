import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaArrowLeft } from "react-icons/fa"; // Added back button icon

const Navbar = () => {
  // Get the current date in the format "4 Aug"
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <nav className="fixed top-0 w-full bg-black text-white shadow-xl z-50">
      <div className="w-full mx-auto flex justify-between items-center p-4">

        {/* Back Button */}
        <div className="flex items-center space-x-4">
          <Link
            to="/" // Link to the feed page or home page
            className="flex items-center justify-center bg-white/20 hover:bg-white/15 text-white rounded-full p-3 shadow-md transform hover:scale-110 transition-all"
            aria-label="Go Back"
          >
            <FaArrowLeft size={20} />
          </Link>

          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-gray-200 transition-all text-shadow-xl animate__animated animate__pulse animate__infinite flex flex-col"
          >
            <span className="text-blue-400"> Emo </span> Express
          </Link>

          <div className="text-md font-semibold text-white bg-white/20 px-4 py-2 rounded-lg">
            {currentDate}
          </div>
        </div>

        {/* Add Post Button */}
        <div className="flex items-center space-x-4">
          <Link
            to="/create"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-400 text-white rounded-full p-3 shadow-md transform hover:scale-110 transition-all"
            aria-label="Add Post"
          >
            <FaPlus size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
