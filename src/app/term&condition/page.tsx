'use client';
import { useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TermsAndConditionsPage = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using V-Tickets, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services."
    },
    {
      title: "2. User Registration",
      content:
        "Users must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
    },
    {
      title: "3. Event Creation and Ticket Sales",
      content:
        "Event organizers are responsible for the accuracy of event details and ticket pricing. V-Tickets reserves the right to remove events that violate our policies or contain inappropriate content."
    },
    {
      title: "4. Payment and Refunds",
      content:
        "All payments are processed securely through our platform. Refund policies are set by event organizers, and V-Tickets acts only as a facilitator in the refund process."
    },
    {
      title: "5. Virtual Tickets and QR Codes",
      content:
        "Digital tickets and QR codes are unique to each purchase and should not be shared or duplicated. V-Tickets is not responsible for any unauthorized ticket sharing or duplication."
    },
    {
      title: "6. Privacy and Data Protection",
      content:
        "We collect and process personal data in accordance with our Privacy Policy. By using V-Tickets, you consent to our data collection and processing practices."
    },
    {
      title: "7. Intellectual Property",
      content:
        "All content on V-Tickets, including logos, designs, and software, is protected by intellectual property rights and may not be used without our express permission."
    },
    {
      title: "8. Platform Availability",
      content:
        "While we strive to maintain platform availability, V-Tickets does not guarantee uninterrupted access to our services and is not liable for any system downtime or technical issues."
    },
    {
      title: "9. Limitation of Liability",
      content:
        "V-Tickets shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our services."
    },
    {
      title: "10. Modifications to Terms",
      content:
        "V-Tickets reserves the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of modified terms."
    },
    {
      title: "11. CONTACT INFORMATION",
      content: <>Questions about these Terms of Service should be sent to us at <a href="mailto:support@vtickets.site" className="text-blue-500 underline">support@vtickets.site</a></>
    }
  ];

  // Animation variant for sections
  const sectionVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  interface SectionProps {
    title: string;
    content: string | React.ReactElement;
    index: number;
  }

  const SectionComponent = ({ title, content }: SectionProps) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
      threshold: 0.2,
      triggerOnce: true
    });

    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={sectionVariant}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <h2 className="text-lg md:text-xl font-semibold border-b-2 border-gray-200 dark:border-gray-700 pb-2 mt-4">
          {title}
        </h2>
        <p className="text-sm md:text-base mt-3 leading-relaxed">
          {content}
        </p>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-300">
      <div
          className="container sm:max-w-6xl mx-auto w-full p-5"
          style={{
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.75)' ,
          }}
        >
        {/* <div className="container mx-auto p-5 max-w-5xl"> */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-center text-2xl md:text-3xl mb-5 font-bold">
              Terms of Service
            </h1>
            <h2 className="text-center text-lg md:text-xl border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-3">
              Terms of Service for V‑Tickets
            </h2>
            <p className="text-center text-sm md:text-base mb-8">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {sections.map((section, index) => (
            <SectionComponent
              key={index}
              title={section.title}
              content={section.content}
              index={index}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditionsPage;
