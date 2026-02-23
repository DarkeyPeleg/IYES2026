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

  // 2. Logic for Registration.js (Individual)
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

  // 3. Logic for Registration.js (Group/Institution)
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

  // 4. Logic for CheckIn.js
  checkIn: (phone) => {
    const attendees = getAttendees();
    const index = attendees.findIndex(a => a.phone === phone);
    if (index === -1) return { success: false, message: 'Attendee not found.' };
    
    attendees[index].hasCheckedIn = true;
    saveAttendees(attendees);
    return { success: true, data: attendees[index] };
  },

  getStats: () => {
    return DataService.getAll();
  },

  // 5. Logic for Setup
  saveConfig: (config) => {
    localStorage.setItem('event_config', JSON.stringify(config));
  },

  getConfig: () => {
    const cfg = localStorage.getItem('event_config');
    return cfg ? JSON.parse(cfg) : { name: 'New Event', pin: '0000', capacity: 100, location: '' };
  }
};