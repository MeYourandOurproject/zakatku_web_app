"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Receiptdetails", [
      // ======================
      // RECEIPT 1
      // ======================
      {
        receipt_id: 1,
        category: "ZAKAT_FITRAH",
        sub_category: "RICE",
        unit: "kg",
        quantity: 10,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 2
      // ======================
      {
        receipt_id: 2,
        category: "ZAKAT_FITRAH",
        sub_category: "CASH",
        unit: "rupiah",
        quantity: 80000,
        createdAt: now,
        updatedAt: now,
      },
      {
        receipt_id: 2,
        category: "OTHER",
        sub_category: "INFAQ/SHADAQAH",
        unit: "rupiah",
        quantity: 50000,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 3
      // ======================
      {
        receipt_id: 3,
        category: "OTHER",
        sub_category: "MAL",
        unit: "rupiah",
        quantity: 2500000,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 4
      // ======================
      {
        receipt_id: 4,
        category: "ZAKAT_FITRAH",
        sub_category: "RICE",
        unit: "kg",
        quantity: 7.5,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 5
      // ======================
      {
        receipt_id: 5,
        category: "ZAKAT_FITRAH",
        sub_category: "CASH",
        unit: "rupiah",
        quantity: 200000,
        createdAt: now,
        updatedAt: now,
      },
      {
        receipt_id: 5,
        category: "OTHER",
        sub_category: "FIDYAH",
        unit: "paket",
        quantity: 5,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 6
      // ======================
      {
        receipt_id: 6,
        category: "OTHER",
        sub_category: "INFAQ/SHADAQAH",
        unit: "rupiah",
        quantity: 100000,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 7
      // ======================
      {
        receipt_id: 7,
        category: "OTHER",
        sub_category: "MAL",
        unit: "rupiah",
        quantity: 5000000,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 8
      // ======================
      {
        receipt_id: 8,
        category: "ZAKAT_FITRAH",
        sub_category: "RICE",
        unit: "kg",
        quantity: 10,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 9
      // ======================
      {
        receipt_id: 9,
        category: "OTHER",
        sub_category: "INFAQ/SHADAQAH",
        unit: "rupiah",
        quantity: 150000,
        createdAt: now,
        updatedAt: now,
      },

      // ======================
      // RECEIPT 10
      // ======================
      {
        receipt_id: 10,
        category: "ZAKAT_FITRAH",
        sub_category: "CASH",
        unit: "rupiah",
        quantity: 300000,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Receiptdetails", null, {});
  },
};
