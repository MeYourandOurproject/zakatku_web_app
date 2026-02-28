const express = require("express");
const router = express.Router();
const ReceiptController = require("../controllers/receiptController");

router.post("/", ReceiptController.create);
router.get("/", ReceiptController.GetAll);
router.get("/:id", ReceiptController.findById);
router.put("/:id", ReceiptController.update);
router.delete("/:id", ReceiptController.delete);

module.exports = router;
