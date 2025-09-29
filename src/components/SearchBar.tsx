"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [userName, setuserName] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      router.push(`/user/${userName.trim()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center mt-50 gap-2 w-full max-w-2xl mx-auto"
    >
      <input
        type="text"
        value={userName}
        onChange={(e) => setuserName(e.target.value)}
        placeholder="Search GitHub profiles..."
        className="flex-grow px-4 py-2 boarder rounded-lg"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
