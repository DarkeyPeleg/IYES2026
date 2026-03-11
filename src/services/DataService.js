/**
 * PRODUCTION DATA SERVICE - v1 FINAL
 * Target: https://plusureventsbackend.vercel.app
 */

const API_BASE_URL = 'https://plusureventsbackend.vercel.app';

export const DataService = {
  
  getAuthToken: () => "",
  setAuthToken: (token) => { console.log("Auth managed by backend.") },

  // 1. INDIVIDUAL REGISTRATION
  register: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/attendee/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Registration failed');
    return { success: true, data: result };
  },

  // 2. GROUP REGISTRATION
  registerGroup: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/attendee-group/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Group registration failed');
    return { success: true, data: result };
  },

  // 3. ANALYTICS (Fixed for Triple-Nested Data)
 getStats: async () => {
    let individuals = [];
    let groups = [];

    // 1. Fetch Individuals
    try {
      const indivRes = await fetch(`${API_BASE_URL}/api/v1/attendee`);
      const indivJson = await indivRes.json();
      const rawIndivs = indivJson.data?.data || indivJson.data || [];
      
      individuals = Array.isArray(rawIndivs) ? rawIndivs.map(a => ({
        ...a,
        id: a.id,
        name: a.name || `${a.firstname || ''} ${a.lastname || ''}`.trim() || "Individual",
        residence: a.address || a.residence || "N/A",
        isGroup: false // Force false for this endpoint
      })) : [];
    } catch (e) { console.error("Indiv Error"); }

    // 2. Fetch Groups
    try {
      const groupRes = await fetch(`${API_BASE_URL}/api/v1/attendee-group`);
      // If De Graft's server is still returning that text "This action returns...", 
      // this fetch will fail or return an error, which is why it's empty.
      if (groupRes.ok && groupRes.headers.get("content-type")?.includes("application/json")) {
        const groupJson = await groupRes.json();
        const rawGroups = groupJson.data?.data || groupJson.data || groupJson.attendeeGroups || [];
        
        groups = Array.isArray(rawGroups) ? rawGroups.map(g => ({
          ...g,
          id: g.id,
          name: g.name || g.name_of_org || "Organization",
          residence: g.address || g.residence || "N/A",
          isGroup: true // FORCE TRUE SO THE DASHBOARD TAB SEES IT
        })) : [];
      }
    } catch (e) { console.error("Group Error"); }
    
    const combined = [...individuals, ...groups];
    return {
      total: combined.length,
      checkedIn: combined.filter(a => a.hasCheckedIn).length,
      attendees: combined 
    };
  },

  // 4. GATE CHECK-IN
  checkIn: async (id, isGroup = false) => {
    const endpoint = isGroup ? `attendee-group` : `attendee`;
    const response = await fetch(`${API_BASE_URL}/api/v1/${endpoint}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Check-in failed');
    return true;
  },

  getUserProfile: () => ({ name: 'Peleg Teye Darkey' })
};