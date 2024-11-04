import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa'; // Importing an icon from react-icons
import { BiMoneyWithdraw } from 'react-icons/bi'; // Withdrawal icon

const Earnings = () => {
  const ticketSales = [
    { event: 'Tech Conference', ticketType: 'VIP', price: 100, sold: 20 },
    { event: 'Music Fest', ticketType: 'Basic', price: 50, sold: 30 },
  ];

  const totalEarnings = ticketSales.reduce((total, sale) => total + sale.price * sale.sold, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
      <div className="flex items-center mb-4">
        <FaMoneyBillWave className="text-4xl text-blue-600 dark:text-blue-400 mr-2" />
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Total Earnings</h2>
      </div>
      <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-300 mb-4">${totalEarnings}</h3>
      
      <div className="space-y-4">
        {ticketSales.map((sale, index) => (
          <div key={index} className="flex justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow transition-shadow duration-200 hover:shadow-md">
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                {sale.event} - {sale.ticketType}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                ${sale.price} x {sale.sold} sold
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ${(sale.price * sale.sold).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Withdrawal Button */}
      <div className="mt-6">
        <button className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <BiMoneyWithdraw className="mr-2" />
          Withdraw Earnings
        </button>
      </div>
    </div>
  );
};

export default Earnings;
