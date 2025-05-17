import React from 'react';
import { Ticket } from '@/types/analytics';
import { FiUserCheck, FiUserX } from 'react-icons/fi';

interface AttendeesTableProps {
  tickets: Ticket[];
}

export const AttendeesTable: React.FC<AttendeesTableProps> = ({ tickets }) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Attendee
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ticket
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.map((ticket) => {
            // Only show sub-attendees if there are additional attendees beyond the main ticket
            const hasAdditionalAttendees = ticket.attendees.length > 0;
            
            return (
              <React.Fragment key={ticket.id}>
                {/* Main ticket holder row */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300">
                          {ticket.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {ticket.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {ticket.email}
                        </div>
                        {hasAdditionalAttendees && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-xs text-yellow-600 dark:text-yellow-400 hover:underline">
                              +{ticket.attendees.length} additional guest{ticket.attendees.length !== 1 ? 's' : ''}
                            </summary>
                            <ul className="pl-4 mt-1 space-y-1">
                              {ticket.attendees.map((attendee) => (
                                <li key={attendee.email} className="text-xs text-gray-600 dark:text-gray-300">
                                  {attendee.name} • {attendee.email}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      {ticket.ticketType}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ticket.purchaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {ticket.isScanned ? (
                        <>
                          <FiUserCheck className="text-green-500 mr-1" />
                          <span className="text-sm text-green-600 dark:text-green-400">Checked In</span>
                        </>
                      ) : (
                        <>
                          <FiUserX className="text-red-500 mr-1" />
                          <span className="text-sm text-red-600 dark:text-red-400">Pending</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Only show sub-attendees if they exist */}
                {hasAdditionalAttendees && ticket.attendees.map((attendee) => (
                  <tr key={`${ticket.id}-${attendee.email}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-800">
                    <td className="px-4 sm:px-6 py-4 pl-14"> {/* Extra padding to indent */}
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-600 dark:text-gray-300 text-xs">
                            {attendee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {attendee.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {attendee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {ticket.ticketType}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(ticket.purchaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {ticket.isScanned ? (
                          <>
                            <FiUserCheck className="text-green-500 mr-1" />
                            <span className="text-xs text-green-600 dark:text-green-400">Checked In</span>
                          </>
                        ) : (
                          <>
                            <FiUserX className="text-red-500 mr-1" />
                            <span className="text-xs text-red-600 dark:text-red-400">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);