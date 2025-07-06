const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve frontend files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname)));

// Fake in-memory movie list
let movies = [];

app.get("/api/movies", (req, res) => res.json(movies));

app.post("/api/movies", (req, res) => {
  const movie = { id: Date.now(), ...req.body };
  movies.push(movie);
  res.status(201).json(movie);
});

app.patch("/api/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  movies = movies.map((m) => (m.id === id ? { ...m, ...req.body } : m));
  res.json({ message: "updated" });
});

app.delete("/api/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  movies = movies.filter((m) => m.id !== id);
  res.json({ message: "deleted" });
});

// Start server
app.listen(PORT, () =>
  console.log(`✅ Server running: http://localhost:${PORT}`)
);
