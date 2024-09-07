// SalesForecasting.js
import React from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";

const salesData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Actual Sales",
      data: [300, 450, 350, 500, 620, 580],
      borderColor: "#a98467",
      backgroundColor: "rgba(169, 132, 103, 0.2)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "Predicted Sales",
      data: [320, 470, 380, 540, 640, 600],
      borderColor: "#d4a373",
      backgroundColor: "rgba(212, 163, 115, 0.2)",
      fill: true,
      tension: 0.4,
    },
  ],
};

export default function SalesForecasting() {
  return (
    <motion.div
      className=" p-10 bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">
        Sales Forecasting
      </h1>
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-md">
        <Line data={salesData} />
      </div>
    </motion.div>
  );
}
