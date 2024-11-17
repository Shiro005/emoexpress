import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PostProvider } from "./context/PostContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import DetailPost from "./pages/DetailPost"; // Import the DetailPost page
import Footer from "./components/Footer";

function App() {
  return (
    <PostProvider>
      <Router>
        <div className="min-h-screen bg-primary text-textPrimary">
          <Navbar />
          <div className="pt-16">
            <Routes>
              {/* Home Route */}
              <Route path="/" element={<Home />} />
              
              {/* Create Post Route */}
              <Route path="/create" element={<CreatePost />} />
              
              {/* DetailPost Route to view single post */}
              <Route path="/posts/:id" element={<DetailPost />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </PostProvider>
  );
}

export default App;
