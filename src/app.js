require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models");
const movieRoutes = require("./routes/movie.routes");

app.use(express.json());
app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 3000;
const authRoutes = require("./routes/auth");

app.use("/api", authRoutes);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
