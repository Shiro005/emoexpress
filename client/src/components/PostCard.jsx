import React, { useContext } from "react";
import { PostContext } from "../context/PostContext";

const PostCard = ({ post }) => {
  const { toggleLike, deletePost } = useContext(PostContext);

  return (
    <div className="bg-secondary text-textPrimary rounded-lg p-4 mb-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center">
        <img
          src={post.profile_pic_url}
          alt={post.random_name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="font-bold">{post.random_name}</p>
          <p className="text-textSecondary text-sm">{new Date(post.created_at).toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-4">{post.content}</p>
      <div className="flex items-center justify-between mt-4">
        <button
          className="text-accent"
          onClick={() => toggleLike(post.id, true)}
        >
          ❤️ {post.likes}
        </button>
        <button
          className="text-accent"
          onClick={() => toggleLike(post.id, false)}
        >
          💔 {post.dislikes}
        </button>
        <button className="text-accent">💬 {post.comments}</button>
        <button
          className="text-accent"
          onClick={() => deletePost(post.id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default PostCard;
