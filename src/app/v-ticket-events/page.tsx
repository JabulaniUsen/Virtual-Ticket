'use client';

import React, { useState, useEffect } from 'react'; 
import Loader from '@/components/ui/loader/Loader';
import AllEvents from '@/app/components/home/AllEvents';
import Layout from '@/components/Layout/Layout';
import LatestEvent from '../components/home/LatestEvent';

const Events = () => {  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {loading && <Loader />}
     
     
        <AllEvents />

        <LatestEvent />

    </Layout>
  );
};

export default Events;