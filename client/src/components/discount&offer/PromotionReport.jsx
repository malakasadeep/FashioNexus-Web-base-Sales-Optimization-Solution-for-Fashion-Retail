import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jspdf from "jspdf";
import "jspdf-autotable";
import { MdFileDownload } from "react-icons/md";
//import moment from "moment";
//import "../../assets/css/user/userList.css";

export default function PromotionReport({ promotions }, { searchData }) {
  //trains, which contains an array of train objects and searchData, which likely contains search parameters used to filter the train data
  function generatePDF(promotions, searchData) {
    const doc = new jspdf();
    const tableColumn = [
      "No",
      "Promotion Name",
      "Promotion Code",
      "Promotion Type",
      "Discount Percentage",
      "Price",
      "Final Price",
      "Start Date",
      "End Date",
      "Applicable Products",
      "Usage Limit",
    ];
    const tableRows = [];

    promotions
      .slice(0)
      .reverse()
      .map((promotion, index) => {
        const data = [
          index + 1,
          promotion.promotionName,
          promotion.promotionCode,
          promotion.promotionType,
          promotion.discountPercentage,
          promotion.price,
          promotion.finalPrice,
          promotion.startDate,
          promotion.endDate,
          promotion.applicableProducts,
          promotion.usageLimit,
          //"$" + train.price,
          //moment(packages.createdAt).format("MM/DD/YYYY h:mm A"),
        ];
        tableRows.push(data);
      });

    const date = Date().split(" ");
    const dateStr = date[1] + "-" + date[2] + "-" + date[3];

    doc.setFontSize(28).setFont("Mooli", "bold").setTextColor(65, 164, 255);
    doc.text("FashioNexus", 80, 15);

    doc.setFont("helvetica", "normal").setFontSize(20).setTextColor(0, 0, 0);
    doc.text(`Promotion Details Report `, 75, 25);

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
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    doc.save(`Promotion-Details-Report_${dateStr}.pdf`);
  }
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-1 ">
        <button
          onClick={() => {
            generatePDF(promotions, searchData);
          }}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center gap-2"
        >
          <MdFileDownload /> Download Report
        </button>
      </div>
    </div>
  );
}
