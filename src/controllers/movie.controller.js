const db = require("../models");
const tmdbService = require("../services/tmdb.service");
const Movie = db.Movie;
const Genre = db.Genre;
const Cast = db.Cast;

// Save one movie
const saveMovieToDB = async (movieData) => {
  const [movie] = await Movie.findOrCreate({
    where: { title: movieData.title },
    defaults: {
      overview: movieData.overview,
      release_date: movieData.release_date,
      poster_path: movieData.poster_path,
    },
  });

  for (const genre of movieData.genres || []) {
    const [g] = await Genre.findOrCreate({ where: { name: genre.name } });
    await movie.addGenre(g);
  }

  for (const castData of movieData.credits.cast.slice(0, 5)) {
    const [cast] = await Cast.findOrCreate({
      where: { name: castData.name },
      defaults: {
        character: castData.character,
        profile_path: castData.profile_path,
      },
    });
    await movie.addCast(cast);
  }

  return movie;
};

// Save by movie ID
exports.fetchAndSaveMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movieData = await tmdbService.fetchMovieDetails(movieId);
    const movie = await saveMovieToDB(movieData);
    res.status(201).json({ message: "Movie saved successfully", movie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk fetch 500 movies
exports.fetchBulkMovies = async (req, res) => {
  try {
    const pages = Array.from({ length: 25 }, (_, i) => i + 1);

    for (const page of pages) {
      const movies = await tmdbService.fetchPopularMovies(page);
      for (const movie of movies) {
        const detailed = await tmdbService.fetchMovieDetails(movie.id);
        await saveMovieToDB(detailed);
      }
    }

    res.status(200).json({ message: "Top 500 movies fetched and saved." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filtered & Paginated GET
exports.getAllMovies = async (req, res) => {
  try {
    const { genre, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const options = {
      include: [
        {
          model: Genre,
          ...(genre ? { where: { name: genre } } : {}),
        },
        Cast,
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    };

    const movies = await Movie.findAndCountAll(options);
    res.json({
      total: movies.count,
      page: parseInt(page),
      pages: Math.ceil(movies.count / limit),
      data: movies.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
