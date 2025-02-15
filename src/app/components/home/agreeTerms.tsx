import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface AgreeTermsProps {
  onClose: () => void;
}

const AgreeTerms: React.FC<AgreeTermsProps> = ({ onClose }) => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using V-Tickets, you agree to be legally bound by these Terms of Service. Continued use constitutes irrevocable acceptance. If you disagree with any provision, you must immediately cease all use of the platform."
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg sm:rounded-xl shadow-lg w-full max-w-5xl overflow-y-auto max-h-[96vh] sm:max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Terms of Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <p className="text-sm mt-2">{section.content}</p>
            {section.subpoints && (
              <ul className="list-disc pl-5 mt-2">
                {section.subpoints.map((point, subIndex) => (
                  <li key={subIndex} className="text-sm">{point}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-600 mb-4">
            By clicking &quot;Accept & Continue&quot;, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. This agreement constitutes a legally binding document between you and V-Tickets.
          </p>
          <button 
            onClick={onClose} 
            className="w-full md:w-auto py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Accept & Continue
          </button>
        </div>
      </div>


    </div>
  );
};

export default AgreeTerms;