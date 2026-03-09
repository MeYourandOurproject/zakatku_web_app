const express = require("express");
const router = express.Router();
const MuzakiController = require("../controllers/muzakiController");
const authen = require("../middlewares/auth");

router.post("/", authen, MuzakiController.create);
router.get("/", authen, MuzakiController.GetAll);
router.get("/:id", authen, MuzakiController.GetById);
router.put("/:id", authen, MuzakiController.update);
router.delete("/:id", authen, MuzakiController.delete);

module.exports = router;