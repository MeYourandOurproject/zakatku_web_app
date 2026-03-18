const { User, Zakatinstitution, sequelize } = require("../models");
const { Receipt, Receiptdetail, Setting } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  // ======================
  // REGISTER
  // ======================
  static async register(req, res) {
    const t = await sequelize.transaction();

    try {
      const {
        name,
        email,
        password,
        institution_name,
        institution_type,
        institution_address,
        institution_phone,
      } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        await t.rollback();
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      const institution = await Zakatinstitution.create(
        {
          name: institution_name,
          institution_type: institution_type,
          address: institution_address,
          phone: institution_phone,
        },
        { transaction: t },
      );

      // Create default settings for the new institution
      const defaultSettings = [
        {
          institution_id: institution.id,
          key: 'fidyah_price',
          value: '25000',
          description: 'Harga fidyah per paket',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          institution_id: institution.id,
          key: 'zakat_fitrah_rice_per_person',
          value: '2.5',
          description: 'Zakat fitrah beras per orang (kg)',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          institution_id: institution.id,
          key: 'zakat_fitrah_cash_per_person',
          value: '40000',
          description: 'Zakat fitrah uang per orang',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      await Setting.bulkCreate(defaultSettings, { transaction: t });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create(
        {
          name,
          email,
          password: hashedPassword,
          role: "admin",
          institution_id: institution.id,
        },
        { transaction: t },
      );

      await t.commit();
      res.status(201).json({
        message: "User & Institution registered successfully",
        data: { user, institution },
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // ======================
  // LOGIN
  // ======================
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        include: {
          model: Zakatinstitution,
          as: "institution",
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          institution_id: user.institution_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.status(200).json({
        message: "Login success",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institution_id: user.institution_id,
          institution: user.institution,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // ======================
  // GET ALL USERS
  // ======================
  static async getAll(req, res) {
    try {
      const users = await User.findAll({
        where: {
          institution_id: req.user.institution_id,
        },
        include: {
          model: Zakatinstitution,
          as: "institution",
        },
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({
        message: "Success",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // ======================
  // GET USER BY ID
  // ======================
  static async findById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: {
          id,
          institution_id: req.user.institution_id,
        },
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // ======================
  // UPDATE USER
  // ======================
  static async update(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: {
          id,
          institution_id: req.user.institution_id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const { name, email, role } = req.body;

      await user.update({
        name,
        email,
        role,
      });

      res.status(200).json({
        message: "User updated",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // ======================
  // DELETE USER
  // ======================
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: {
          id,
          institution_id: req.user.institution_id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await user.destroy();

      res.status(200).json({
        message: "User deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // ======================
  // GET ALL ZAKAT INSTITUTIONS (SUPERADMIN ONLY)
  // ======================
  static async getAllInstitutions(req, res) {
    try {
      // Only superadmin can access this
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({
          message: "Access denied. Only superadmin can access this resource.",
        });
      }

      const institutions = await Zakatinstitution.findAll({
        include: {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
        },
      });

      // Get receipt statistics for each institution
      const institutionStats = await Promise.all(
        institutions.map(async (institution) => {
          const receipts = await Receipt.findAll({
            where: { institution_id: institution.id },
            include: {
              model: Receiptdetail,
              as: "details",
            },
          });

          // Calculate total penerimaan (cash) and total rice
          let totalCashRupiah = 0;
          let totalRiceKg = 0;
          
          receipts.forEach((receipt) => {
            if (receipt.details && Array.isArray(receipt.details)) {
              receipt.details.forEach((detail) => {
                // Count rice in KG
                if (detail.sub_category === 'RICE' && detail.quantity) {
                  totalRiceKg += parseFloat(detail.quantity);
                }
                // Count cash items (exclude rice)
                else if (detail.total) {
                  totalCashRupiah += parseFloat(detail.total);
                }
              });
            }
          });

          return {
            ...institution.toJSON(),
            totalReceipts: receipts.length,
            totalCashRupiah: totalCashRupiah,
            totalRiceKg: totalRiceKg,
          };
        })
      );

      res.status(200).json({
        message: "Success",
        data: institutionStats,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // ======================
  // DELETE INSTITUTION (SUPERADMIN ONLY) - CASCADE DELETE ALL RELATED DATA
  // ======================
  static async deleteInstitution(req, res) {
    const t = await sequelize.transaction();

    try {
      // Only superadmin can access this
      if (req.user.role !== 'superadmin') {
        await t.rollback();
        return res.status(403).json({
          message: "Access denied. Only superadmin can delete institutions.",
        });
      }

      const { id } = req.params;

      // 1. Find institution
      const institution = await Zakatinstitution.findByPk(id, { transaction: t });

      if (!institution) {
        await t.rollback();
        return res.status(404).json({
          message: "Institution not found",
        });
      }

      // 2. Disable foreign key checks temporarily
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction: t });

      // 3. Get all receipt IDs for this institution
      const receipts = await Receipt.findAll({
        where: { institution_id: id },
        attributes: ['id'],
        transaction: t,
      });

      const receiptIds = receipts.map(r => r.id);

      // 4. Delete receipt details (these reference receipts)
      if (receiptIds.length > 0) {
        await Receiptdetail.destroy({
          where: {
            receipt_id: {
              [require("sequelize").Op.in]: receiptIds,
            },
          },
          transaction: t,
        });
      }

      // 5. Delete receipts
      await Receipt.destroy({
        where: { institution_id: id },
        transaction: t,
      });

      // 6. Delete muzakis
      const Muzaki = require("../models").Muzaki;
      await Muzaki.destroy({
        where: { institution_id: id },
        transaction: t,
      });

      // 7. Delete settings
      await Setting.destroy({
        where: { institution_id: id },
        transaction: t,
      });

      // 8. Delete users
      await User.destroy({
        where: { institution_id: id },
        transaction: t,
      });

      // 9. Delete the institution
      await Zakatinstitution.destroy({
        where: { id: id },
        transaction: t,
      });

      // 10. Re-enable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction: t });

      // 11. Commit transaction
      await t.commit();

      res.status(200).json({
        message: "Institution and all related data deleted successfully",
      });

    } catch (error) {
      // Log the actual error
      console.error('❌ Delete Institution Error:', error);
      
      // Ensure rollback happens and re-enable FK checks
      if (t && !t.finished) {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => {});
        await t.rollback().catch(e => console.error('Rollback error:', e));
      }

      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
