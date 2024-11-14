import React, { useState } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Earnings = () => {
  const ticketSales = [
    { event: 'Tech Conference', ticketTypes: [{ type: 'VIP', price: 100, sold: 20 }, { type: 'Basic', price: 50, sold: 30 }] },
    { event: 'Music Fest', ticketTypes: [{ type: 'Basic', price: 50, sold: 50 }, { type: 'Premium', price: 80, sold: 20 }, { type: 'VIP', price: 150, sold: 10 }] }
  ];

  const totalEarnings = ticketSales.reduce(
    (total, sale) =>
      total + sale.ticketTypes.reduce((subtotal, type) => subtotal + type.price * type.sold, 0),
    0
  );

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: 'currency',
      currency: 'NGN',
    });
  };

  // Monthly Revenue Data
  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [5000, 8000, 6500, 12000, 15000, 20000, 25000, 18000, 22000, 24000, 30000, 35000], // Example data
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        tension: 0.4,
      },
    ],
  };

  const monthlyUserData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Users per Month',
        data: [200, 250, 230, 300, 400, 450, 500, 480, 460, 550, 600, 620], // Example user counts
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Pie Chart Data for Ticket Types
  const ticketTypeCounts = ticketSales.flatMap((sale) => sale.ticketTypes).reduce((counts, type) => {
    counts[type.type] = (counts[type.type] || 0) + type.sold;
    return counts;
  }, {} as Record<string, number>);

  const pieChartData = {
    labels: Object.keys(ticketTypeCounts),
    datasets: [
      {
        data: Object.values(ticketTypeCounts),
        backgroundColor: ['#34d399','#7a3df6', '#f59e0b'],
      },
    ],
  };

  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleExpandRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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

      {/* ========================== && •CHARTS FOR REVENUE AND TOTAL USERS• && ====================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Revenue Bar Chart</h3>
          <Bar data={monthlyRevenueData} options={{ responsive: true }} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Monthly Users Line Chart</h3>
          <Line data={monthlyUserData} options={{ responsive: true }} />
        </div>
      </div>

      {/* ========================== && •• && ====================== */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full text-gray-800 dark:text-gray-200">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-900">
              <th className="p-3 md:p-4 text-left">Event</th>
              <th className="p-3 md:p-4 text-left">Ticket Types</th>
              <th className="p-3 md:p-4 text-left">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {ticketSales.map((sale, index) => (
              <React.Fragment key={index}>
                <tr
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="p-3 md:p-4">{sale.event}</td>
                  <td className="p-3 md:p-4">
                    <button onClick={() => toggleExpandRow(index)} className="text-blue-600 dark:text-blue-400 underline">
                      {expandedRows.includes(index) ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                  <td className="p-3 md:p-4 font-semibold">
                    {formatCurrency(sale.ticketTypes.reduce((total, type) => total + type.price * type.sold, 0))}
                  </td>
                </tr>
                {expandedRows.includes(index) && (
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td colSpan={3} className="p-4">
                      <table className="w-full text-gray-700 dark:text-gray-300">
                        <thead>
                          <tr>
                            <th className="p-2 text-left">Type</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Sold</th>
                            <th className="p-2 text-left">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.ticketTypes.map((type, i) => (
                            <tr key={i}>
                              <td className="p-2">{type.type}</td>
                              <td className="p-2">{formatCurrency(type.price)}</td>
                              <td className="p-2">{type.sold}</td>
                              <td className="p-2">{formatCurrency(type.price * type.sold)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>


      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4 p-2 underline decoration-gray-500">Ticket Type Distribution</h3>
        <span className="w-[100%] h-[50vh] flex center justify-center">
          <Pie data={pieChartData} options={{ responsive: true }} className='w-[50%]' />
        </span>
      </div>

      <div className="flex justify-center mt-4 md:mt-8">
        <button className="w-full flex items-center justify-center bg-blue-600 dark:bg-blue-700 text-white py-2 md:py-3 rounded-xl font-bold text-lg tracking-wide shadow-md transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
          <BiMoneyWithdraw className="mr-3 text-xl md:text-2xl" />
          Withdraw Earnings
        </button>
      </div>
    </section>
  );
};

export default Earnings;
