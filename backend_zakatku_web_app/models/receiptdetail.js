"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Receiptdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Receiptdetail.belongsTo(models.Receipt, {
        foreignKey: "receipt_id",
        as: "recepit",
      });
    }
  }
  Receiptdetail.init(
    {
      receipt_id: { type: DataTypes.INTEGER, allowNull: false },
      category: {
        type: DataTypes.ENUM("ZAKAT_FITRAH", "OTHER"),
        allowNull: false,
      },
      sub_category: {
        type: DataTypes.ENUM(
          "RICE",
          "CASH",
          "BARANG",
          "MAL",
          "INFAQ/SHADAQAH",
          "FIDYAH",
        ),
        allowNull: false,
      },
      unit: { type: DataTypes.STRING, allowNull: true },
      quantity: { type: DataTypes.DECIMAL, allowNull: true },
    },
    {
      sequelize,
      modelName: "Receiptdetail",
      tableName: "Receiptdetails",
      validate: {
        validCategoryCombination() {
          const fitrahSubs = ["RICE", "CASH"];
          const otherSubs = [
            "BARANG",
            "MAL",
            "INFAQ/SHADAQAH",
            "FIDYAH",
          ];

          if (
            this.category === "ZAKAT_FITRAH" &&
            !fitrahSubs.includes(this.sub_category)
          ) {
            throw new Error("Sub category tidak valid untuk ZAKAT_FITRAH");
          }

          if (
            this.category === "OTHER" &&
            !otherSubs.includes(this.sub_category)
          ) {
            throw new Error("Sub category tidak valid untuk OTHER");
          }
        },
      },
    },
  );
  return Receiptdetail;
};
