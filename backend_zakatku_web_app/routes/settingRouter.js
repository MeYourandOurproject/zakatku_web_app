const express = require("express");
const router = express.Router();
const SettingController = require("../controllers/settingController");

// GET ALL
router.get("/", SettingController.getAll);

// GET BY ID
router.get("/:id", SettingController.getById);

// GET BY KEY
router.get("/key/:key", SettingController.getByKey);

// CREATE
router.post("/", SettingController.create);

// UPDATE
router.put("/:id", SettingController.update);

// DELETE
router.delete("/:id", SettingController.delete);

module.exports = router;
