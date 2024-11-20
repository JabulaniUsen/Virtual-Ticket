import React, { useState } from 'react';
import Profile from './settings/Profile';
import Password from './settings/Password';
import Notifications from './settings/Notification';


const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='flex flex-col lg:ml-10 md:ml-10 sm:ml-0 max-w-full lg:p-6 sm:p-2 h-full '>
   
      <div className='mb-6 text-xl font-bold'>Settings</div>


      <div className='flex space-x-4'>
        <button
          className={`relative group flex items-center justify-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
            activeTab === 0
              ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab(0)}
        >
          Profile
        </button>
        <button
          className={`relative group flex items-center justify-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
            activeTab === 1
              ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab(1)}
        >
          Passwords
        </button>
        <button
          className={`relative group flex items-center justify-center space-x-2 py-2 px-4 transition-all duration-300 rounded-lg ${
            activeTab === 2
              ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab(2)}
        >
          Notifications
        </button>
      </div>

      {/* Tab content */}
      <div className='mt-6'>
        {activeTab === 0 && < Profile /> }
        {activeTab === 1 && < Password /> }
        {activeTab === 2 && <Notifications />}
      </div>
    </div>
  );
};

export default Settings;



// {activeTab === 0 && <Profile />}
// {activeTab === 1 && <Password />}
// {activeTab === 2 && <Notifications />}
// {activeTab === 3 && <PaymentMethods />}
// {activeTab === 4 && <MyTickets />}
// {activeTab === 5 && <Privacy />}
// {activeTab === 6 && <ConnectedApps />}
// {activeTab === 7 && <HelpAndSupport />}


