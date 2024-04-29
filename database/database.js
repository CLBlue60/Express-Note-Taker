const fs = require("fs");
const util = require("util");
const uniqid = require("uniqid");

// Promisify file system methods
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Database class for managing notes
class Database {
  // Read note file
  async read() {
    try {
      const data = await readFile("db/db.json", "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }

  // Write note file
  async write(note) {
    try {
      await writeFile("db/db.json", JSON.stringify(note));
    } catch (error) {
      console.error("Error writing file:", error);
    }
  }

  // Get all notes from the file
  async getNotes() {
    try {
      const notes = await this.read();
      return notes;
    } catch (error) {
      console.error("Error getting notes:", error);
      return [];
    }
  }

  // Add a new note to the file
  async addNotes(note) {
    const { title, text } = note;
    if (!title || !text) {
      throw new Error("Please provide a title and text content for the note!");
    }

    const newNote = { title, text, id: uniqid() };
    try {
      const notes = await this.getNotes();
      notes.push(newNote);
      await this.write(notes);
      return newNote;
    } catch (error) {
      console.error("Error adding note:", error);
      return null;
    }
  }

  // Delete a note from the file by ID
  async deleteNotes(id) {
    try {
      let notes = await this.getNotes();
      notes = notes.filter((note) => note.id !== id);
      await this.write(notes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }
}

// Export an instance of the Database class
module.exports = new Database();
