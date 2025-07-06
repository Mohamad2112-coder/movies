document.addEventListener("DOMContentLoaded", () => {
  const movieForm = document.getElementById("movieForm");
  const toWatchList = document.getElementById("toWatchList");
  const watchedList = document.getElementById("watchedList");
  const searchInput = document.getElementById("search");

  movieForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;

    const newMovie = {
      id: Date.now(),
      title,
      genre,
      year,
      watched: false,
    };

    addMovie(newMovie);
    movieForm.reset();
    renderMovies();
  });

  searchInput.addEventListener("input", renderMovies);

  function addMovie(movie) {
    const movies = getMovies();
    movies.push(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
  }

  function getMovies() {
    return JSON.parse(localStorage.getItem("movies")) || [];
  }

  function deleteMovie(id) {
    let movies = getMovies().filter((m) => m.id !== id);
    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovies();
  }

  function toggleWatched(id) {
    const movies = getMovies().map((movie) => {
      if (movie.id === id) {
        movie.watched = !movie.watched;
      }
      return movie;
    });
    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovies();
  }

  function renderMovies() {
    const query = searchInput.value.toLowerCase();
    const movies = getMovies();
    toWatchList.innerHTML = "";
    watchedList.innerHTML = "";

    movies
      .filter((movie) => movie.title.toLowerCase().includes(query))
      .forEach((movie) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <span>${movie.title} (${movie.year}) - ${movie.genre}</span>
        <button onclick="toggleWatched(${movie.id})">${
          movie.watched ? "Unwatch" : "Watch"
        }</button>
        <button onclick="deleteMovie(${movie.id})">Delete</button>
      `;
        if (movie.watched) {
          watchedList.appendChild(li);
        } else {
          toWatchList.appendChild(li);
        }
      });
  }

  // expose to global for inline onclicks
  window.toggleWatched = toggleWatched;
  window.deleteMovie = deleteMovie;

  renderMovies();
});
