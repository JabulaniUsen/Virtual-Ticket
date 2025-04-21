
export type EventFormData = {
    id?: string;
    title: string;
    slug?: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    hostName: string;
    image: File | null;
    gallery: File[];
    ticketType: {
      name: string;
      price: string;
      quantity: string;
      sold: string;
      details: string;
      attendees?: { name: string; email: string; }[];
    }[];
    socialMediaLinks?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    currency?: string;
    isVirtual: boolean; // NEW FIELD
    virtualEventDetails?: { //NEW FEATURE
      platform?: 'google-meet' | 'zoom' | 'whereby' | 'custom';
      meetingUrl?: string;
      meetingId?: string;
      passcode?: string;
      virtualPassword?: string; // NEW FIELD FOR GLOBAL VIRTUAL PASSWORD.
      requiresPassword?: boolean; // NEW FIELD TO TOGGLE PASSWORD REUIREMENTS.
      // WHEREBY SPECIFIED FIELDS
      enableWaitingRoom?: boolean;
      lockRoom?: boolean;
    };
  };


  export type Event = {
    id?: string;
    title: string;
    slug?: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    hostName: string;
    image: string;
    gallery: File[];
    ticketType: {
      name: string;
      price: string;
      quantity: string;
      sold: string;
      details?: string;
      attendees?: { name: string; email: string }[];
    }[];
    socialMediaLinks?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    currency?: string;
    isVirtual: boolean; // NEW FIELD
    virtualEventDetails?: { //NEW FEATURE
      platform?: 'google-meet' | 'zoom' | 'whereby' | 'custom';
      meetingUrl?: string;
      meetingId?: string;
      passcode?: string;
      virtualPassword?: string; // NEW FIELD FOR GLOBAL VIRTUAL PASSWORD.
      requiresPassword?: boolean; // NEW FIELD TO TOGGLE PASSWORD REUIREMENTS.
      // WHEREBY SPECIFIED FIELDS
      enableWaitingRoom?: boolean;
      lockRoom?: boolean;
    };
  };

  export interface Ticket {
    name: string;
    price: string;
    quantity: string;
    sold: string;
    details?: string;
    attendees?: { name: string; email: string }[];
  }
  
  export interface ToastProps {
    type: 'error' | 'success';
    message: string;
    onClose: () => void;
  }