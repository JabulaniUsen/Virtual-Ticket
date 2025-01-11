import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface EventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (sellTickets: boolean) => void;
}

const EventTypeModal = ({ isOpen, onClose, onSelectType }: EventTypeModalProps) => {
  const [loading, setLoading] = useState<'paid' | 'free' | null>(null);

  const handleSelection = async (sellTickets: boolean) => {
    setLoading(sellTickets ? 'paid' : 'free');
    await onSelectType(sellTickets);
    setLoading(null);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 text-left align-middle shadow-lg transition-all">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <IoClose className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-red-600" />
            </button>

            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Event
            </Dialog.Title>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Would you like to sell tickets for this event?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleSelection(true)}
                disabled={loading !== null}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg 
                          hover:bg-opacity-90 hover:backdrop-blur-md transition-all hover:shadow-lg 
                          hover:shadow-blue-500/50 hover:bg-gradient-to-r from-blue-600 to-blue-400 disabled:opacity-50"
              >
                {loading === 'paid' ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                  </div>
                ) : (
                  'Yes, Sell Tickets'
                )}
              </button>
              <button
                onClick={() => handleSelection(false)}
                disabled={loading !== null}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg 
                          hover:bg-opacity-90 hover:backdrop-blur-md transition-all hover:shadow-lg 
                          hover:shadow-gray-500/50 hover:bg-gradient-to-r from-gray-600 to-gray-400 disabled:opacity-50"
              >
                {loading === 'free' ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                  </div>
                ) : (
                  'No, Free Event'
                )}
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EventTypeModal;