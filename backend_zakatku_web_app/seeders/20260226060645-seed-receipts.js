"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Receipts", [

      // 01 Maret 2026
      {
        muzaki_id: 1,
        receipt_number: "0102260001",
        date: "2026-03-01",
        number_of_people: 4,
        notes: "Zakat fitrah sekeluarga",
        createdAt: now,
        updatedAt: now,
      },
      {
        muzaki_id: 2,
        receipt_number: "0102260002",
        date: "2026-03-01",
        number_of_people: 2,
        notes: "Zakat fitrah + infaq",
        createdAt: now,
        updatedAt: now,
      },

      // 02 Maret 2026
      {
        muzaki_id: 3,
        receipt_number: "0202260001",
        date: "2026-03-02",
        number_of_people: 1,
        notes: "Zakat mal",
        createdAt: now,
        updatedAt: now,
      },
      {
        muzaki_id: 4,
        receipt_number: "0202260002",
        date: "2026-03-02",
        number_of_people: 3,
        notes: "Zakat fitrah",
        createdAt: now,
        updatedAt: now,
      },

      // 03 Maret 2026
      {
        muzaki_id: 5,
        receipt_number: "0302260001",
        date: "2026-03-03",
        number_of_people: 5,
        notes: "Zakat fitrah + fidyah",
        createdAt: now,
        updatedAt: now,
      },
      {
        muzaki_id: 6,
        receipt_number: "0302260002",
        date: "2026-03-03",
        number_of_people: 2,
        notes: "Infaq rutin",
        createdAt: now,
        updatedAt: now,
      },

      // 04 Maret 2026
      {
        muzaki_id: 7,
        receipt_number: "0402260001",
        date: "2026-03-04",
        number_of_people: 1,
        notes: "Zakat mal tahunan",
        createdAt: now,
        updatedAt: now,
      },

      // 05 Maret 2026
      {
        muzaki_id: 8,
        receipt_number: "0502260001",
        date: "2026-03-05",
        number_of_people: 4,
        notes: "Zakat fitrah keluarga",
        createdAt: now,
        updatedAt: now,
      },
      {
        muzaki_id: 9,
        receipt_number: "0502260002",
        date: "2026-03-05",
        number_of_people: 3,
        notes: "Infaq + shadaqah",
        createdAt: now,
        updatedAt: now,
      },

      // 06 Maret 2026
      {
        muzaki_id: 10,
        receipt_number: "0602260001",
        date: "2026-03-06",
        number_of_people: 6,
        notes: "Zakat fitrah besar",
        createdAt: now,
        updatedAt: now,
      },

    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Receipts", null, {});
  },
};