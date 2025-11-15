import React, { useState } from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";

export default function PostPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger refresh in PostList when new post is added
  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <CreatePost onPostCreated={handlePostCreated} />
      <PostList key={refreshKey} />
    </div>
  );
}
