import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Download, X } from "lucide-react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ManualPrediction = () => {
  const [productName, setProductName] = useState("");
  const [salesData, setSalesData] = useState(Array(12).fill(""));
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleInputChange = (index, value) => {
    const newSalesData = [...salesData];
    newSalesData[index] = value;
    setSalesData(newSalesData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPrediction(null);

    try {
      const response = await axios.post("http://localhost:2002/predict", {
        product_name: productName,
        sales_data: salesData.map(Number),
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setPrediction(response.data.prediction[0]);
        setShowDetails(true);
      }
    } catch (err) {
      setError("An error occurred while fetching the prediction.");
    }
  };

  const getChartData = () => {
    return salesData
      .map((sale, index) => ({
        month: months[index],
        sales: Number(sale),
      }))
      .concat({
        month: "Next",
        prediction: prediction,
      });
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor("#a98467");
    doc.text("Manual Prediction Report", pageWidth / 2, margin + 10, {
      align: "center",
    });

    // Product details
    doc.setFontSize(12);
    doc.text(`Product Name: ${productName}`, margin, margin + 20);
    doc.text(`Prediction: $${prediction.toFixed(2)}`, margin, margin + 30);

    // Sales history table
    doc.setFontSize(14);
    doc.text("Sales History:", margin, margin + 40);

    const tableData = salesData.map((sale, index) => [
      months[index],
      `$${Number(sale).toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: margin + 45,
      head: [["Month", "Sales"]],
      body: tableData,
      theme: "striped",
      styles: { fillColor: "#f5ebe0", textColor: "#a98467", fontSize: 10 },
      headStyles: { fillColor: "#d4a373", textColor: "#ffffff", fontSize: 10 },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
    });

    // Save PDF
    doc.save(`${productName}_Manual_Prediction_Report.pdf`);
  };

  return (
    <div className="bg-[#f5ebe0] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#a98467]">
        Manual Prediction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#a98467] mb-2">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded bg-[#e3d5ca] text-[#a98467]"
            required
          />
        </div>
        <div className="grid grid-cols-6 gap-4">
          {months.map((month, index) => (
            <div key={month}>
              <label className="block text-[#a98467] mb-1">{month}</label>
              <input
                type="number"
                value={salesData[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full p-2 border rounded bg-[#e3d5ca] text-[#a98467]"
                required
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-[#d4a373] text-white rounded hover:bg-[#a98467]"
        >
          Predict
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {prediction !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#a98467]">
              Prediction Result
            </h3>
            <div>
              <button
                onClick={() => setShowDetails(false)}
                className="bg-[#d4a373] text-white p-2 rounded-full hover:bg-[#a98467] transition-colors mr-2"
              >
                <X size={20} />
              </button>
              <button
                onClick={generateReport}
                className="bg-[#d4a373] text-white p-2 rounded-full hover:bg-[#a98467] transition-colors"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
          <p className="text-lg text-[#d4a373] mb-4">
            Predicted Sales: ${prediction.toFixed(2)}
          </p>
          {showDetails && (
            <>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 pr-4">
                  <h4 className="text-lg font-semibold mb-2 text-[#a98467]">
                    Product Details
                  </h4>
                  <p className="text-[#d4a373]">Product Name: {productName}</p>
                  <p className="text-[#d4a373]">
                    Last Month Sales: $
                    {Number(salesData[salesData.length - 1]).toFixed(2)}
                  </p>
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                  <h4 className="text-lg font-semibold mb-2 text-[#a98467]">
                    Sales History
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th className="p-2 bg-[#d4a373] text-white">Month</th>
                          <th className="p-2 bg-[#d4a373] text-white">Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.map((sale, index) => (
                          <tr key={index} className="even:bg-[#f5ebe0]">
                            <td className="p-2">{months[index]}</td>
                            <td className="p-2">${Number(sale).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-6" style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d4a373" />
                    <XAxis dataKey="month" stroke="#a98467" />
                    <YAxis stroke="#a98467" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f5ebe0",
                        borderColor: "#d4a373",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ManualPrediction;
