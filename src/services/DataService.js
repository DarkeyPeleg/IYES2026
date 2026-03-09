/**
  PRODUCTION DATA SERVICE
 * Target: https://plusureventsbackend.vercel.app
 */

const API_BASE_URL = 'https://plusureventsbackend.vercel.app';
const AUTH_COOKIE_NAME = 'auth_token';

export const DataService = {
  
  // 1. SECURITY & SESSION MANAGEMENT
  getAuthToken: () => {
    const name = AUTH_COOKIE_NAME + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
  },

  setAuthToken: (token) => {
    const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
    document.cookie = `${AUTH_COOKIE_NAME}=${token}; expires=${expires}; path=/; SameSite=Lax; Secure`;
  },

  // 2. LIVE REGISTRATION (ORGANIZATION)
  // Schema: name, address, contact_person_name, contact_person_phone, contact_person_email, number_heads
  registerGroup: async (groupData) => {
    const token = DataService.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/register-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        ...groupData,
        number_heads: parseInt(groupData.number_heads, 10) || 0 // Ensures integer type
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Backend rejected the group registration');
    
    return { success: true, data: result };
  },

  // 3. LIVE REGISTRATION (INDIVIDUAL)
  register: async (formData) => {
    const token = DataService.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Individual registration failed');
    
    return { success: true, data: result };
  },

  // 4. LIVE DASHBOARD ANALYTICS
  getStats: async () => {
    const token = DataService.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/attendees`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Unauthorized access to analytics');
    
    const data = await response.json();
    
    return {
      total: data.length || 0,
      checkedIn: data.filter(a => a.hasCheckedIn === 1 || a.hasCheckedIn === true).length,
      attendees: data // Live data array from Vercel
    };
  },

  // 5. LIVE GATE CHECK-IN (UPSA AUDITORIUM)
  checkIn: async (attendeeId) => {
    const token = DataService.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/checkin/${attendeeId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Check-in failed at the server level');
    return true;
  },

  getUserProfile: () => ({ name: 'Peleg Teye Darkey' })
};