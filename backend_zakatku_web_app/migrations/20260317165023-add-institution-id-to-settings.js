'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the old unique constraint on key
    try {
      await queryInterface.removeConstraint('Settings', 'key');
    } catch (error) {
      console.log('No existing constraint to remove');
    }

    // Add institution_id column
    await queryInterface.addColumn('Settings', 'institution_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Zakatinstitutions',
        key: 'id',
      },
      after: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add unique composite index for institution_id and key
    await queryInterface.addIndex('Settings', {
      fields: ['institution_id', 'key'],
      unique: true,
      name: 'unique_institution_setting_key',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Settings', 'unique_institution_setting_key');
    await queryInterface.removeColumn('Settings', 'institution_id');
  },
};
