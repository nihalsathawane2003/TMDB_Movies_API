module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define("Movie", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overview: DataTypes.TEXT,
    release_date: DataTypes.DATE,
    poster_path: DataTypes.STRING,
  });

  return Movie;
};
