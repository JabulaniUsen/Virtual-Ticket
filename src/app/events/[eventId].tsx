import { useRouter } from 'next/router';
import { Card, CardContent, Typography, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const EventDetail = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const event = {
    title: 'Sample Event',
    description: 'An amazing event.',
    date: '2024-12-01',
    location: 'New York',
    ticketTypes: [
      { name: 'Basic', price: 50 },
      { name: 'VIP', price: 100 }
    ]
  };

  const copyLink = () => {
    const link = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(link);
    alert(`Event link copied: ${link}`);
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h4">{event.title}</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        <Typography>Date: {event.date}</Typography>
        <Typography>Location: {event.location}</Typography>
      </CardContent>
      <CardContent>
        <Typography variant="h6" gutterBottom>Ticket Options</Typography>
        {event.ticketTypes.map((ticket, index) => (
          <Typography key={index} variant="body1">
            {ticket.name} - ${ticket.price}
          </Typography>
        ))}
      </CardContent>
      <Button onClick={copyLink} startIcon={<ContentCopyIcon />} variant="outlined" fullWidth>
        Copy Event Link
      </Button>
    </Card>
  );
};

export default EventDetail;
