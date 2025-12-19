import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  Link2,
  Facebook,
  Twitter,
  MessageSquare,
  Globe,
} from "lucide-react";
import useAuthUser from "../../hooks/useAuthUser";
import CreatePost from "./CreatePost";
import { getPosts, likePost, commentOnPost } from "../../lib/api";
import { axiosInstance } from "../../lib/axios";
export default function PostList() {
  const { authUser } = useAuthUser();
  const userId = authUser._id;
  const socket = io(import.meta.env.VITE_API_BASE_URL, {
    withCredentials: true,
  });

  const [posts, setPosts] = useState([]);
  console.log("posts", posts);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [shareMenuPostId, setShareMenuPostId] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShareMenuPostId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleShareClick = (e, postId) => {
    e.stopPropagation();
    setShareMenuPostId((prev) => (prev === postId ? null : postId));
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const openPopup = (url) => {
    window.open(url, "_blank", "width=600,height=500");
  };

  useEffect(() => {
    socket.on("postLiked", ({ postId, likes }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: Array.isArray(likes) ? likes : [] }
            : p
        )
      );
    });

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
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [refreshKey]);

  const handleLike = async (postId) => {
    try {
      const data = await likePost(postId);

      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            if (
              typeof data.likes === "number" &&
              typeof data.isLiked === "boolean"
            ) {
              return {
                ...p,
                likesCount: data.likes,
                isLikedByUser: data.isLiked,
                likes: data.isLiked
                  ? [...(Array.isArray(p.likes) ? p.likes : []), userId].filter(
                      (v, i, a) => a.indexOf(v) === i
                    )
                  : Array.isArray(p.likes)
                  ? p.likes.filter((id) => id !== userId)
                  : [],
              };
            }
            return { ...p, likes: Array.isArray(data) ? data : [] };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const updatedComments = await commentOnPost(postId, commentText);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: updatedComments } : p
        )
      );

      setCommentText("");
      setActiveCommentPostId(null);
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  return (
    <div className="overflow-y-scroll hide-scrollbar space-y-4 px-2 pb-6">
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.map((p) => {
        // Check if liked using either the new format or old format
        const isLiked =
          p.isLikedByUser ??
          (Array.isArray(p.likes) && p.likes?.includes(userId));
        const likesCount =
          p.likesCount ?? (Array.isArray(p.likes) ? p.likes?.length : 0);

        return (
          <div
            key={p._id}
            className=" rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      p.author?.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                    }
                    className="w-12 h-12 rounded-full object-contain ring-2 ring-offset-1 ring-blue-100"
                    alt="Profile"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-[15px] hover:underline cursor-pointer">
                    {p.author?.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    <span className="text-[10px]">•</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
                {p.text}
              </p>
            </div>

            {/* Image */}
            {p.image && (
              <div className="mt-2">
                <img
                  src={`${axiosInstance}/${p.image}`}
                  className="w-full max-h-[500px] object-contain"
                  alt="Post content"
                />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                {likesCount > 0 && (
                  <>
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-sm border-2 border-white">
                        <Heart className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                    <span className="text-gray-600 hover:underline cursor-pointer font-medium">
                      {likesCount}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <button
                  onClick={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === p._id ? null : p._id
                    )
                  }
                >
                  {p.comments?.length > 0 && (
                    <span className="hover:underline cursor-pointer text-sm">
                      {p.comments.length}{" "}
                      {p.comments.length === 1 ? "comment" : "comments"}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Action Buttons */}
            <div className="flex items-center justify-around px-2 py-1.5">
              <button
                className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg font-medium text-[15px] transition-all ${
                  isLiked ? "text-red-600" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => handleLike(p._id)}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isLiked ? "fill-red-600 scale-110" : ""
                  }`}
                />
                <span>{isLiked ? "Liked" : "Like"}</span>
              </button>

              <button
                onClick={() =>
                  setActiveCommentPostId(
                    activeCommentPostId === p._id ? null : p._id
                  )
                }
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg font-medium text-[15px] text-gray-600 hover:bg-gray-50 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>

              <div className="flex-1 relative">
                {/* Share Menu */}
                {shareMenuPostId === p._id && (
                  <div
                    className="absolute bottom-full right-0 mb-2 bg-white shadow-2xl border border-gray-100 rounded-xl w-60 py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        copyLink(`http://localhost:3000/post/${p._id}`)
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-[15px] font-medium">Copy link</span>
                    </button>

                    <button
                      onClick={() =>
                        openPopup(
                          `https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/post/${p._id}`
                        )
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-[15px] font-medium">
                        Share to Facebook
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        openPopup(
                          `https://api.whatsapp.com/send?text=${encodeURIComponent(
                            p.text
                          )}%20http://localhost:3000/post/${p._id}`
                        )
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-[15px] font-medium">
                        Share to WhatsApp
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        openPopup(
                          `https://twitter.com/intent/tweet?url=http://localhost:3000/post/${
                            p._id
                          }&text=${encodeURIComponent(p.text)}`
                        )
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center">
                        <Twitter className="w-5 h-5 text-sky-600" />
                      </div>
                      <span className="text-[15px] font-medium">
                        Share to Twitter
                      </span>
                    </button>
                  </div>
                )}
                <button
                  onClick={(e) => handleShareClick(e, p._id)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-[15px] text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {activeCommentPostId === p._id && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {p.comments?.map((c) => (
                    <div key={c._id} className="flex gap-2.5">
                      <img
                        src={
                          c.user?.profilePic ||
                          "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                        }
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100"
                        alt="Commenter"
                      />
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl px-4 py-2.5 inline-block shadow-sm border border-gray-100">
                          <p className="text-[13px] font-semibold text-gray-900">
                            {c.user?.fullName}
                          </p>
                          <p className="text-[15px] text-gray-800 leading-snug mt-0.5">
                            {c.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 px-3 mt-1.5">
                          <button className="text-xs font-semibold text-gray-600 hover:underline">
                            Like
                          </button>
                          <button className="text-xs font-semibold text-gray-600 hover:underline">
                            Reply
                          </button>
                          <span className="text-xs text-gray-500">
                            Just now
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2.5 p-4 pt-3 bg-white border-t border-gray-100">
                  <img
                    src={
                      authUser?.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                    }
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100"
                    alt="Your profile"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && commentText.trim()) {
                          handleComment(p._id);
                        }
                      }}
                      className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <button
                      onClick={() => handleComment(p._id)}
                      disabled={!commentText.trim()}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full p-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
