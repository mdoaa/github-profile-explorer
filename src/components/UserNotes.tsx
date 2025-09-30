"use client";
import { useEffect, useState } from "react";

interface Props {
  username: string;
}

export default function UserNotes({ username }: Props) {
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`notes_${username}`);
   // console.log(stored);
    if (stored) setNotes(JSON.parse(stored));
  }, [username]);

  const saveNotes = (updatedNotes: string[]) => {
    localStorage.setItem(`notes_${username}`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    saveNotes([...notes, newNote.trim()]);
    setNewNote("");
  };

  const handleDeleteNote = (index: number) => {
    saveNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-black-50">
      <h2 className="text-lg font-semibold mb-2 text-gray-200">Notes for {username}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
        />
        <button
          onClick={handleAddNote}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-200">No notes for this user.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 border rounded-md bg-black-50"
            >
              <span className="text-gray-200" >{note}</span>
              <button
                onClick={() => handleDeleteNote(index)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
