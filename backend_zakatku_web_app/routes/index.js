const express = require("express");
const router = express.Router();

const muzakiRouter = require("./muzakiRouter");
const receiptRouter = require("./receiptRouter");
const receiptDetailRouter = require("./receiptRouter");
const transactionRouter = require("./transactionRouter");

const { exportZakatExcel } = require("../controllers/exportController");

router.get("/export/excel", exportZakatExcel);

router.use("/muzakis", muzakiRouter);
router.use("/receipts", receiptRouter);
router.use("/receipt-details", receiptDetailRouter);
router.use("/transactions", transactionRouter);

module.exports = router;
