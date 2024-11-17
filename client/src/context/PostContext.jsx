import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000"; 
export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`);
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // Add a new post
  const addPost = async (heading, content) => {
    try {
      const res = await axios.post(`${API_BASE}/posts`, { heading, content });
      setPosts([res.data, ...posts]);
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  // Like a post
  const likePost = async (postId, userId) => {
    try {
      const res = await axios.post(`${API_BASE}/posts/${postId}/like`, { userId });
      updatePostState(postId, res.data);  // Update the state with the new like count
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Dislike a post
  const dislikePost = async (postId, userId) => {
    try {
      const res = await axios.post(`${API_BASE}/posts/${postId}/dislike`, { userId });
      updatePostState(postId, res.data);  // Update the state with the new dislike count
    } catch (err) {
      console.error("Error disliking post:", err);
    }
  };

  // Add a comment to a post
  const addComment = async (postId, userId, comment) => {
    try {
      const res = await axios.post(`${API_BASE}/posts/${postId}/comments`, { userId, comment });
      updatePostState(postId, res.data);  // Update the post with the new comment
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Update the post state after like, dislike, or comment action
  const updatePostState = (id, updatedPost) => {
    setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
  };

  useEffect(() => {
    fetchPosts();  // Fetch posts when the component mounts
  }, []);

  return (
    <PostContext.Provider value={{ posts, addPost, likePost, dislikePost, addComment, loading }}>
      {children}
    </PostContext.Provider>
  );
};
