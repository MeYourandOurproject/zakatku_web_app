"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Setting.belongsTo(models.Zakatinstitution, {
        foreignKey: "institution_id",
        as: "institution",
      });
    }
  }
  Setting.init(
    {
      institution_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      key: { type: DataTypes.STRING },
      value: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "Setting",
      tableName: "Settings",
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ["institution_id", "key"],
        },
      ],
    },
  );
  return Setting;
};
