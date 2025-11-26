import React, { useState } from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";

export default function PostPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-[800px] mx-auto px-0 space-y-6 ">
      {/* <CreatePost onPostCreated={handlePostCreated} /> */}

      {/* PostList handles the scrolling */}
      <PostList key={refreshKey} />
    </div>
  );
}
