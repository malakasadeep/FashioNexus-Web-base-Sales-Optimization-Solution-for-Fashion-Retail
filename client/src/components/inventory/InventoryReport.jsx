import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jspdf from "jspdf";
import "jspdf-autotable";
// import "../../assets/css/user/userList.css";

export default function InventoryReport({ inventory }) {
  function generatePDF(inventory) {
    const doc = new jspdf(); //Creates a new instance of jspdf, which represents a PDF document.
    const tableColumn = [
      //Defines an array tableColumn containing the column headers for the table in the PDF.
      " ",
      "Item Name",
      "Category",
      "Price",
      "Sizes",
      "Quantity",
      "Reorder Level",
      "Stock Status",
      "Supplier Name",
      "Supplier Contact",
    ];
    const tableRows = []; //Initializes an empty array tableRows to store rows of data for the table.

    inventory
      .slice(0)
      .reverse()
      .map((inventory, index) => {
        const inventorydata = [
          index + 1,
          inventory.ItemName,
          inventory.Category,
          "$" + inventory.UnitPrice,
          inventory.Sizes,
          inventory.StockQuantity,
          inventory.ReorderLevel,
          inventory.StockStatus,
          inventory.SupplierName,
          inventory.SupplierContact,
        ];
        tableRows.push(inventorydata);
      });

    const date = Date().split(" "); // Gets the current date and formats it as a string (MM-DD-YYYY).
    const dateStr = date[1] + "-" + date[2] + "-" + date[3];

    // const logo = new Image();
    // logo.src = "../../assets/img/Logo14.png";

    doc.setFontSize(28).setFont("Mooli", "bold").setTextColor(169, 132, 109);
    doc.text("FashioNexus", 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(20).setTextColor(0, 0, 0);
    doc.text("Inventory Details Report", 65, 25);

    doc.setFont("times", "normal").setFontSize(15).setTextColor(100, 100, 100);
    doc.text(`Report Generated Date: ${dateStr}`, 65, 35);

    doc
      .setFont("courier", "normal")
      .setFontSize(12)
      .setTextColor(150, 150, 150);
    doc.text("FashioNexus.co, Galle Road, Colombo, Sri lanka", 50, 45);

    doc
      .setFont("courier", "normal")
      .setFontSize(12)
      .setTextColor(150, 150, 150);
    doc.text(
      "--------------------------------------------------------------------------------------------------",
      0,
      49
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [212, 163, 115],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    doc.save(`Inventory-Details-Report_${dateStr}.pdf`); // Saves the PDF document with a filename containing the current.
  }
  return (
    <div>
      <button
        className="bg-DarkColor text-white p-3 rounded hover:bg-ExtraDarkColor transition"
        onClick={() => {
          generatePDF(inventory);
        }}
      >
        Generate report
      </button>
    </div>
  );
}
