import React, { useState } from 'react';

type NotificationSettings = {
  ticketSales?: boolean;
  attendeeReminders?: boolean;
  eventUpdates?: boolean;
  ticketPurchase?: boolean;
  eventReminders?: boolean;
};

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState<NotificationSettings>({
    ticketPurchase: false,
    eventReminders: false,
    eventUpdates: false,
  });

  const [smsNotifications, setSmsNotifications] = useState<NotificationSettings>({
    ticketPurchase: false,
    eventReminders: false,
    eventUpdates: false,
  });

  const [hostNotifications, setHostNotifications] = useState<NotificationSettings>({
    ticketSales: false,
    attendeeReminders: false,
    eventUpdates: false,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>,
    notifications: NotificationSettings
  ) => {
    const { name, checked } = event.target;
    setNotifications({
      ...notifications,
      [name]: checked,
    });
  };

  const sections = [
    {
      title: 'Email Notifications',
      description: 'Choose which events you want to be notified about via email.',
      settings: emailNotifications,
      setSettings: setEmailNotifications,
      notificationTypes: ['ticketPurchase', 'eventReminders', 'eventUpdates'],
    },
    {
      title: 'SMS Notifications',
      description: 'Choose which events you want to be notified about via SMS.',
      settings: smsNotifications,
      setSettings: setSmsNotifications,
      notificationTypes: ['ticketPurchase', 'eventReminders', 'eventUpdates'],
    },
    {
      title: 'Host Notifications',
      description:
        'Enable notifications for ticket sales and attendee reminders for event organizers.',
      settings: hostNotifications,
      setSettings: setHostNotifications,
      notificationTypes: ['ticketSales', 'attendeeReminders', 'eventUpdates'],
    },
  ];

  return (
    <div className="flex flex-col items-start justify-start p-6 bg-gray-100 dark:bg-gray-900 h-full">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Notification Settings</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Manage your notification preferences. Choose how you would like to stay updated on ticketing events and notifications.
      </p>

      {sections.map((section) => (
        <div
          key={section.title}
          className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 dark:text-white">{section.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{section.description}</p>
          <div className="space-y-4">
            {section.notificationTypes.map((notificationType) => (
              <div className="flex justify-between items-center" key={notificationType}>
                <label className="text-sm dark:text-gray-300 capitalize">
                  {notificationType.replace(/([A-Z])/g, ' $1')}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name={notificationType}
                    checked={section.settings[notificationType as keyof NotificationSettings]}
                    onChange={(e) => handleChange(e, section.setSettings, section.settings)}
                    className="hidden"
                  />
                  <span
                    className={`toggle-line w-12 h-6 rounded-full transition-all duration-300 ${
                      section.settings[notificationType as keyof NotificationSettings]
                        ? 'bg-blue-600'
                        : 'bg-gray-400'
                    }`}
                  ></span>
                  <span
                    className={`toggle-dot absolute w-5 h-5 bg-white rounded-full left-1 top-1 shadow transform transition-transform duration-300 ${
                      section.settings[notificationType as keyof NotificationSettings]
                        ? 'translate-x-6'
                        : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={(e) => {
          e.preventDefault();
          console.log('Email Notifications: ', emailNotifications);
          console.log('SMS Notifications: ', smsNotifications);
          console.log('Host Notifications: ', hostNotifications);
        }}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        Save Notification Settings
      </button>
    </div>
  );
};

export default Notifications;
