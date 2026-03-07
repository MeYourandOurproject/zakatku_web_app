const express = require("express");
const router = express.Router();
const ReceiptController = require("../controllers/receiptController");

const authen = require("../middlewares/auth");

router.post("/", ReceiptController.create);
router.get("/", authen, ReceiptController.GetAll);
router.get("/:id", authen, ReceiptController.findById);
router.put("/:id", authen, ReceiptController.update);
router.delete("/:id", authen, ReceiptController.delete);

module.exports = router;
