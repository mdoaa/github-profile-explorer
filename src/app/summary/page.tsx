"use client";

import { useState } from "react";

export default function GitHubSummary() {
  const [username, setUsername] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setSummary(data.summary || data.error);
    } catch (err) {
      setSummary("Error fetching summary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="flex items-center justify-center mt-12 gap-2 w-full max-w-2xl mx-auto">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
           ← Back Home
        </button>
      </div>
    

    <div className="flex items-center justify-center mt-50 gap-2 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-grow px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSubmit}
          disabled={!username || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </div>
       {summary && (
      <p className="mt-4 w-full px-4 py-2 text-center">{summary}</p>
    )}
      </div>
      </>
  );
}
