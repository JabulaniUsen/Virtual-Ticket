import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Earnings = () => {
  const ticketSales = [
    { event: 'Tech Conference', ticketType: 'VIP', price: 100, sold: 20 },
    { event: 'Music Fest', ticketType: 'Basic', price: 50, sold: 30 },
  ];

  const totalEarnings = ticketSales.reduce(
    (total, sale) => total + sale.price * sale.sold,
    0
  );

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
    });
  };

  // Data for the charts
  const chartData = {
    labels: ticketSales.map((sale) => sale.event),
    datasets: [
      {
        label: 'Total Revenue per Event',
        data: ticketSales.map((sale) => sale.price * sale.sold),
        backgroundColor: ['#3b82f6', '#60a5fa'],
      },
    ],
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 md:p-8 sm:p-2 rounded-xl shadow-lg max-w-5xl mx-auto space-y-6 md:space-y-8">
      {/* Total Earnings Card */}
      <div className="p-4 md:p-6 bg-blue-100 dark:bg-blue-900 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <FaMoneyBillWave className="text-5xl md:text-6xl text-blue-600 dark:text-blue-300" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 dark:text-white">
              Total Earnings
            </h2>
            <p className="text-sm md:text-base text-blue-600 dark:text-blue-400">
              Total revenue from all events
            </p>
          </div>
        </div>
        <div className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-200">
          {formatCurrency(totalEarnings)}
        </div>
      </div>

      {/* Earnings Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Revenue Bar Chart</h3>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Revenue Line Chart</h3>
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Ticket Sales Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full text-gray-800 dark:text-gray-200">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-900">
              <th className="p-3 md:p-4 text-left">Event</th>
              <th className="p-3 md:p-4 text-left">Ticket Type</th>
              <th className="p-3 md:p-4 text-left">Price</th>
              <th className="p-3 md:p-4 text-left">Sold</th>
              <th className="p-3 md:p-4 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {ticketSales.map((sale, index) => (
              <tr
                key={index}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
              >
                <td className="p-3 md:p-4">{sale.event}</td>
                <td className="p-3 md:p-4">{sale.ticketType}</td>
                <td className="p-3 md:p-4">{formatCurrency(sale.price)}</td>
                <td className="p-3 md:p-4">{sale.sold}</td>
                <td className="p-3 md:p-4 font-semibold">{formatCurrency(sale.price * sale.sold)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Withdrawal Action Button */}
      <div className="flex justify-center mt-4 md:mt-8">
        <button className="w-full max-w-xs md:max-w-md flex items-center justify-center bg-blue-600 dark:bg-blue-700 text-white py-2 md:py-3 rounded-xl font-bold text-lg tracking-wide shadow-md transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
          <BiMoneyWithdraw className="mr-3 text-xl md:text-2xl" />
          Withdraw Earnings
        </button>
      </div>
    </section>
  );
};

export default Earnings;
