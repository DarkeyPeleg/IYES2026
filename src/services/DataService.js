/**
 * Data Service
Backend Structure: Event > Fields > Options
 */

const STORAGE_KEY = 'event_attendees';
const CONFIG_KEY = 'event_config';

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
    // Use the dynamic label for phone check if needed, or stick to 'phone'
    const attendeeRecord = {
      ...newAttendee,
      id: Math.random().toString(36).substr(2, 9),
      hasCheckedIn: false,
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

  // 5. Setup & Event Configuration
  saveConfig: (config) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  getConfig: () => {
    const cfg = localStorage.getItem(CONFIG_KEY);
    
    // Default nested structure 
    const baseDefaults = { 
      name: 'IYES 2026', 
      location: '', 
      startDate: '', 
      endDate: '',
      description: '',
      capacity: 1000,
      flyer: null,
      allowGroups: true,
      pin: '0000',
      successMsg: 'Registration Successful!',
      // Individual "Event Fields"
      customFields: [
        { id: 'f1', label: 'Full Name', type: 'text', required: true },
        { id: 'f2', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] }
      ],
      // Organization "Event Fields"
      groupFields: [
        { id: 'g1', label: 'Organization Name', type: 'text', required: true }
      ]
    };

    if (!cfg) return baseDefaults;
    
    const parsed = JSON.parse(cfg);
    // Deep merge to ensure customFields and groupFields exist
    return { 
      ...baseDefaults, 
      ...parsed,
      customFields: parsed.customFields || baseDefaults.customFields,
      groupFields: parsed.groupFields || baseDefaults.groupFields
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