import React, { useState } from 'react';

type TicketTypeFormProps = {
  closeForm: () => void;
};

const TicketTypeForm = ({ closeForm }: TicketTypeFormProps) => {
  const [ticketType, setTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = () => {
    const ticketInfo = {
      ticketType,
      quantity,
      eventId: new URLSearchParams(window.location.search).get('id'), // Extracts the event ID from URL
    };

    console.log('Ticket Purchased:', ticketInfo);
    alert('Ticket purchase successful!');
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Purchase Your Ticket</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ticket Type</label>
            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Ticket Type</option>
              <option value="general">General Admission</option>
              <option value="vip">VIP Admission</option>
              <option value="student">Student Admission</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeForm}
              type="button"
              className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              type="button"
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketTypeForm;
