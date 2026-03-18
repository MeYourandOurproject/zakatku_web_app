const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const authen = require("../middlewares/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/", authen, UserController.getAll);
router.get("/institutions/all", authen, UserController.getAllInstitutions);
router.delete("/institutions/:id", authen, UserController.deleteInstitution);
router.get("/:id", authen, UserController.findById);
router.put("/:id", authen, UserController.update);
router.delete("/:id", authen, UserController.delete);

module.exports = router;
