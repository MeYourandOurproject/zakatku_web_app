const { Muzaki, Receipt, Receiptdetail } = require("../models");
const { Op } = require("sequelize");

class MuzakiController {
  // =========================
  // CREATE MUZAKI
  // =========================
  static async create(req, res) {
    try {
      const { name, phone, address, is_mustahiq } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          message: "Name and phone are required",
        });
      }

      const newMuzaki = await Muzaki.create({
        name,
        phone,
        address,
        is_mustahiq: is_mustahiq ?? false,
      });

      return res.status(201).json({
        message: "Muzaki created successfully",
        data: newMuzaki,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // GET ALL MUZAKI (Pagination + Search)
  // =========================
  static async GetAll(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;

      const offset = (page - 1) * limit;

      const { count, rows } = await Muzaki.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        include: [
          { model: Receipt, as: "receipts" },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        message: "Success",
        totalData: count,
        totalPage: Math.ceil(count / limit),
        currentPage: parseInt(page),
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // GET MUZAKI BY ID
  // =========================
  static async GetById(req, res) {
    try {
      const { id } = req.params;

      const muzaki = await Muzaki.findByPk(id);

      if (!muzaki) {
        return res.status(404).json({
          message: "Muzaki not found",
        });
      }

      return res.status(200).json({
        message: "Success",
        data: muzaki,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // UPDATE MUZAKI
  // =========================
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, address, is_mustahiq } = req.body;

      const muzaki = await Muzaki.findByPk(id);

      if (!muzaki) {
        return res.status(404).json({
          message: "Muzaki not found",
        });
      }

      await muzaki.update({
        name: name ?? muzaki.name,
        phone: phone ?? muzaki.phone,
        address: address ?? muzaki.address,
        is_mustahiq:
          typeof is_mustahiq === "boolean" ? is_mustahiq : muzaki.is_mustahiq,
      });

      return res.status(200).json({
        message: "Muzaki updated successfully",
        data: muzaki,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // DELETE MUZAKI
  // =========================
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const muzaki = await Muzaki.findByPk(id);

      if (!muzaki) {
        return res.status(404).json({
          message: "Muzaki not found",
        });
      }

      await muzaki.destroy();

      return res.status(200).json({
        message: "Muzaki deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = MuzakiController;
