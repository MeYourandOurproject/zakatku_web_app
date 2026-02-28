const express = require("express");
const router = express.Router();
const MuzakiController = require("../controllers/muzakiController");

router.post("/", MuzakiController.create);
router.get("/", MuzakiController.GetAll);
router.get("/:id", MuzakiController.GetById);
router.put("/:id", MuzakiController.update);
router.delete("/:id", MuzakiController.delete);

module.exports = router;