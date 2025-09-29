"use client";

import SearchBar from "@/components/SearchBar";
import CompareForm from "@/components/CompareForm";

export default function Home() {
  return (
    <>
      <SearchBar />
      <div className="flex items-center justify-center mt-12 gap-2 w-full max-w-2xl mx-auto">
        <button
          onClick={() => {
            window.location.href = "/compare";
          }}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Compare GitHub Users
        </button>
      </div>

      <div className="mt-10 text-center text-gray-500">
        <p>
          Enter a GitHub username above to view profile details and
          repositories.
        </p>
        <p className="mt-2">
          Or click "Compare GitHub Users" to compare two users side by side.
        </p>
      </div>
    </>
  );
}
