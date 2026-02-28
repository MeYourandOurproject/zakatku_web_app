const { Receipt, ReceiptDetail, Muzaki, sequelize } = require("../models");
const { Op } = require("sequelize");

class TransactionController {
  // CREATE full transaction (receipt + details)
  static async create(req, res) {
    const t = await sequelize.transaction();

    try {
      const {
        muzaki_id,
        date,
        number_of_people,
        notes,
        details, // array of receipt details
      } = req.body;

      // 1️⃣ Validasi Muzaki
      const muzaki = await Muzaki.findByPk(muzaki_id);
      if (!muzaki) {
        await t.rollback();
        return res.status(404).json({ message: "Muzaki not found" });
      }

      // 2️⃣ Generate receipt_number format: ddmmyy0001
      const today = date ? new Date(date) : new Date();

      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = String(today.getFullYear()).slice(-2);

      const prefix = `${day}${month}${year}`;

      const lastReceipt = await Receipt.findOne({
        where: {
          receipt_number: {
            [Op.like]: `${prefix}%`,
          },
        },
        order: [["receipt_number", "DESC"]],
      });

      let sequence = 1;

      if (lastReceipt) {
        const lastNumber = lastReceipt.receipt_number.slice(-4);
        sequence = parseInt(lastNumber) + 1;
      }

      const receipt_number = `${prefix}${String(sequence).padStart(4, "0")}`;

      // 3️⃣ Create Receipt
      const receipt = await Receipt.create(
        {
          muzaki_id,
          receipt_number,
          date: today,
          number_of_people,
          notes,
        },
        { transaction: t }
      );

      // 4️⃣ Create Receipt Details
      if (details && details.length > 0) {
        const detailData = details.map((item) => ({
          receipt_id: receipt.id,
          type: item.type, // zakat / shadaqah
          amount: item.amount,
          description: item.description || null,
        }));

        await ReceiptDetail.bulkCreate(detailData, {
          transaction: t,
        });
      }

      await t.commit();

      return res.status(201).json({
        message: "Transaction created successfully",
        receipt_number,
        receipt_id: receipt.id,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Failed to create transaction",
        error: error.message,
      });
    }
  }

  // GET All Transactions (with details)
  static async getAll(req, res) {
    try {
      const transactions = await Receipt.findAll({
        include: [
          {
            model: Muzaki,
            as: "muzaki",
          },
          {
            model: ReceiptDetail,
            as: "details",
          },
        ],
        order: [["date", "DESC"]],
      });

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET One Transaction
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const transaction = await Receipt.findByPk(id, {
        include: [
          {
            model: Muzaki,
            as: "muzaki",
          },
          {
            model: ReceiptDetail,
            as: "details",
          },
        ],
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TransactionController;