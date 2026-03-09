const { Setting } = require("../models");

class SettingController {
  // GET ALL SETTINGS
  static async getAll(req, res) {
    try {
      const settings = await Setting.findAll({
        order: [["id", "ASC"]],
      });

      return res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET SETTING BY ID
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const setting = await Setting.findByPk(id);

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      return res.json({
        success: true,
        data: setting,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET SETTING BY KEY
  static async getByKey(req, res) {
    try {
      const { key } = req.params;

      const setting = await Setting.findOne({
        where: { key },
      });

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      return res.json({
        success: true,
        data: setting,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // CREATE SETTING
  static async create(req, res) {
    try {
      const { key, value, description } = req.body;

      const exist = await Setting.findOne({ where: { key } });

      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Key already exists",
        });
      }

      const setting = await Setting.create({
        key,
        value,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Setting created",
        data: setting,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // UPDATE SETTING
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { key, value, description } = req.body;

      const setting = await Setting.findByPk(id);

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      await setting.update({
        key,
        value,
        description,
      });

      return res.json({
        success: true,
        message: "Setting updated",
        data: setting,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE SETTING
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const setting = await Setting.findByPk(id);

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Setting not found",
        });
      }

      await setting.destroy();

      return res.json({
        success: true,
        message: "Setting deleted",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = SettingController;