const ExcelJS = require("exceljs");
const db = require("../models");

const Receipt = db.Receipt;
const Muzaki = db.Muzaki;
const Receiptdetail = db.Receiptdetail;

exports.exportZakatExcel = async (req, res) => {
  try {
    const receipts = await Receipt.findAll({
      include: [
        { model: Muzaki, as: "muzaki" },
        { model: Receiptdetail, as: "details" },
      ],
      order: [["createdAt", "ASC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Zakat");

    // =========================
    // JUDUL
    // =========================
    worksheet.mergeCells("A1:M1");
    worksheet.getCell("A1").value = "LAPORAN PENERIMAAN ZAKAT";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    worksheet.mergeCells("A2:M2");
    worksheet.getCell("A2").value = "Masjid Nurul Fallah - Puri Melia Asri";
    worksheet.getCell("A2").alignment = { horizontal: "center" };

    worksheet.addRow([]);

    // =========================
    // HEADER
    // =========================
    worksheet.mergeCells("A4:A5");
    worksheet.mergeCells("B4:B5");
    worksheet.mergeCells("C4:C5");
    worksheet.mergeCells("D4:D5");
    worksheet.mergeCells("E4:E5");

    worksheet.mergeCells("F4:G4");
    worksheet.mergeCells("H4:J4");
    worksheet.mergeCells("K4:L4");
    worksheet.mergeCells("M4:M5");

    worksheet.getCell("A4").value = "NO";
    worksheet.getCell("B4").value = "TANGGAL";
    worksheet.getCell("C4").value = "NAMA MUZAKI";
    worksheet.getCell("D4").value = "ALAMAT";
    worksheet.getCell("E4").value = "JIWA";

    worksheet.getCell("F4").value = "ZAKAT FITRAH";
    worksheet.getCell("H4").value = "ZAKAT MAL/INFAQ/FIDYAH";
    worksheet.getCell("K4").value = "MUSTAHIQ";
    worksheet.getCell("M4").value = "TOTAL";

    worksheet.getCell("F5").value = "BERAS (KG)";
    worksheet.getCell("G5").value = "UANG (Rp)";
    worksheet.getCell("H5").value = "MAL";
    worksheet.getCell("I5").value = "INFAQ";
    worksheet.getCell("J5").value = "FIDYAH";
    worksheet.getCell("K5").value = "YA";
    worksheet.getCell("L5").value = "BUKAN";

    // =========================
    // STYLE HEADER
    // =========================
    [4, 5].forEach((rowNumber) => {
      worksheet.getRow(rowNumber).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "2F75B5" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // =========================
    // DATA
    // =========================
    let rowIndex = 6;

    receipts.forEach((trx, index) => {
      let rice = 0;
      let cash = 0;
      let mal = 0;
      let infaq = 0;
      let fidyah = 0;

      (trx.details || []).forEach((d) => {
        if (d.category === "ZAKAT_FITRAH") {
          if (d.sub_category === "RICE") rice += Number(d.quantity) || 0;
          if (d.sub_category === "CASH") cash += Number(d.quantity) || 0;
        }

        if (d.category === "OTHER") {
          if (d.sub_category === "MAL") mal += Number(d.quantity) || 0;
          if (d.sub_category === "INFAQ/SHADAQAH")
            infaq += Number(d.quantity) || 0;
          if (d.sub_category === "FIDYAH") fidyah += Number(d.quantity) || 0;
        }
      });

      const total = cash + mal + infaq + fidyah;

      const row = worksheet.getRow(rowIndex);

      row.values = [
        index + 1,
        trx.date || "",
        trx.muzaki?.name || "",
        trx.muzaki?.address || "",
        trx.number_of_people || "",
        rice > 0 ? rice : "",
        cash > 0 ? cash : "",
        mal > 0 ? mal : "",
        infaq > 0 ? infaq : "",
        fidyah > 0 ? fidyah : "",
        trx.muzaki?.is_mustahiq ? "✓" : "",
        trx.muzaki && !trx.muzaki.is_mustahiq ? "✓" : "",
        total > 0 ? total : "",
      ];

      // Format Rp hanya jika ada nilai
      [7, 8, 9, 10, 13].forEach((col) => {
        if (row.getCell(col).value !== "") {
          row.getCell(col).numFmt = '"Rp"#,##0';
        }
      });

      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      rowIndex++;
    });

    // =========================
    // AUTO WIDTH
    // =========================
    worksheet.columns = [
      { width: 6 },
      { width: 12 },
      { width: 22 },
      { width: 35 },
      { width: 8 },
      { width: 12 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 8 },
      { width: 8 },
      { width: 18 },
    ];

    // =========================
    // PRINT SETTING
    // =========================
    worksheet.pageSetup = {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
    };

    // =========================
    // HANDLE DATA KOSONG
    // =========================
    if (receipts.length === 0) {
      worksheet.mergeCells("A6:M6");
      worksheet.getCell("A6").value = "Belum ada data zakat.";
      worksheet.getCell("A6").alignment = { horizontal: "center" };
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    const now = new Date();
    const fileName = `Laporan_Zakat_${
      now.toISOString().replace(/T/, "_").replace(/:/g, "-").split(".")[0]
    }.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal export excel" });
  }
};
