import React, { useState } from "react";
import { createPost } from "../../lib/api";

export default function CreatePost({ onPostCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      const newPost = await createPost(formData);

      onPostCreated(newPost);
      setIsOpen(false);
      setText("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Error posting:", err);
      alert("Failed to post");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <div
        className="border rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition text-gray-600"
        onClick={() => setIsOpen(true)}
      >
        What’s on your mind?
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">
              Create Post
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="What’s on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-lg max-h-60 object-cover"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
