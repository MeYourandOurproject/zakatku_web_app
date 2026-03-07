"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Receipt.belongsTo(models.Zakatinstitution, {
        foreignKey: "institution_id",
        as: "institution",
      });

      Receipt.belongsTo(models.Muzaki, {
        foreignKey: "muzaki_id",
        as: "muzaki",
      });

      Receipt.hasMany(models.Receiptdetail, {
        foreignKey: "receipt_id",
        as: "details",
      });
    }
  }
  Receipt.init(
    {
      muzaki_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      institution_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receipt_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      number_of_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Receipt",
      tableName: "Receipts",
      freezeTableName: true,

      indexes: [
        {
          unique: true,
          fields: ["institution_id", "receipt_number"],
        },
      ],
    },
  );
  return Receipt;
};
