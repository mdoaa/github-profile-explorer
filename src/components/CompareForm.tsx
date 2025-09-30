'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props{
    initU1: string;
    initU2: string;
}

export default function CompareForm({ initU1 = "", initU2 = "" }: Props) {
    const [user1, setUser1] = useState(initU1);
    const [user2, setUser2] = useState(initU2);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user1.trim() || !user2.trim()) return;
        
        router.push(`/compare?u1=${encodeURIComponent(user1.trim())}&u2=${encodeURIComponent(user2.trim())}`);
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
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        value={user1}
        onChange={(e) => setUser1(e.target.value)}
        placeholder="First username (e.g. octocat)"
        className="px-3 py-2 border rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-gray-400">vs</span>
      <input
        value={user2}
        onChange={(e) => setUser2(e.target.value)}
        placeholder="Second username"
        className="px-3 py-2 border rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Compare
      </button>
      </form>
      </>
  );
}