const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

let notes = [

  ];

// GET all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// POST new note
app.post("/notes", (req, res) => {
  const newNote = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), 
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// PUT update a note
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex(note => note.id === parseInt(id));
  if (index !== -1) {
    notes[index] = { 
      ...notes[index], 
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(notes[index]);
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

// DELETE a note
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  notes = notes.filter(note => note.id !== parseInt(id));
  res.json({ message: "Note deleted" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
