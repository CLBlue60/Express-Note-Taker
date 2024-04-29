const fs = require("fs");
const util = require("util");
const uniqid = require("uniqid");

// Promisify file system methods
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Database class for managing notes
class Database {
  // Read note file
  read() {
    return readFile("db/db.json", "utf8");
  }

  // Write note file
  write(note) {
    return writeFile("db/db.json", JSON.stringify(note));
  }

  // Get all notes from the file
  getNotes() {
    return this.read().then((notes) => {
      let parsedNotes = [];

      try {
        parsedNotes = JSON.parse(notes); // Parse the notes JSON data
      } catch (err) {
        parsedNotes = []; // Handle parsing errors
      }
      return parsedNotes; // Return the parsed notes array
    });
  }

  // Add a new note to the file
  addNotes(note) {
    const { title, text } = note;

    // Ensure the note has a title and text
    if (!title || !text) {
      throw new Error("Please provide a title and text content for the note!"); // Throw an error if title or text is missing
    }

    const noteWithId = { title, text, id: uniqid() }; // Generate unique ID for the note

    return this.getNotes()
      .then((notes) => {
        const updatedNotes = [...notes, noteWithId]; // Add the new note to the existing ones
        return this.write(updatedNotes); // Write the updated notes to the file
      })
      .then(() => noteWithId); // Return the new note with ID
  }

  // Delete a note from the file by ID
  deleteNotes(id) {
    return this.getNotes().then((notes) =>
      this.write(notes.filter((note) => note.id !== id))
    ); // Filter out the note with the provided ID and write the remaining notes to the file
  }
}

// Export an instance of the Database class
module.exports = new Database();
