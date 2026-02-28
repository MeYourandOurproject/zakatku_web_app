const express = require("express");
const router = express.Router();

const TransactionController = require("../controllers/transactionController");

router.post("/generate-number", TransactionController.generateNumber);
router.post("/", TransactionController.create);

router.get("/", TransactionController.getAll);
router.get("/:id", TransactionController.getById);

module.exports = router;
