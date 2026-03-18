'use strict'

module.exports = {
  async up(queryInterface) {
    // Clear existing settings first
    await queryInterface.bulkDelete('Settings', null, {});

    // Create default settings for each institution (id: 1, 2, 3)
    const institutions = [1, 2, 3];
    const settingsData = [];

    institutions.forEach((institutionId) => {
      settingsData.push(
        {
          institution_id: institutionId,
          key: 'fidyah_price',
          value: '25000',
          description: 'Harga fidyah per paket',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          institution_id: institutionId,
          key: 'zakat_fitrah_rice_per_person',
          value: '2.5',
          description: 'Zakat fitrah beras per orang (kg)',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          institution_id: institutionId,
          key: 'zakat_fitrah_cash_per_person',
          value: '40000',
          description: 'Zakat fitrah uang per orang',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    });

    await queryInterface.bulkInsert('Settings', settingsData);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Settings', null, {});
  },
}