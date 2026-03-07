"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert("Users", [
      // SUPERADMIN
      {
        name: "Super Admin",
        email: "superadmin@zakatku.com",
        password: hashedPassword,
        role: "superadmin",
        institution_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ADMIN MASJID AL-HIDAYAH (id:1)
      {
        name: "Admin Masjid Al-Hidayah",
        email: "admin1@zakatku.com",
        password: hashedPassword,
        role: "admin",
        institution_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ADMIN LAZ AMANAH UMAT (id:2)
      {
        name: "Admin LAZ Amanah Umat",
        email: "admin2@zakatku.com",
        password: hashedPassword,
        role: "admin",
        institution_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ADMIN YAYASAN (id:3)
      {
        name: "Admin Yayasan Cahaya Ilmu",
        email: "admin3@zakatku.com",
        password: hashedPassword,
        role: "admin",
        institution_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};