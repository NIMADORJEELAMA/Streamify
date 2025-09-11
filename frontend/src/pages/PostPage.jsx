import React, { useState, useEffect } from "react";

export default function QuotePoster() {
  const [text, setText] = useState("");
  const [quotes, setQuotes] = useState([]);

  // Fetch all quotes on mount
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch("/api/quotes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ if using JWT cookie auth
        });
        const data = await res.json();
        setQuotes(data);
      } catch (err) {
        console.error("Error fetching quotes:", err);
      }
    };

    fetchQuotes();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      const newQuote = await res.json();

      if (res.ok) {
        setQuotes([newQuote, ...quotes]); // add new quote to top
        setText(""); // reset textarea
      } else {
        alert(newQuote.message || "Failed to post quote");
      }
    } catch (err) {
      console.error("Error posting quote:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Form */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Write your quote..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Post Quote
          </button>
        </form>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {quotes.map((q) => (
          <div
            key={q._id}
            className="bg-gray-100 p-4 rounded-xl shadow flex flex-col"
          >
            <p className="text-lg italic">“{q.text}”</p>
            {q.author && (
              <p className="text-right mt-2 text-sm text-gray-600">
                — {q.author.fullName || "Unknown"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
