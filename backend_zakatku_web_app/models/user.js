"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Zakatinstitution, {
        foreignKey: "institution_id",
        as: "institution",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      role: {
        type: DataTypes.ENUM("superadmin", "admin"),
        allowNull: false,
        validate: { notEmpty: true },
      },
      institution_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      freezeTableName: true,
    },
  );
  return User;
};
