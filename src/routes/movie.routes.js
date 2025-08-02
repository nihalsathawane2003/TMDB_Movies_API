const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");

router.post("/movie/:movieId", movieController.fetchAndSaveMovie);
router.post("/bulk-fetch", movieController.fetchBulkMovies);
router.get("/", movieController.getAllMovies);

module.exports = router;
