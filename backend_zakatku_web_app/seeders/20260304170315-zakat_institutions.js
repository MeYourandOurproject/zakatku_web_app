"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Zakatinstitutions", [
      {
        name: "Masjid Al-Hidayah",
        type: "mosque",
        address: "Jl. Sukajadi No. 10, Bandung",
        phone: "081234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "LAZ Amanah Umat",
        type: "laz",
        address: "Jl. Asia Afrika No. 20, Bandung",
        phone: "082345678901",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Yayasan Pendidikan Cahaya Ilmu",
        type: "school",
        address: "Jl. Setiabudi No. 50, Bandung",
        phone: "083456789012",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Zakatinstitutions", null, {});
  },
};
