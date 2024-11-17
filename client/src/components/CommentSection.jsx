import React, { useContext, useState } from "react";
import { PostContext } from "../context/PostContext";

const CommentSection = ({ postId }) => {
  const { addComment } = useContext(PostContext);
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addComment(postId, comment);
    setComment("");
  };

  return (
    <div className="mt-4">
      <textarea
        className="w-full p-2 bg-secondary text-textPrimary rounded"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        className="bg-accent text-textPrimary px-4 py-2 rounded mt-2"
        onClick={handleAddComment}
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentSection;
