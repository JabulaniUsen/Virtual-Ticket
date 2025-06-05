import React, { useState } from 'react';
import { Ticket } from '@/types/analytics';
import { FiUserCheck, FiUserX, FiChevronLeft, FiChevronRight, FiDollarSign } from 'react-icons/fi';

interface AttendeesTableProps {
  tickets: Ticket[];
}

export const AttendeesTable: React.FC<AttendeesTableProps> = ({ tickets }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Sort tickets by payment status before filtering
  const sortedTickets = [...tickets].sort((a, b) => {
    // Paid tickets come first (true = 1, false = 0)
    return (Number(b.paid) - Number(a.paid));
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Add payment filter controls above the table
  // const PaymentFilter = () => (
  //   <div className="mb-4 flex items-center gap-2">
  //     <span className="text-sm text-gray-500 dark:text-gray-400">Payment Status:</span>
  //     <select
  //       value={paymentFilter}
  //       onChange={(e) => {
  //         setPaymentFilter(e.target.value as 'all' | 'paid' | 'unpaid');
  //         setCurrentPage(1); // Reset to first page when filter changes
  //       }}
  //       className="text-sm rounded-md border border-gray-300 dark:border-gray-600 
  //                  bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
  //                  px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //     >
  //       <option value="all">All</option>
  //       <option value="paid">Paid</option>
  //       <option value="unpaid">Unpaid</option>
  //     </select>
  //   </div>
  // );

  return (
    <div className="space-y-4">
      {/* <PaymentFilter /> */}
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
                  Payment
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {currentTickets.map((ticket) => (
                <React.Fragment key={ticket.id}>
                  <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                    ${!ticket.paid ? 'opacity-60' : 'opacity-100'}`}>
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
                          {/* Only show sub-attendees if there are additional attendees beyond the main ticket */}
                          {/* {ticket.attendees.length > 0 && (
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
                          )} */}
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${ticket.paid 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                          <FiDollarSign className="mr-1" />
                          {ticket.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {ticket.isScanned ? (
                          <>
                            <FiUserCheck className="text-green-500 mr-1" />
                            <span className="text-sm text-green-600 dark:text-green-400">Scanned</span>
                          </>
                        ) : (
                          <>
                            <FiUserX className="text-red-500 mr-1" />
                            <span className="text-sm text-red-600 dark:text-red-400">Not scanned</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Only show sub-attendees if they exist */}
                    {/* {hasAdditionalAttendees && ticket.attendees.map((attendee) => (
                      <tr key={`${ticket.id}-${attendee.email}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-800">
                        <td className="px-4 sm:px-6 py-4 pl-14">
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
                                <span className="text-xs text-green-600 dark:text-green-400">Scanned</span>
                              </>
                            ) : (
                              <>
                                <FiUserX className="text-red-500 mr-1" />
                                <span className="text-xs text-red-600 dark:text-red-400">Not scanned</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))} */}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, tickets.length)}
              </span>{' '}
              of <span className="font-medium">{tickets.length}</span> results
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 disabled:opacity-50 
                       disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 
                       transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-md border ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  } transition-colors`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 disabled:opacity-50 
                       disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 
                       transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};