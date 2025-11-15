import Post from "../models/post.model.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text && !image)
      return res.status(400).json({ message: "Post cannot be empty" });

    const post = await Post.create({
      text,
      image,
      author: req.user._id,
    });

    res.status(200).json(await post.populate("author", "fullName profilePic"));
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author can update
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update text or image if provided
    if (text) post.text = text;
    if (req.file) post.image = `/uploads/${req.file.filename}`;

    await post.save();
    res.status(200).json(await post.populate("author", "fullName profilePic"));
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Toggle like/unlike
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) post.likes.pull(userId);
    else post.likes.push(userId);

    await post.save();

    // ✅ Emit socket event
    const io = req.app.get("io");
    io.emit("postLiked", { postId: post._id, likes: post.likes.length });

    res.status(200).json({ likes: post.likes.length, isLiked: !isLiked });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user._id, text });
    await post.save();
    const populated = await post.populate(
      "comments.user",
      "fullName profilePic"
    );

    // ✅ Emit socket event
    const io = req.app.get("io");
    io.emit("postCommented", {
      postId: post._id,
      comments: populated.comments,
    });

    res.status(200).json(populated.comments);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
