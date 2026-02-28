"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Muzaki extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Muzaki.hasMany(models.Receipt, {
        foreignKey: "muzaki_id",
        as: "receipts",
      });
    }
  }
  Muzaki.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_mustahiq: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Muzaki",
      tableName: "Muzakis",
      freezeTableName: true,
    },
  );
  return Muzaki;
};
