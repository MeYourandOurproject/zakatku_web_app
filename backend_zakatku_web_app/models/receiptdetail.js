"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Receiptdetail extends Model {
    static associate(models) {
      Receiptdetail.belongsTo(models.Receipt, {
        foreignKey: "receipt_id",
        as: "receipt",
      });
    }
  }
  Receiptdetail.init(
    {
      receipt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Receipts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
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
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Receiptdetail",
      tableName: "Receiptdetails",

      hooks: {
        beforeSave(detail) {
          const sub = detail.sub_category;

          // ZAKAT BERAS
          if (sub === "RICE") {
            detail.unit = "KG";
            detail.price = null;
            detail.total = null;
          }

          // ZAKAT UANG
          if (sub === "CASH") {
            detail.unit = "RUPIAH";
            detail.quantity = null;
            detail.price = null;
          }

          // BARANG
          if (sub === "BARANG") {
            detail.unit = "ITEM";
            detail.price = null;
          }

          // MAL
          if (sub === "MAL") {
            detail.unit = "RUPIAH";
            detail.quantity = null;
            detail.price = null;
          }

          // INFAQ / SHADAQAH
          if (sub === "INFAQ/SHADAQAH") {
            detail.unit = "RUPIAH";
            detail.quantity = null;
            detail.price = null;
          }

          // FIDYAH
          if (sub === "FIDYAH") {
            detail.unit = "PAKET";

            if (!detail.quantity || !detail.price) {
              throw new Error("FIDYAH harus memiliki quantity dan price");
            }

            detail.total = Number(detail.quantity) * Number(detail.price);
          }
        },
      },

      validate: {
        validCategoryCombination() {
          const fitrahSubs = ["RICE", "CASH"];
          const otherSubs = ["BARANG", "MAL", "INFAQ/SHADAQAH", "FIDYAH"];

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
