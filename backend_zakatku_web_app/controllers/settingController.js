const { Setting } = require("../models");

class SettingController {
  // GET ALL SETTINGS FOR INSTITUTION
  static async getAll(req, res) {
    try {
      const institutionId = req.user.institution_id;

      const settings = await Setting.findAll({
        where: {
          institution_id: institutionId,
        },
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
      const institutionId = req.user.institution_id;

      const setting = await Setting.findOne({
        where: { 
          id,
          institution_id: institutionId,
        },
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

  // GET SETTING BY KEY FOR INSTITUTION
  static async getByKey(req, res) {
    try {
      const { key } = req.params;
      const institutionId = req.user.institution_id;

      const setting = await Setting.findOne({
        where: { 
          key,
          institution_id: institutionId,
        },
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

  // CREATE SETTING FOR INSTITUTION
  static async create(req, res) {
    try {
      const { key, value, description } = req.body;
      const institutionId = req.user.institution_id;

      const exist = await Setting.findOne({ 
        where: { 
          key,
          institution_id: institutionId,
        },
      });

      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Setting key already exists for this institution",
        });
      }

      const setting = await Setting.create({
        institution_id: institutionId,
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
      const institutionId = req.user.institution_id;

      const setting = await Setting.findOne({
        where: {
          id,
          institution_id: institutionId,
        },
      });

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
      const institutionId = req.user.institution_id;

      const setting = await Setting.findOne({
        where: {
          id,
          institution_id: institutionId,
        },
      });

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