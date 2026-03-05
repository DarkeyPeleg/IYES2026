/**
 * Data Service - Complete v1
 * Fixes: getStats crash, registerGroup missing, and CORS-ready API
 */

const BASE_URL = 'https://plusureventsbackend.vercel.app/api/v1';
const STORAGE_KEY = 'event_attendees';
const CONFIG_KEY = 'event_config';

export const DataService = {
  
  // 1. DASHBOARD & CHECK-IN LOGIC (Fixes the current error)
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const list = data ? JSON.parse(data) : [];
    return {
      total: list.length,
      checkedIn: list.filter(a => a.hasCheckedIn).length,
      attendees: list 
    };
  },

  getStats: () => DataService.getAll(), // Restored to stop the crash

  // 2. ACCOUNT CREATION (Matches De Graft's latest keys)
  createAccount: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/`, {
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
      return { success: false, message: "Server security (CORS) blocked the request." };
    }
  },

  // 3. SETUP & REGISTRATION
  saveConfig: async (config) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    try {
      const response = await fetch(`${BASE_URL}/events/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          no_attendee: parseInt(config.no_attendee),
          user: { id: 1 }
        })
      });
      return await response.json();
    } catch (error) {
      return { success: true, message: "Saved locally" };
    }
  },

  register: async (formData) => {
    const attendees = DataService.getAll().attendees;
    const record = { ...formData, id: Date.now(), hasCheckedIn: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attendees, record]));
    return { success: true, data: record };
  },

  registerGroup: (groupData) => DataService.register(groupData),

  // 4. UTILITIES
  getConfig: () => JSON.parse(localStorage.getItem(CONFIG_KEY)) || { name: 'IYES 2026', group: true, customFields: [] },
  
  getUserProfile: () => ({ name: 'Peleg Darkey', avatar: null }),

  checkIn: (phone) => {
    const attendees = DataService.getAll().attendees;
    const index = attendees.findIndex(a => a.phone === phone);
    if (index === -1) return { success: false, message: 'Not found' };
    attendees[index].hasCheckedIn = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
    return { success: true };
  }
};