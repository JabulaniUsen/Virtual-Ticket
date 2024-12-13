'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Button, Grid, Box} from '@mui/material';
import Image from 'next/image';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Loader from '../../components/ui/loader/Loader';
import ToggleMode from '../../components/ui/mode/toggleMode';
import Toast from '../../components/ui/Toast';
import { IoMenu, IoClose } from "react-icons/io5";
import { FiArrowRight } from 'react-icons/fi';
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from '@mui/icons-material'; 
import TicketTypeForm from '../../components/TicketTypeForm';


// ========= Sample Event Data =========
const event = {
  title: 'Disturbing the Peace Party 2:0',
  description:
    'Disturbing the peace party is a party that happens every year with an energized spirit pressure. Don’t miss out on this new year Edition. Get your ticket.. LET’S PARTY',
  date: 'Jan 6, 2025 5:08 PM',
  location: 'Lagos',
  host: 'DJ Steel',
  imageUrl: 'https://img.freepik.com/free-psd/international-year-creative-economy-sustainable-development-banner_23-2148866446.jpg?t=st=1733998640~exp=1734002240~hmac=bd042f88a2594a705941232d195273812425938f3c15046660bb3c2a5c6a1b78&w=900',
  media: [
    '/anim2.png',
    '/anim2.png',
    '/anim2.png',
  ],
  ticketTypes: [
    { name: 'Regular', price: '₦5000' },
    { name: 'Uploor', price: '₦10,000' },
  ],
  locationInfo: {
    venue: 'Sample Venue, New York',
    map: 'https://www.google.com/maps/embed?pb=...'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com'
  },
  sponsors: [
    { name: 'Sponsor 1', logo: '/path/to/sponsor-logo.png' },
  ],
  gallery: [
    'https://img.freepik.com/free-photo/full-shot-people-enyoing-dinner-party_23-2150717857.jpg?t=st=1733975299~exp=1733978899~hmac=2eb5eb99bc82fa1bb9604b1a6b8e19d3f6135ebe2d9a2900aa323e2111793ab0&w=360',
    'https://img.freepik.com/free-photo/full-shot-people-enyoing-dinner-party_23-2150717857.jpg?t=st=1733975299~exp=1733978899~hmac=2eb5eb99bc82fa1bb9604b1a6b8e19d3f6135ebe2d9a2900aa323e2111793ab0&w=360',
    'https://img.freepik.com/free-photo/front-view-friends-enjoying-dinner-party_52683-132616.jpg?t=st=1733975361~exp=1733978961~hmac=a94a73676e517612ed100fea48eb8d1c7d63e2319cb98185a7ce9b01cbfeafdb&w=826',
  ],
  nearbyEvents: [
    { title: 'Concrete Party', date: 'June 20', price: '₦3000', image: '/phishing.png' },
    { title: 'Crossover Yib’s Party', date: 'June 25', price: '₦4000', image: '/anim2.png' },
  ],
};



const EventDetail = () => {
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const params = useParams();
  const eventId = params?.id;
  const ticketsSectionRef = useRef<HTMLDivElement | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  // const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  type Ticket = {
    name: string;
    price: string;
  };

  const handleGetTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket); 
    setShowTicketForm(true); 
  };

  const closeTicketForm = () => {
    setShowTicketForm(false);
    setSelectedTicket(null);
  };

  const scrollToTickets = () => {
    if (ticketsSectionRef.current) {
      ticketsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); 
  }, []);

  const copyLink = () => {
    const link = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(link);
    setToast({ type: 'success', message: `Event link copied: ${link}` });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div
      className="event-page-container text-gray-900 dark:text-gray-100 bg-white  dark:bg-gray-900">
      {loading && <Loader />}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* =================== && •HEADER SECTION• && =================== */}
      <header className="sticky top-0 z-10 shadow-xl">
        <nav className="flex justify-between items-center px-8 py-3 max-w-screen-xl mx-auto">
          <Link 
            href="/" 
            className="flex items-center text-gray-500 text-2xl font-bold"
          >
            <Image
              src="/logo.png"
              alt="Ticketly Logo"
              width={55} 
              height={55}
              className="mt-2"
            />
            <span className="ml-[-13px]">icketly</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-yellow-500">
              Home
            </Link>
            <Link href="/events" className="hover:text-yellow-500">
              Events
            </Link>
            <Link href="/contact" className="hover:text-yellow-500">
              Contact
            </Link>
            <ToggleMode />
            <button className="login-btn px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md">
              Login
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="text-gray-500 focus:outline-none"
            >
              {navOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
            </button>
          </div>
        </nav>

        {navOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-md absolute top-full left-0 w-full z-10">
            <div className="flex flex-col space-y-4 p-4">
              <Link href="/" className="hover:text-yellow-500" onClick={() => setNavOpen(false)}>
                Home
              </Link>
              <Link href="/events" className="hover:text-yellow-500" onClick={() => setNavOpen(false)}>
                Events
              </Link>
              <Link href="/contact" className="hover:text-yellow-500" onClick={() => setNavOpen(false)}>
                Contact
              </Link>
              <ToggleMode />
              <button className="login-btn px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md">
                Login
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =================== && •HERO SECTION• && =================== */}
      <div className="flex flex-col md:flex-row gap-8 px-6 py-8 md:px-16 md:py-16 bg-white dark:bg-gray-900 rounded-lg shadow-lg justify-between">

        <motion.div
          className="flex-1 h-[50vh]"
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h1>
          <p className="text-md text-gray-700 dark:text-gray-300">{event.location}</p>
          <p className="text-md text-gray-500 dark:text-gray-400 ">{event.date}</p>

          <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100 mt-6 relative">
            DESCRIPTION
            <span className="absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-yellow-500 via-pink-500 to-red-500 w-[4rem]"></span>
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>

          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mt-4 inline-block"
          >
            View Map
          </a>

          <div className="flex items-center gap-6 mt-6">
            <a
              href={event.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75"
            >
              <Image
                src="https://img.freepik.com/free-psd/instagram-application-logo_23-2151544104.jpg?t=st=1733901096~exp=1733904696~hmac=6a4176248e004838f0df19b826915cf64590b87363c6bdcee8b4ba5ea7298916&w=740"
                alt="Instagram"
                width={20}
                height={20}
                className="w-6 h-6 rounded-lg"
              />
            </a>
            <a
              href={event.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75"
            >
              <Image
                src="https://img.freepik.com/free-vector/twitter-new-logo-x-icon-design_1017-45424.jpg?t=st=1733901070~exp=1733904670~hmac=fad9836c4615d1785e75e8c42d0bdb24cc7113244515d7aae91a1fafc7833fe1&w=740"
                alt="Twitter"
                width={20}
                height={20}
                className="w-6 h-6 rounded-lg"
              />
            </a>
          </div>

          <Button
            variant="contained"
            sx={{
              mt: 4,
              px: 3,
              py: 1,
              background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
              ':hover': { background: 'linear-gradient(90deg, #e52e71, #ff8a00)' },      
            }}
            onClick={scrollToTickets}
          >
            View Tickets
          </Button>
        </motion.div>

        <motion.div
          className="flex-1 mt-8 md:mt-0 h-[50vh]"
          initial={{ opacity: 0, x: 30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1 }}
        >
          <div className="relative w-full h-64 md:h-80 rounded-lg shadow-lg overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-md"
            />
          </div>
        </motion.div>
      </div>

      {/* Event Host Section */}
      <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center px-4 md:px-10">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The event is hosted by: 
          <span className="text-gray-800 dark:text-gray-200 font-semibold"> {event.host}</span>
        </p>
        <div className="flex flex-col">

          <p className="text-gray-900 text-sm dark:text-gray-100 ml-3 p-2">Add To Calender</p>

          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {event.title}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {event.date}
            </span>
            <FiArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="mt-10 text-center px-4 md:px-10">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">LOCATION</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Powered by Google Maps <span className="text-blue-500">🌍</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {event.locationInfo.venue}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 italic mt-1">
          Note: You need to enable your location for you to enable the directions API
        </p>
        <iframe
          src={event.locationInfo.map}
          className="w-full h-64 mt-4 rounded-lg shadow-md border-0"
          loading="lazy"
        ></iframe>
      </div>

      {/* =================== && •TICKETS SECTION• && =================== */}
      <Box 
        ref={ticketsSectionRef} 
        sx={{ 
          textAlign: 'center', 
          mt: 8, 
          mb: 8, 
          px: 4, 
          py: 6 
        }}
       
      >
        <p className="text-black dark:text-white text-2xl mb-8 relative text-center">
          Tickets
          <span className="absolute left-1/2 bottom-0 translate-x-[-50%] h-[2px] bg-gradient-to-r from-yellow-500 via-pink-500 to-red-500 w-[4rem]"></span>
        </p>

        <Grid 
          container 
          gap={2} 
          justifyContent="center"
          sx={{ maxWidth: 1200, mx: 'auto' }}
        >
          {event.ticketTypes.map((ticket, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box 
                sx={{
                  background: "url('https://img.freepik.com/free-vector/bokeh-lights-effect-dark-wallpaper-concept_23-2148442903.jpg?t=st=1733974253~exp=1733977853~hmac=fdc31bd4f339df066f217471c32f13b676e6a74e8238c627d75c5c33a86dd80a&w=740')",
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  backgroundRepeat: 'no-repeat',
                  color: 'white',
                  borderRadius: 2,
                  p: 3,
                  position: 'relative',
                  // boxShadow: '0 8px 15px rgba(0, 0, 0, 0.95)',
                  overflow: 'hidden',
                  clipPath: 'polygon(5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%, 0% 10%)',
                  }}
                  className="shadow-[0_10px_25px_rgba(0,0,0,0.5)] dark:shadow-[0_8px_15px_rgba(255,255,255,0.2)]"
                >
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ mb: 2 }}
                >
                  {ticket.name}
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  sx={{ mb: 3 }}
                >
                  {ticket.price}
                </Typography>
                <Button 
                variant="contained" 
                sx={{ 
                  mt: 3, 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 20, 
                  background: 'linear-gradient(90deg, #ff8a00, #e52e71)', 
                  ':hover': { background: 'linear-gradient(90deg, #e52e71, #ff8a00)' } 
                }}
                onClick={() => handleGetTicket(ticket)}
              >
                Get Ticket
              </Button>
                <Box 
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: '#ffd700',
                    position: 'absolute',
                    top: '10%',
                    left: -10,
                    borderRadius: '50%',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                  }}
                ></Box>
                <Box 
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: '#ffd700',
                    position: 'absolute',
                    bottom: '10%',
                    left: -10,
                    borderRadius: '50%',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                  }}
                ></Box>
                <Box 
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: '#ffd700',
                    position: 'absolute',
                    top: '10%',
                    right: -10,
                    borderRadius: '50%',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                  }}
                ></Box>
                <Box 
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: '#ffd700',
                    position: 'absolute',
                    bottom: '10%',
                    right: -10,
                    borderRadius: '50%',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                  }}
                ></Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>   

      {/* ================ && •TICKET TYPE FORM MODAL• && ================== */}
      {showTicketForm && selectedTicket && (
        <TicketTypeForm
          ticket={selectedTicket}
          closeForm={closeTicketForm}
          setToast={setToast}  
        />
      )}

 

      {/* =================== && •COPY EVENT LINK SECTION• && =================== */}
      <Box className="relative p-8 text-center">
      
        <motion.h5
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl font-bold mb-4"
        >
          Share the Excitement!
        </motion.h5>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gray-600 dark:text-gray-300 mb-6"
        >
          Let others know about this amazing event. Click below to copy the event link and spread the word!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Button
            onClick={copyLink}
            startIcon={<ContentCopyIcon />}
            variant="outlined"
            size="large"
            className="px-6 py-2 font-semibold rounded-full border border-gray-400 hover:border-gray-600 transition-all"
          >
            Copy Event Link
          </Button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute top-5 left-5 w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"
        ></motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600"
        ></motion.div>
      </Box>

      {/* =================== && •GALLERY SECTION• && =================== */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mt: 5, 
          mb: 8, 
          px: 4 
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Gallery
        </Typography>

        <div className = "flex justify-center center gap-4 flex-wrap">
          {event.gallery.map((img, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index} 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: 2, 
              }}
              
            >
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Image 
                  src={img} 
                  alt={`Gallery ${index + 1}`} 
                  width={350} 
                  height={300}
                  className ="h-[50vh] " 
                  style={{ 
                    borderRadius: '8px', 
                    objectFit: 'cover', 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }} 
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </motion.div>
            </Grid>
          ))}
        </div>
      </Box>


      {/* =================== && •NEARBY EVENTS SECTION• && =================== */}
      {/* <Box 
        sx={{ 
          textAlign: 'center', 
          mt: 5, 
          mb: 8, 
          px: 2 
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          sx={{ 
            mb: 3, 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}
        >
          Nearby Events
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {event.nearbyEvents.map((nearbyEvent, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index} 
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card 
                sx={{ 
                  // maxWidth: 245, 
                  width: 300,
                  height: 350,
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  ':hover': { 
                    transform: 'scale(1.05)', 
                    boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.15)' 
                  },
                }}
              >
                <Image
                  src={nearbyEvent.image}
                  alt={nearbyEvent.title}
                  width={300}
                  height={200}
                  style={{
                    objectFit: 'cover',
                    height: '200px',
                    width: '100%',
                  }}
                />
                <CardContent sx={{ textAlign: 'center', padding: 2 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    sx={{ 
                      mb: 1, 
                      color: 'text.primary', 
                      textTransform: 'capitalize' 
                    }}
                  >
                    {nearbyEvent.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 1 }}
                  >
                    {nearbyEvent.date}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold" 
                    sx={{ 
                      color: 'primary.main', 
                      mb: 2 
                    }}
                  >
                    {nearbyEvent.price}
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      px: 3, 
                      py: 1, 
                      borderRadius: '20px', 
                      background: 'linear-gradient(90deg, #6A5ACD, #7B68EE)',
                      ':hover': { 
                        background: 'linear-gradient(90deg, #7B68EE, #6A5ACD)' 
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box> */}


      {/* =================== && •FOOTER SECTION• && =================== */}
      <footer style={{
        backgroundColor: '#333', 
        color: '#fff', 
        padding: '3rem 2rem', 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        borderTop: '1px solid #444'
      }}>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p style={{ fontSize: '14px', marginBottom: '2rem' }}>
            &copy; 2024 EventHost. All Rights Reserved.
          </p>
        </motion.div>

        {/* Social Media Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1rem' }}>Follow Us</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <motion.a
              href={event.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                color: '#4267B2', 
                fontSize: '1.5rem',
                transition: 'color 0.3s ease',
              }}
            >
              <Facebook />
            </motion.a>
            
            <motion.a
              href={event.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                color: '#1DA1F2',
                fontSize: '1.5rem',
                transition: 'color 0.3s ease',
              }}
            >
              <Twitter />
            </motion.a>
            
            <motion.a
              href={event.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                color: '#C13584',
                fontSize: '1.5rem',
                transition: 'color 0.3s ease',
              }}
            >
              <Instagram />
            </motion.a>
          </div>
        </motion.div>
        
        {/* Optional Decorative Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            position: 'absolute', 
            bottom: '10px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '100px', 
            height: '5px', 
            background: '#f8b400', 
            borderRadius: '10px'
          }}
        />
      </footer>

    </div>
  );
};

export default EventDetail;
