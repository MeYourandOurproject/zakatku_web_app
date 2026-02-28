const { Receiptdetail, Receipt } = require("../models");

class ReceiptdetailController {

  // =========================
  // CREATE RECEIPT DETAIL
  // =========================
  static async create(req, res) {
    try {
      const {
        receipt_id,
        category,
        sub_category,
        unit,
        quantity,
      } = req.body;

      if (!receipt_id || !category || !sub_category) {
        return res.status(400).json({
          message: "receipt_id, category and sub_category are required",
        });
      }

      // cek apakah receipt ada
      const receipt = await Receipt.findByPk(receipt_id);
      if (!receipt) {
        return res.status(404).json({
          message: "Receipt not found",
        });
      }

      const newDetail = await Receiptdetail.create({
        receipt_id,
        category,
        sub_category,
        unit,
        quantity,
      });

      return res.status(201).json({
        message: "Receipt detail created successfully",
        data: newDetail,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // GET ALL DETAILS
  // =========================
  static async findAll(req, res) {
    try {
      const { receipt_id } = req.query;

      const whereClause = receipt_id
        ? { receipt_id }
        : {};

      const details = await Receiptdetail.findAll({
        where: whereClause,
        include: [
          {
            model: Receipt,
            as: "recepit", // sesuai model kamu (walau typo 😄)
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        message: "Success",
        data: details,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // GET DETAIL BY ID
  // =========================
  static async findById(req, res) {
    try {
      const { id } = req.params;

      const detail = await Receiptdetail.findByPk(id, {
        include: [
          {
            model: Receipt,
            as: "recepit",
          },
        ],
      });

      if (!detail) {
        return res.status(404).json({
          message: "Receipt detail not found",
        });
      }

      return res.status(200).json({
        message: "Success",
        data: detail,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // UPDATE DETAIL
  // =========================
  static async update(req, res) {
    try {
      const { id } = req.params;

      const detail = await Receiptdetail.findByPk(id);

      if (!detail) {
        return res.status(404).json({
          message: "Receipt detail not found",
        });
      }

      const {
        category,
        sub_category,
        unit,
        quantity,
      } = req.body;

      await detail.update({
        category: category ?? detail.category,
        sub_category: sub_category ?? detail.sub_category,
        unit: unit ?? detail.unit,
        quantity: quantity ?? detail.quantity,
      });

      return res.status(200).json({
        message: "Receipt detail updated successfully",
        data: detail,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // =========================
  // DELETE DETAIL
  // =========================
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const detail = await Receiptdetail.findByPk(id);

      if (!detail) {
        return res.status(404).json({
          message: "Receipt detail not found",
        });
      }

      await detail.destroy();

      return res.status(200).json({
        message: "Receipt detail deleted successfully",
      });

    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = ReceiptdetailController;