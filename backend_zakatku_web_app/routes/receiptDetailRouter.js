const express = require("express");
const router = express.Router();
const ReceiptdetailController = require("../controllers/receiptDetailController");

router.post("/", ReceiptdetailController.create);
router.get("/", ReceiptdetailController.findAll);
router.get("/:id", ReceiptdetailController.findById);
router.put("/:id", ReceiptdetailController.update);
router.delete("/:id", ReceiptdetailController.delete);

module.exports = router;