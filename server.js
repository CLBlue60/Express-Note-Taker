const path = require("path");
const express = require("express");
const Database = require("./database/database.js");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Database.getNotes();
    res.json(notes);
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ error: "Failed to get notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const newNote = req.body;
    const addedNote = await Database.addNotes(newNote);
    res.json(addedNote);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Failed to add note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    await Database.deleteNotes(noteId);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
