'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Settings', [
      {
        key: 'fidyah_price',
        value: '25000',
        description: 'Harga fidyah per paket',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'zakat_fitrah_rice_per_person',
        value: '2.5',
        description: 'Zakat fitrah beras per orang (kg)',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'zakat_fitrah_cash_per_person',
        value: '40000',
        description: 'Zakat fitrah uang per orang',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Settings', null, {})
  },
}