import React, { useState } from 'react';

type TicketType = {
  name: string;
  price: number;
};

const TicketTypeForm: React.FC = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: 0 }]);
  };

  const handleNameChange = (index: number, name: string) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index].name = name;
    setTicketTypes(updatedTickets);
  };

  const handlePriceChange = (index: number, price: number) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index].price = price;
    setTicketTypes(updatedTickets);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Ticket Types</h3>
      {ticketTypes.map((ticket, index) => (
        <div key={index} className="flex space-x-4">
          <input
            type="text"
            placeholder="Ticket Name"
            value={ticket.name}
            onChange={(e) => handleNameChange(index, e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Price"
            value={ticket.price}
            onChange={(e) => handlePriceChange(index, Number(e.target.value))}
            className="flex-1 px-4 py-2 border rounded-md"
          />
        </div>
      ))}
      <button onClick={addTicketType} className="px-4 py-2 bg-green-600 text-white rounded-md">
        Add Ticket Type
      </button>
    </div>
  );
};

export default TicketTypeForm;
