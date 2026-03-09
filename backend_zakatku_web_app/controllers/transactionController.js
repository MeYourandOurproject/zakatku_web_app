const {
  Receipt,
  Receiptdetail,
  Muzaki,
  Setting,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

class TransactionController {
  // GENERATE RECEIPT NUMBER
  static async generateNumber(req, res) {
    try {
      const today = new Date();

      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = String(today.getFullYear()).slice(-2);

      const prefix = `${day}${month}${year}`;

      const lastReceipt = await Receipt.findOne({
        where: {
          institution_id: req.user.institution_id,
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

      return res.json({ receipt_number });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // CREATE TRANSACTION
  static async create(req, res) {
    const t = await sequelize.transaction();

    try {
      const {
        name,
        phone,
        address,
        is_mustahiq,
        receipt_number,
        number_of_people,
        zakat_rice,
        zakat_cash,
        outher_mal,
        outher_infaq,
        outher_fidyah,
        notes,
      } = req.body;

      // ambil harga fidyah dari settings
      const fidyahSetting = await Setting.findOne({
        where: { key: "fidyah_price" },
      });

      const fidyahPrice = fidyahSetting ? Number(fidyahSetting.value) : 0;

      // 1️⃣ Create Muzaki
      const muzaki = await Muzaki.create(
        {
          institution_id: req.user.institution_id,
          name,
          phone,
          address,
          is_mustahiq,
        },
        { transaction: t },
      );

      // 2️⃣ Create Receipt
      const receipt = await Receipt.create(
        {
          muzaki_id: muzaki.id,
          institution_id: req.user.institution_id,
          receipt_number,
          date: new Date(),
          number_of_people,
          notes,
        },
        { transaction: t },
      );

      const details = [];

      // ZAKAT BERAS
      if (zakat_rice > 0)
        details.push({
          receipt_id: receipt.id,
          category: "ZAKAT_FITRAH",
          sub_category: "RICE",
          quantity: zakat_rice,
        });

      // ZAKAT CASH
      if (zakat_cash > 0)
        details.push({
          receipt_id: receipt.id,
          category: "ZAKAT_FITRAH",
          sub_category: "CASH",
          total: zakat_cash,
        });

      // MAL
      if (outher_mal > 0)
        details.push({
          receipt_id: receipt.id,
          category: "OTHER",
          sub_category: "MAL",
          total: outher_mal,
        });

      // INFAQ
      if (outher_infaq > 0)
        details.push({
          receipt_id: receipt.id,
          category: "OTHER",
          sub_category: "INFAQ/SHADAQAH",
          total: outher_infaq,
        });

      // FIDYAH
      if (outher_fidyah > 0)
        details.push({
          receipt_id: receipt.id,
          category: "OTHER",
          sub_category: "FIDYAH",
          quantity: outher_fidyah,
          price: fidyahPrice,
        });

      if (details.length > 0) {
        await Receiptdetail.bulkCreate(details, {
          transaction: t,
          individualHooks: true,
        });
      }

      await t.commit();

      return res.status(201).json({
        message: "Transaction saved successfully",
        data: { muzaki, receipt, details },
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ error: error.message });
    }
  }

  // GET ALL TRANSACTIONS
  static async getAll(req, res) {
    try {
      const transactions = await Receipt.findAll({
        where: {
          institution_id: req.user.institution_id,
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
        order: [["date", "ASC"]],
      });

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET ONE TRANSACTION
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
            model: Receiptdetail,
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
