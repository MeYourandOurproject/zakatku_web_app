const express = require("express");
const router = express.Router();
const SettingController = require("../controllers/settingController");
const authen = require("../middlewares/auth");

// GET ALL
router.get("/", authen, SettingController.getAll);

// GET BY ID
router.get("/:id", authen, SettingController.getById);

// GET BY KEY
router.get("/key/:key", authen, SettingController.getByKey);

// CREATE
router.post("/", authen, SettingController.create);

// UPDATE
router.put("/:id", authen, SettingController.update);

// DELETE
router.delete("/:id", authen, SettingController.delete);

module.exports = router;
