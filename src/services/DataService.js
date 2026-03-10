/**
 * PRODUCTION DATA SERVICE - v1 UPDATED
 * Target: https://plusureventsbackend.vercel.app
 */

const API_BASE_URL = 'https://plusureventsbackend.vercel.app';

export const DataService = {
  
  getAuthToken: () => "",
  setAuthToken: (token) => { console.log("Token not required.") },

  // 1. UPDATED INDIVIDUAL REGISTRATION
  // New Endpoint: /api/v1/attendee/register
  register: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/attendee/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Individual registration failed');
    return { success: true, data: result };
  },

  // 2. UPDATED GROUP REGISTRATION
  // Following the same v1 pattern
  registerGroup: async (groupData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/attendee/register-group`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...groupData,
        number_heads: parseInt(groupData.number_heads, 10) || 0 
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Group registration failed');
    return { success: true, data: result };
  },

  // 3. UPDATED DASHBOARD ANALYTICS
  // Check with De Graft if this is /api/v1/attendee/all or similar
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/attendee/all`);

    if (!response.ok) throw new Error('Could not fetch analytics');
    
    const data = await response.json();
    const rawList = data.event_attendees || [];
    
    return {
      total: rawList.length,
      checkedIn: rawList.filter(a => a.hasCheckedIn === true || a.hasCheckedIn === 1).length,
      attendees: rawList 
    };
  },

  // 4. UPDATED GATE CHECK-IN
  checkIn: async (attendeeId) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/attendee/checkin/${attendeeId}`, {
      method: 'PATCH'
    });

    if (!response.ok) throw new Error('Check-in failed');
    return true;
  },

  getUserProfile: () => ({ name: 'Peleg Teye Darkey' })
};