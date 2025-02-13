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
        "By accessing or using V-Tickets, you agree to be legally bound by these Terms and Conditions. Continued use constitutes irrevocable acceptance. If you disagree with any provision, you must immediately cease all use of the platform."
    },
    {
      title: "2. User Registration & Eligibility",
      content:
        "Users must be at least 18 years old and provide accurate, verifiable information. You are solely liable for all activities under your account, including unauthorized access. V-Tickets reserves the right to suspend accounts with suspicious activity."
    },
    {
      title: "3. Event Creation & Organizer Obligations",
      content:
        "Organizers guarantee the legality, accuracy, and appropriateness of event details. Prohibited events include but are not limited to: illegal activities, hate speech, or adult content. V-Tickets may remove events without notice and withhold earnings for policy violations."
    },
    {
      title: "4. Commission Structure & Fees",
      content:
        "A 10% commission fee will be automatically deducted from the total ticket sales revenue for events exceeding 5000 attendees. This threshold-based commission is non-negotiable and applies to all events hosted on V-Tickets. Organizers agree to:",
      subpoints: [
        "Commission calculation based on total ticket sales (e.g., 10% of $10,000 revenue = $1,000 fee)",
        "Real-time dashboard monitoring of attendance thresholds",
        "No fee exemptions regardless of event type or organizer status",
        "Fee deductions before earnings remittance to organizer accounts"
      ]
    },
    {
      title: "5. Payments, Fees & Refunds",
      content:
        "All transactions are final unless otherwise stated by the organizer. V-Tickets charges a non-refundable service fee (3-5% per transaction, disclosed at checkout) in addition to commission fees. Refunds are solely the organizer's responsibility. Chargebacks or payment disputes may result in account suspension.",
    },
    {
      title: "6. Digital Tickets & QR Code Validation",
      content:
        "Tickets are non-transferable unless explicitly allowed by the organizer. QR codes are cryptographically secured and valid only once. Duplication, resale, or fraudulent use voids the ticket. V-Tickets bears no liability for counterfeit tickets or unauthorized resales."
    },
    {
      title: "7. Data Privacy & Security",
      content:
        "User data is processed per our Privacy Policy and applicable laws. We may share data with organizers for event management but are not responsible for their misuse. By using V-Tickets, you consent to transactional and security-related communications."
    },
    {
      title: "8. Intellectual Property",
      content:
        "All platform content (code, designs, trademarks) is owned by V-Tickets or licensors. Organizers retain ownership of event content but grant V-Tickets a global, royalty-free license to display and distribute it for operational purposes."
    },
    {
      title: "9. Service Availability & Disclaimers",
      content:
        "V-Tickets is provided 'as is' without warranties of merchantability, fitness, or accuracy. We reserve the right to modify, suspend, or terminate services without liability, including for maintenance, security, or force majeure events."
    },
    {
      title: "10. Limitation of Liability",
      content:
        "In no event shall V-Tickets’ liability exceed the total fees paid by the user in the preceding 12 months. We exclude liability for indirect, consequential, or punitive damages, including event cancellations, attendee injuries, or organizer misconduct."
    },
    {
      title: "11. Modifications & Governing Law",
      content:
        "Terms may be updated at any time, with material changes notified via email or in-app alerts. Continued use after 30 days constitutes acceptance. Disputes are governed by the laws of [Your Jurisdiction], with exclusive jurisdiction in [Your Court Location]."
    },
    {
      title: "12. Termination & Enforcement",
      content:
        "V-Tickets may terminate access for breaches of these terms, with or without notice. Organizers forfeit unpaid earnings upon termination for violations. Surviving clauses include Liability, IP, and Dispute Resolution."
    },
    {
      title: "13. Contact & Dispute Resolution",
      content: <>For disputes, contact us at <a href="mailto:support@vtickets.site" className="text-blue-500 underline">support@vtickets.site</a> within 30 days of the issue. Failure to resolve amicably may lead to binding arbitration in [Your Jurisdiction], waiving class-action rights.</>
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
    subpoints?: string[];
  }

  const SectionComponent = ({ title, content, subpoints }: SectionProps) => {
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
        <p className="text-sm md:text-base mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
          {content}
        </p>
        {subpoints && (
          <ul className="mt-4 space-y-2 pl-6 list-disc text-gray-600 dark:text-gray-400">
            {subpoints.map((point, index) => (
              <li key={index} className="text-sm md:text-base">
                {point}
              </li>
            ))}
          </ul>
        )}
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
              subpoints={section.subpoints}
              index={index}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditionsPage;
