const { Receipt, Muzaki, Receiptdetail } = require("../models");
const { Op } = require("sequelize");

class ReceiptController {
  // =========================
  // CREATE RECEIPT
  // =========================
  static async create(req, res) {
    try {
      const { muzaki_id, receipt_number, date, number_of_people, notes } =
        req.body;

      if (!muzaki_id || !receipt_number || !date) {
        return res.status(400).json({
          message: "muzaki_id, receipt_number and date are required",
        });
      }

      const newReceipt = await Receipt.create({
        muzaki_id,
        receipt_number,
        date,
        number_of_people: number_of_people ?? 1,
        notes,
      });

      return res.status(201).json({
        message: "Receipt created successfully",
        data: newReceipt,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // GET ALL RECEIPTS
  // =========================
  static async GetAll(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;

      const offset = (page - 1) * limit;

      const { count, rows } = await Receipt.findAndCountAll({
        where: {
          receipt_number: {
            [Op.like]: `%${search}%`,
          },
        },
        include: [
          {
            model: Muzaki,
            as: "muzaki",
          },
          {
            model: Receiptdetail,
            as: "details",
          },
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
  // GET RECEIPT BY ID
  // =========================
  static async findById(req, res) {
    try {
      const { id } = req.params;

      const receipt = await Receipt.findByPk(id, {
        include: [
          {
            model: Muzaki,
            as: "muzaki",
          },
          {
            model: Receiptdetail,
            as: "details",
          },
        ],
      });

      if (!receipt) {
        return res.status(404).json({
          message: "Receipt not found",
        });
      }

      return res.status(200).json({
        message: "Success",
        data: receipt,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // UPDATE RECEIPT
  // =========================
  static async update(req, res) {
    try {
      const { id } = req.params;

      const receipt = await Receipt.findByPk(id);

      if (!receipt) {
        return res.status(404).json({
          message: "Receipt not found",
        });
      }

      const { muzaki_id, receipt_number, date, number_of_people, notes } =
        req.body;

      await receipt.update({
        muzaki_id: muzaki_id ?? receipt.muzaki_id,
        receipt_number: receipt_number ?? receipt.receipt_number,
        date: date ?? receipt.date,
        number_of_people: number_of_people ?? receipt.number_of_people,
        notes: notes ?? receipt.notes,
      });

      return res.status(200).json({
        message: "Receipt updated successfully",
        data: receipt,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // DELETE RECEIPT
  // =========================
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const receipt = await Receipt.findByPk(id);

      if (!receipt) {
        return res.status(404).json({
          message: "Receipt not found",
        });
      }

      await receipt.destroy();

      return res.status(200).json({
        message: "Receipt deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = ReceiptController;
