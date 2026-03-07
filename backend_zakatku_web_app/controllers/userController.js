const { User, Zakatinstitution } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  // ======================
  // REGISTER
  // ======================
  static async register(req, res) {
    try {
      const { name, email, password, role, institution_id } = req.body;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        institution_id,
      });

      res.status(201).json({
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
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
}

module.exports = UserController;
