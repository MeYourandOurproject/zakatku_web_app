"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Zakatinstitution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Zakatinstitution.hasMany(models.User, {
        foreignKey: "institution_id",
        as: "users",
      });
      Zakatinstitution.hasMany(models.Muzaki, {
        foreignKey: "institution_id",
        as: "muzakis",
      });
      Zakatinstitution.hasMany(models.Receipt, {
        foreignKey: "institution_id",
        as: "receipts",
      });
    }
  }
  Zakatinstitution.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      type: {
        type: DataTypes.ENUM("mosque", "laz", "school", "organization"),
        allowNull: false,
        defaultValue: "mosque",
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Zakatinstitution",
      tableName: "Zakatinstitutions",
      freezeTableName: true,
    },
  );
  return Zakatinstitution;
};
