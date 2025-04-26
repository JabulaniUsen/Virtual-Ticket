// UTILS/VIRTUAL-EVENTS.TS
interface GenerateVirtualLinkParams {
    eventId: string;
    platform: 'google-meet' | 'zoom' | 'whereby' | 'custom';
    meetingId?: string;
    meetingUrl?: string;
  }
  
  export const generateVirtualLink = ({
    eventId,
    platform,
    meetingId,
    meetingUrl
  }: GenerateVirtualLinkParams): string => {
    switch(platform) {
      case 'google-meet':
        // IN A REAL IMPLEMENTATION, YOU WOULD CALL YOUR BACKEND TO CREATE A REAL GOOGLE MEET
        return `https://meet.google.com/new?authuser=0`;
        
      case 'zoom':
        if (!meetingId) throw new Error('Zoom meeting ID is required');
        return `https://zoom.us/j/${meetingId}`;
        
      case 'whereby':
        // IN A REAL IMPLEMENTATION, YOU WOULD CALL WHEREBY API TO CREATE A ROOM
        return `https://whereby.com/${eventId}`;
        
      case 'custom':
        if (!meetingUrl) throw new Error('Custom meeting URL is required');
        return meetingUrl;
        
      default:
        throw new Error('Unsupported virtual platform');
    }
  };
  
  export const validateVirtualEvent = (event: {
    isVirtual: boolean;
    virtualEventDetails?: {
      platform?: 'google-meet' | 'zoom' | 'whereby' | 'custom';
      meetingUrl?: string;
      meetingId?: string;
    };
  }): boolean => {
    if (!event.isVirtual) return false;
    
    const platform = event.virtualEventDetails?.platform;
    
    if (!platform) return false;
    
    if (platform === 'custom' && !event.virtualEventDetails?.meetingUrl) {
      return false;
    }
    
    if (platform === 'zoom' && !event.virtualEventDetails?.meetingId) {
      return false;
    }
    
    return true;
  };