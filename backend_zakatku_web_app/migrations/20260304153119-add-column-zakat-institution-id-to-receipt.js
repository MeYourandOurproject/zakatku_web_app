"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Receipts", "institution_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Zakatinstitutions",
        key: "id",
      },
      after: "muzaki_id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Receipts", "institution_id");
  },
};
