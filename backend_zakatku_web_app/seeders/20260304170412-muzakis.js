"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Muzakis", [
      {
        institution_id: 1,
        name: "Ahmad Fauzi",
        phone: "081234567890",
        address: "Jl. Merdeka No. 10",
        is_mustahiq: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 1,
        name: "Siti Aminah",
        phone: "081298765432",
        address: "Jl. Sudirman No. 25",
        is_mustahiq: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 2,
        name: "Budi Santoso",
        phone: "081355512345",
        address: "Jl. Melati No. 8",
        is_mustahiq: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 2,
        name: "Dewi Lestari",
        phone: "081377788899",
        address: "Jl. Kenanga No. 12",
        is_mustahiq: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 3,
        name: "Rizky Pratama",
        phone: "081388899900",
        address: "Jl. Mawar No. 5",
        is_mustahiq: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 3,
        name: "Nur Aisyah",
        phone: "081322233344",
        address: "Jl. Anggrek No. 17",
        is_mustahiq: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 1,
        name: "Fajar Hidayat",
        phone: "081311122233",
        address: "Jl. Flamboyan No. 3",
        is_mustahiq: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 3,
        name: "Intan Permata",
        phone: "081344455566",
        address: "Jl. Cempaka No. 21",
        is_mustahiq: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 1,
        name: "Hendra Wijaya",
        phone: "081399988877",
        address: "Jl. Dahlia No. 9",
        is_mustahiq: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        institution_id: 3,
        name: "Lina Marlina",
        phone: "081366677788",
        address: "Jl. Teratai No. 14",
        is_mustahiq: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Muzakis", null, {});
  },
};
