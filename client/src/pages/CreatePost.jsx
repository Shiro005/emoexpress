import React, { useState, useContext } from "react";
import { PostContext } from "../context/PostContext";

const CreatePost = () => {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const { addPost } = useContext(PostContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (heading.trim() === "" || content.trim() === "") {
      return alert("Heading and content cannot be empty!");
    }
    addPost(heading, content);
    setHeading("");
    setContent("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post heading..."
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full p-2 rounded mb-2 bg-gray-800 text-white placeholder-gray-500"
        />
        <textarea
          className="w-full p-2 rounded border bg-gray-800 text-white"
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-blue-500 px-4 py-2 text-white rounded"
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
