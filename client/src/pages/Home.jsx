import React, { useState, useContext } from "react";
import { PostContext } from "../context/PostContext";
import { format } from "date-fns";
import { FaSearch, FaHeart, FaThumbsDown, FaComment, FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { posts, likePost, dislikePost, loading } = useContext(PostContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center text-gray-400">Loading posts...</div>;
  }

  const filteredPosts = (posts || []).filter((post) => {
    const heading = post.heading || "";
    const content = post.content || "";
    return (
      heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-6 flex items-center bg-gray-800 p-2 rounded-lg shadow-md mt-4">
        <FaSearch className="text-gray-500 ml-2" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent p-2 text-white placeholder-gray-500 focus:outline-none ml-2"
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md text-white"
          >
            <div className="flex items-center">
              <img
                src={post.profile_pic_url}
                alt={post.random_name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-bold">{post.random_name} <span className="text-blue-400">ID : {post.id}</span></p>
                <p className="text-textSecondary text-sm">
                  {new Date(post.created_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                  }).replace(", ", " ")}
                </p>
              </div>
            </div>

            {/* Post Heading */}
            <h3 className="text-lg font-bold text-red-500 mb-2">{post.heading}</h3>
            {/* Post Content */}
            <p className="mb-2">{post.content.slice(0, 100)}...</p>
            {/* Post Timestamp */}
            <div className="text-sm text-gray-400 mt-2">
              {format(new Date(post.created_at), "d MMM, h:mm a")}
            </div>
            {/* Action Buttons */}
            <div className="mt-4 flex items-center space-x-6">
              <button
                className="flex items-center space-x-1 text-red-100 hover:text-red-500"
                onClick={() => likePost(post.id)}
              >
                <FaHeart />
                <span>{post.likes}</span>
              </button>
              <button
                className="flex items-center space-x-1 text-green-500 hover:text-green-500"
                onClick={() => dislikePost(post.id)}
              >
                <FaThumbsDown />
                <span>{post.dislikes}</span>
              </button>
              <button
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-400"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <FaComment />

              </button>
              <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400">
                <FaShareAlt />
              </button>
            </div>
            {/* View Full Post */}
            <button
              className="mt-4 text-blue-100 rounded shadow-md"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              View Full Post
            </button>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400">No posts found</div>
      )}
    </div>
  );
};

export default Home;
