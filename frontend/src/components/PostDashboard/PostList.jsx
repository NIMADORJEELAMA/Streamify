import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  useEffect(() => {
    // ✅ Connect to backend Socket.IO server
    const socket = io("http://localhost:5001", { withCredentials: true });

    // 🔥 Listen for likes
    socket.on("postLiked", ({ postId, likes }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: new Array(likes) } : p
        )
      );
    });

    // 💬 Listen for comments
    socket.on("postCommented", ({ postId, comments }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments } : p))
      );
    });

    return () => socket.disconnect();
  }, []);

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

  // ✅ Like a post
  const handleLike = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/posts/${postId}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId ? { ...p, likes: new Array(data.likes) } : p
          )
        );
      }
    } catch (err) {
      console.error("Error liking post:", err);
      console.log("err", err);
    }
  };

  // ✅ Add comment
  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/posts/${postId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: commentText }),
        }
      );
      const updatedComments = await res.json();

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId ? { ...p, comments: updatedComments } : p
          )
        );
        setCommentText("");
        setActiveCommentPostId(null);
      }
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-2xl shadow-md p-5 transition-all hover:shadow-lg border border-gray-100"
        >
          {/* Author section */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={
                p.author?.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              }
              alt="User"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {p.author?.fullName || "Unknown User"}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
            {p.text}
          </p>

          {p.image && (
            <img
              src={`http://localhost:5001${p.image}`}
              alt="Post"
              className="w-full max-h-[450px] rounded-lg object-cover border mt-3"
            />
          )}

          {/* ❤️ Like & 💬 Comment Buttons */}
          <div className="flex items-center gap-6 mt-4 text-gray-600">
            <button
              onClick={() => handleLike(p._id)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              ❤️ {p.likes?.length || 0} Likes
            </button>
            <button
              onClick={() =>
                setActiveCommentPostId(
                  activeCommentPostId === p._id ? null : p._id
                )
              }
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              💬 {p.comments?.length || 0} Comments
            </button>
          </div>

          {/* Comments Section */}
          {activeCommentPostId === p._id && (
            <div className="mt-4 border-t pt-3">
              <div className="space-y-2 mb-3">
                {p.comments?.map((c) => (
                  <div key={c._id} className="flex items-start gap-2">
                    <img
                      src={
                        c.user?.profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                      }
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <p className="text-sm font-medium">{c.user?.fullName}</p>
                      <p className="text-sm text-gray-700">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleComment(p._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
