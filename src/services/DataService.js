/**
 * Data Service
 * Manages all event data using LocalStorage
 */

const STORAGE_KEY = 'event_attendees';

const getAttendees = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveAttendees = (attendees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
};

export const DataService = {
  // 1. Logic for Dashboard/Admin
  getAll: () => {
    const list = getAttendees();
    return {
      total: list.length,
      checkedIn: list.filter(a => a.hasCheckedIn).length,
      attendees: list 
    };
  },

  // 2. Individual Registration
  register: (newAttendee) => {
    const attendees = getAttendees();
    const exists = attendees.find(a => a.phone === newAttendee.phone);
    if (exists) {
      return { success: false, message: 'This phone number is already registered.' };
    }
    const attendeeRecord = {
      ...newAttendee,
      id: Math.random().toString(36).substr(2, 9),
      hasCheckedIn: false, // Default to false for registration
      registeredAt: new Date().toISOString()
    };
    saveAttendees([...attendees, attendeeRecord]);
    return { success: true, data: attendeeRecord };
  },

  // 3. Group/Institution Registration
  registerGroup: (groupData) => {
    const attendees = getAttendees();
    const groupRecord = {
      ...groupData,
      id: 'GRP-' + Math.random().toString(36).substr(2, 9),
      isGroup: true,
      hasCheckedIn: false,
      registeredAt: new Date().toISOString()
    };
    saveAttendees([...attendees, groupRecord]);
    return { success: true, data: groupRecord };
  },

  // 4. Check-In Logic
  checkIn: (phone) => {
    const attendees = getAttendees();
    const index = attendees.findIndex(a => a.phone === phone);
    if (index === -1) return { success: false, message: 'Attendee not found.' };
    
    attendees[index].hasCheckedIn = true;
    saveAttendees(attendees);
    return { success: true, data: attendees[index] };
  },

  getStats: () => DataService.getAll(),

  // 5. Setup & Event Configuration (DYNAMIC FIELD COMPATIBLE)
  saveConfig: (config) => {
    localStorage.setItem('event_config', JSON.stringify(config));
  },

  getConfig: () => {
    const cfg = localStorage.getItem('event_config');
    
    // Default structure for a professional setup
    const baseDefaults = { 
      name: 'IYES 2026', 
      location: '', 
      startDate: '', 
      endDate: '',
      description: '',
      capacity: 1000,
      regMode: { preReg: true, onSite: true },
      linkExpiry: '', 
      flyer: null,
      allowGroups: true,
      pin: '0000',
      // This is where your typed fields live!
      customFields: [
        { id: '1', label: 'Email Address' },
        { id: '2', label: 'Location' }
      ],
      successMsg: 'Registration Successful!'
    };

    if (!cfg) return baseDefaults;
    
    const parsed = JSON.parse(cfg);
    // Return saved data but ensure customFields exists to prevent crashes
    return { 
      ...baseDefaults, 
      ...parsed,
      customFields: parsed.customFields || baseDefaults.customFields 
    };
  },

  // 6. User Profile Logic
  saveUserProfile: (profile) => {
    localStorage.setItem('admin_profile', JSON.stringify(profile));
  },

  getUserProfile: () => {
    const profile = localStorage.getItem('admin_profile');
    return profile ? JSON.parse(profile) : { 
      name: 'Admin User', 
      email: 'admin@eventpro.com', 
      avatar: null,
      role: 'Event Organizer'
    };
  }
};