const STORAGE_KEY = 'iyes_2026_attendees';

export const DataService = {
  // Get stats for the Dashboard
  getStats: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const list = data ? JSON.parse(data) : [];
    return {
      total: list.length,
      checkedIn: list.filter(a => a.hasCheckedIn).length,
      attendees: list 
    };
  },

  // Static individual registration
  register: async (formData) => {
    const { attendees } = DataService.getStats();
    const record = { 
      ...formData, 
      id: Date.now(), 
      hasCheckedIn: false, 
      isGroup: false,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attendees, record]));
    return { success: true };
  },

  // Static organization registration
  registerGroup: async (formData) => {
    const { attendees } = DataService.getStats();
    const record = { 
      ...formData, 
      id: 'GRP-' + Date.now(), 
      hasCheckedIn: false, 
      isGroup: true,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attendees, record]));
    return { success: true };
  },

  checkIn: (id) => {
    const { attendees } = DataService.getStats();
    const index = attendees.findIndex(a => a.id === id);
    if (index === -1) return;
    attendees[index].hasCheckedIn = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
  },

  getUserProfile: () => ({ name: 'Peleg Teye Darkey' })
};