"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Header from '@/app/components/home/Header'
import Footer from '@/app/components/home/Footer'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div>
        <Header />
        {children}
        <Footer />
    </motion.div>
  )
}

export default Layout










