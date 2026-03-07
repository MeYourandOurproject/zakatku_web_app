"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Muzakis", "institution_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Zakatinstitutions",
        key: "id",
      },
      after: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Muzakis", "institution_id");
  },
};
