// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Initial render
  renderMovies();

  // Handle form submit to add new movie
  document
    .getElementById("add-movie-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const genre = document.getElementById("genre").value.trim();
      const year = document.getElementById("year").value.trim();

      if (!title || !genre || !year) {
        alert("Please fill all fields");
        return;
      }

      await addMovie({ title, genre, year, watched: false });
      e.target.reset();
      renderMovies();
    });

  // Handle search input
  document.getElementById("search").addEventListener("input", renderMovies);
});

// Fetch all movies from backend
async function getMovies() {
  const res = await fetch("http://localhost:3000/api/movies");
  return await res.json();
}

// Add movie to backend
async function addMovie(movie) {
  await fetch("http://localhost:3000/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
}

// Delete movie by ID
async function deleteMovie(id) {
  await fetch(`http://localhost:3000/api/movies/${id}`, {
    method: "DELETE",
  });
  renderMovies();
}

// Toggle watched status
async function toggleWatched(id, currentStatus) {
  await fetch(`http://localhost:3000/api/movies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ watched: !currentStatus }),
  });
  renderMovies();
}

// Render movies filtered by search term
async function renderMovies() {
  const movies = await getMovies();
  const searchTerm = document.getElementById("search").value.toLowerCase();

  const toWatchList = document.getElementById("to-watch-list");
  const watchedList = document.getElementById("watched-list");

  toWatchList.innerHTML = "";
  watchedList.innerHTML = "";

  // Filter and display movies
  movies
    .filter((movie) => movie.title.toLowerCase().includes(searchTerm))
    .forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = `${movie.title} (${movie.year}) - ${movie.genre}`;

      // Button to toggle watched status
      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = movie.watched ? "Unwatch" : "Watch";
      toggleBtn.addEventListener("click", () =>
        toggleWatched(movie.id, movie.watched)
      );

      // Button to delete movie
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteMovie(movie.id));

      li.appendChild(toggleBtn);
      li.appendChild(deleteBtn);

      if (movie.watched) {
        watchedList.appendChild(li);
      } else {
        toWatchList.appendChild(li);
      }
    });

  // Show messages if lists empty
  if (!toWatchList.hasChildNodes()) {
    toWatchList.innerHTML = "<li>No movies to watch</li>";
  }
  if (!watchedList.hasChildNodes()) {
    watchedList.innerHTML = "<li>No watched movies</li>";
  }
}
