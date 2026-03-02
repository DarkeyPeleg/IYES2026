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
      hasCheckedIn: true, 
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
      hasCheckedIn: true,
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

  // 5. Setup & Event Configuration (CRASH-PROOF VERSION)
  saveConfig: (config) => {
    localStorage.setItem('event_config', JSON.stringify(config));
  },

  getConfig: () => {
    const cfg = localStorage.getItem('event_config');
    const defaultFields = { email: true, gender: true, location: true };
    
    if (!cfg) {
      return { 
        name: 'IYES 2026', 
        location: '', 
        dateTime: '', 
        description: '',
        allowGroups: true,
        pin: '0000',
        fields: defaultFields,
        successMsg: 'Registration Successful!'
      };
    }

    const parsed = JSON.parse(cfg);

    // DEFENSIVE RETURN: Merges old data with new structure to prevent "undefined" errors
    return {
      name: parsed.name || 'IYES 2026',
      location: parsed.location || '',
      dateTime: parsed.dateTime || '',
      description: parsed.description || '',
      allowGroups: parsed.allowGroups ?? true,
      pin: parsed.pin || '0000',
      successMsg: parsed.successMsg || 'Registration Successful!',
      fields: parsed.fields || defaultFields // This prevents the crash
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
  },

  // 7. Security Updates
  updatePassword: (newPassword) => {
    const profile = DataService.getUserProfile();
    profile.password = newPassword; 
    DataService.saveUserProfile(profile);
    return { success: true };
  },

  updateEventPin: (newPin) => {
    const config = DataService.getConfig();
    config.pin = newPin;
    DataService.saveConfig(config);
    return { success: true };
  },

getConfig: () => {
  const cfg = localStorage.getItem('event_config');
  const defaultFields = { email: true, gender: true, location: true };
  
  const baseDefaults = { 
    name: 'IYES 2026', 
    location: '', 
    dateTime: '', 
    description: '',
    regMode: 'event', // 'pre-registration' or 'event registration'
    linkExpiry: '', 
    flyer: null,
    allowGroups: true,
    pin: '0000',
    fields: defaultFields,
    successMsg: 'Registration Successful!'
  };

  if (!cfg) return baseDefaults;
  const parsed = JSON.parse(cfg);
  return { ...baseDefaults, ...parsed }; // Merges existing data with new keys
},
};