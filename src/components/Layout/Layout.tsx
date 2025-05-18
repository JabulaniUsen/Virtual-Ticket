"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Header from '@/app/components/home/Header'
import Footer from '@/app/components/home/Footer'
// import Chatbot from '../Chatbot/chatbot'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div>
        <Header />
        {children}
        {/* <Chatbot /> */}
        <Footer />
    </motion.div>
  )
}

export default Layout










