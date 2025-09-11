import express from "express";
import { createQuote, getQuotes } from "../controllers/quote.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST a new quote
router.post("/", protectRoute, createQuote);

// GET all quotes
router.get("/", protectRoute, getQuotes);

export default router;
