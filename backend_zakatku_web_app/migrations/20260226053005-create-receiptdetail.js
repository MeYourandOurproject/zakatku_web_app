"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Receiptdetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      receipt_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Receipts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category: {
        type: Sequelize.ENUM("ZAKAT_FITRAH", "OTHER"),
        allowNull: false,
      },
      sub_category: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Receiptdetails");
  },
};
