module.exports = (sequelize, DataTypes) => {
  const Cast = sequelize.define("Cast", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    character: {
      type: DataTypes.STRING,
    },
    profile_path: {
      type: DataTypes.STRING,
    },
  });

  return Cast;
};
