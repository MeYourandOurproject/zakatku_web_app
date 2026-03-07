const express = require("express");
const router = express.Router();

const TransactionController = require("../controllers/transactionController");
const authen = require("../middlewares/auth");

router.post("/generate-number", authen, TransactionController.generateNumber);
router.post("/", authen, TransactionController.create);

router.get("/", authen, TransactionController.getAll);
router.get("/:id", authen, TransactionController.getById);

module.exports = router;
