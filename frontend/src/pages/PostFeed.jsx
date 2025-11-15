import React, { useState, useEffect } from "react";

export default function PostFeed() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/posts", {
          credentials: "include",
        });
        const data = await res.json();
        setPosts(data);
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
      const res = await fetch("http://localhost:5001/api/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const newPost = await res.json();
      if (res.ok) {
        setPosts([newPost, ...posts]);
        setText("");
        setImage(null);
      } else {
        alert(newPost.message || "Failed to post");
      }
    } catch (err) {
      console.error("Error posting:", err);
    }
  };

  // Handle delete
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== postId));
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
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
      const res = await fetch(`http://localhost:5001/api/posts/${postId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const updatedPost = await res.json();
      if (res.ok) {
        setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
        setEditingPostId(null);
        setEditText("");
      } else {
        alert("Failed to update post");
      }
    } catch (err) {
      console.error("Error updating post:", err);
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
                    src={`http://localhost:5001${p.image}`}
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
