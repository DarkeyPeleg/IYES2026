/**
 * Data Service - Updated March 9, 2026
 * Fixes: getUserProfile crash & matches De Graft's latest API specs
 */

const BASE_URL = 'https://plusureventsbackend.vercel.app/api/v1';
const STORAGE_KEY = 'event_attendees';
const CONFIG_KEY = 'event_config';

export const DataService = {
  
  // 1. DASHBOARD & ANALYTICS
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const list = data ? JSON.parse(data) : [];
    return {
      total: list.length,
      checkedIn: list.filter(a => a.hasCheckedIn).length,
      attendees: list 
    };
  },

  getStats: () => DataService.getAll(),

  // 2. USER PROFILE (Fixes the current "getUserProfile is not a function" error)
  getUserProfile: () => ({ 
    name: 'Peleg Teye Darkey', 
    avatar: null,
    role: 'MSc Computer Science Student' 
  }),

  // 3. ACCOUNT MANAGEMENT
  createAccount: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          residence: userData.residence,
          password: userData.password
        })
      });
      return await response.json();
    } catch (error) {
      console.error("CORS Error:", error);
      return { success: false, message: "Connection blocked by CORS." };
    }
  },

  // 4. EVENT SETUP - Updated for March 9 Specs
  saveConfig: async (config) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    try {
      const response = await fetch(`${BASE_URL}/events/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: config.name,
          location: config.location,
          description: config.description,
          group: config.group || true,
          start_date: config.startDate, 
          end_date: config.endDate,     
          expiry: config.linkExpiry,    
          no_attendee: parseInt(config.no_attendee),
          user: { id: 3 } // Updated to User ID 3 as per De Graft
        })
      });
      return await response.json();
    } catch (error) {
      return { success: true, message: "Saved locally" };
    }
  },

  // 5. CUSTOM FIELD SETUP
  createFields: async (fields, eventId) => {
    try {
      const payload = fields.map(f => ({
        label: f.label,
        field_type: f.field_type,
        isRequired: f.isRequired ? "1" : "0", 
        event: { id: eventId || 5 },         
        fieldOptions: f.fieldOptions || []   
      }));

      const response = await fetch(`${BASE_URL}/fields/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  // 6. REGISTRATION LOGIC
  register: async (formData) => {
    const attendees = DataService.getAll().attendees;
    const record = { ...formData, id: Date.now(), hasCheckedIn: false, isGroup: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attendees, record]));
    return { success: true, data: record };
  },

  registerGroup: async (groupData) => {
    const attendees = DataService.getAll().attendees;
    const record = { 
      ...groupData, 
      id: 'GRP-' + Date.now(), 
      hasCheckedIn: false, 
      isGroup: true 
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attendees, record]));
    return { success: true, data: record };
  },

  // 7. UTILITIES
  getConfig: () => JSON.parse(localStorage.getItem(CONFIG_KEY)) || { name: 'IYES 2026', group: true, customFields: [] },
  
  checkIn: (phone) => {
    const attendees = DataService.getAll().attendees;
    const index = attendees.findIndex(a => a.phone === phone);
    if (index === -1) return { success: false, message: 'Not found' };
    attendees[index].hasCheckedIn = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
    return { success: true };
  }
};