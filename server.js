// Modules
const path = require("path");
const express = require("express");
const addNotes = require("./database/database.js");
const readNotes = require("./database/database.js");
const deleteNotes = require("./database/database.js");

// Server
const PORT = process.env.PORT || 3001;
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "./public")));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to serve the homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

// Route to serve the notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// Route to read notes from the database
app.get("/api/notes", readNotes);

// Route to add a new note to the database
app.post("/api/notes", addNotes);

// Route to delete a note from the database
app.delete("/api/notes/:id", deleteNotes);

// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
