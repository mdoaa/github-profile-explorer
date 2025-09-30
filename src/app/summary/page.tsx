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
    <div className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleSubmit}
        disabled={!username || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {summary && <p className="mt-4">{summary}</p>}
    </div>
  );
}
