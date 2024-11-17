import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { FaHeart, FaThumbsDown } from "react-icons/fa";

const DetailPost = () => {
  const { id } = useParams(); // Extract post ID from the URL
  const { posts, likePost, dislikePost, addComment } = useContext(PostContext); // Now we have addComment as well
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState(""); // Assuming username is stored in context or state

  useEffect(() => {
    const currentPost = posts.find((p) => p.id === parseInt(id));
    if (currentPost) {
      setPost(currentPost);
    }
  }, [id, posts]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const commentData = {
        username: userName, // Include the username with the comment
        content: newComment
      };

      try {
        // Call addComment function from PostContext
        await addComment(post.id, commentData.username, commentData.content);
        setNewComment(""); // Clear the input field after posting the comment
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  if (!post) {
    return <div className="text-center text-gray-400">Loading post...</div>;
  }

  return (
    <div className="p-4">
      {/* Post Content */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
        <h3 className="text-lg font-bold text-red-500 mb-2">{post.heading}</h3>
        <p>{post.content}</p>
        <div className="text-sm text-gray-400 mt-2">
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
        {/* Action Buttons */}
        <div className="mt-4 flex space-x-4">
          <button
            className="text-white hover:text-red-500"
            onClick={() => likePost(post.id, userName)} // Pass userName if available
          >
            <FaHeart />{post.likes}
          </button>
          <button
            className="text-white hover:text-green-500"
            onClick={() => dislikePost(post.id, userName)} // Pass userName if available
          >
            <FaThumbsDown />{post.dislikes}
          </button>
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md text-white">
        <h4 className="text-lg font-bold mb-4">Add a Comment</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none"
        />
        <button
          onClick={handleAddComment}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Post Comment
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md text-white">
        <h4 className="text-lg font-bold mb-4">Comments</h4>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment, index) => (
            <div key={index} className="bg-gray-800 p-2 rounded-lg mb-2 shadow-md">
              <p><strong>{comment.username}:</strong> {comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default DetailPost;
