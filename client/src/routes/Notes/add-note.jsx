import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './AddNote.css'

function AddNote() {
  const baseUrl = `${import.meta.env.VITE_SERVER_URL}/api/notes`;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const addNote = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
      } else {
        console.log("Failed to submit data.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (

<div className="add-note-wrapper">
  <form className="add-note-form" onSubmit={addNote}>
    <h2 className="form-title">Add a New Note</h2>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Title"
      className="note-title"
    />
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Description"
      rows="5"
      className="note-description"
    ></textarea>
    <input
      type="submit"
      value={submitted ? "Saving note..." : "💾 Save Note"}
      disabled={submitted}
      className="save-btn"
    />
    {submitted && (
      <div className="success-message">Note has been added!</div>
    )}
  </form>
</div>
  );
}

export default AddNote;
