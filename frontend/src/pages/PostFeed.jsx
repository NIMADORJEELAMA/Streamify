import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
// adjust path if needed

export default function PostFeed() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");

  const IMAGE_BASE_URL = "https://streamifynew.onrender.com/api";

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  // Handle post submit (Create)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      const res = await axiosInstance.post("/posts", formData);
      setPosts([res.data, ...posts]);
      setText("");
      setImage(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post");
    }
  };

  // Handle delete
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  // Handle edit
  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditText(post.text);
  };

  // Handle update (PUT)
  const handleUpdate = async (postId) => {
    const formData = new FormData();
    formData.append("text", editText);

    try {
      const res = await axiosInstance.put(`/posts/${postId}`, formData);
      setPosts(posts.map((p) => (p._id === postId ? res.data : p)));
      setEditingPostId(null);
      setEditText("");
    } catch (err) {
      alert("Failed to update post");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Create Post */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
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

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p._id} className="bg-gray-100 p-4 rounded-xl shadow">
            {editingPostId === p._id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(p._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg">{p.text}</p>
                {p.image && (
                  <img
                    src={`${axiosInstance}${p.image}`}
                    alt="Post"
                    className="mt-2 rounded-lg max-h-80 object-cover"
                  />
                )}
                {p.author && (
                  <p className="text-right mt-2 text-sm text-gray-600">
                    — {p.author.fullName}
                  </p>
                )}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
