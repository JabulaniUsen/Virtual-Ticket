import React, { useState } from 'react';
import { DialogContent, TextField, Button, Box, Typography } from '@mui/material';

type EventFormProps = {
  open: boolean;
  onClose: () => void;
};

const EventForm: React.FC<EventFormProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [ticketTypes, setTicketTypes] = useState([{ name: 'Basic', price: '' }]);

  const handleAddTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '' }]);
  };

  const handleTicketTypeChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index][field] = value;
    setTicketTypes(updatedTickets);
  };

  const handleSubmit = () => {
    console.log({ title, description, date, location, price, ticketTypes });
    onClose();
  };

  return (
    <>
      <Box p={3}>
        <Typography variant="h6" gutterBottom>
          Add New Event
        </Typography>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              required
            />
            <TextField
              label="Date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <TextField
              label="Base Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />

            <Typography variant="h6" sx={{ mt: 3 }}>
              Ticket Types
            </Typography>
            {ticketTypes.map((ticket, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Type"
                  value={ticket.name}
                  onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                  required
                />
                <TextField
                  label="Price"
                  type="number"
                  value={ticket.price}
                  onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                  required
                />
              </Box>
            ))}
            <Button onClick={handleAddTicketType} variant="outlined">
              Add Ticket Type
            </Button>
          </Box>
        </DialogContent>
        <Box textAlign="right" p={2}>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save Event
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EventForm;
