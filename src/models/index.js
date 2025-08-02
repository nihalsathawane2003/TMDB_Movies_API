require("dotenv").config(); 
const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Movie = require("./movie.model")(sequelize, DataTypes);
db.Genre = require("./genre.model")(sequelize, DataTypes);
db.Cast = require("./cast.model")(sequelize, DataTypes);

// Associations
db.Movie.belongsToMany(db.Genre, { through: "movie_genres" });
db.Genre.belongsToMany(db.Movie, { through: "movie_genres" });

db.Movie.belongsToMany(db.Cast, { through: "movie_casts" });
db.Cast.belongsToMany(db.Movie, { through: "movie_casts" });

module.exports = db;
