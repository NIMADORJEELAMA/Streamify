import Quote from "../models/Quote.js";
import User from "../models/User.js";

export async function createQuote(req, res) {
  try {
    const { text } = req.body;
    const userId = req.user.id; // authenticated user

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Quote text is required" });
    }

    // check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newQuote = await Quote.create({
      text,
      author: userId,
    });

    res.status(201).json(newQuote);
  } catch (error) {
    console.log("Error in createQuote controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getQuotes(req, res) {
  try {
    const quotes = await Quote.find()
      .populate("author", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(quotes);
  } catch (error) {
    console.log("Error in getQuotes controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
