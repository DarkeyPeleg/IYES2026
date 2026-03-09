const STORAGE_KEY = 'event_attendees';
const CONFIG_KEY = 'event_config';

export const DataService = {
  // 1. ANALYTICS
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

  // 2. REGISTRATION (Static Keys: firstname, lastname, email, phone, residence, firstTime)
  register: async (formData) => {
    const { attendees } = DataService.getAll();
    const record = { 
      ...formData, 
      id: Date.now(), 
      hasCheckedIn: false, 
      isGroup: false,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attendees, record]));
    return { success: true, data: record };
  },

  registerGroup: async (formData) => {
    const { attendees } = DataService.getAll();
    const record = { 
      ...formData, 
      id: 'GRP-' + Date.now(), 
      hasCheckedIn: false, 
      isGroup: true,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attendees, record]));
    return { success: true, data: record };
  },

  // 3. UTILITIES
  getConfig: () => JSON.parse(localStorage.getItem(CONFIG_KEY)) || { name: 'IYES 2026' },
  
  getUserProfile: () => ({ name: 'Peleg Teye Darkey' }),

  checkIn: (phone) => {
    const { attendees } = DataService.getAll();
    const index = attendees.findIndex(a => a.phone === phone);
    if (index === -1) return { success: false };
    attendees[index].hasCheckedIn = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
    return { success: true };
  }
};