const BASE_URL = 'https://skills-bridge.onrender.com'; // CHANGE to your IP for physical device

export const fetchUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/user/u1`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    console.error('fetchUser error:', e);
    return {
      id: "u1", name: "Mkhululi Van Heerden", location: "Midrand, JHB",
      bio: "Software Developer, Data Analyst, and Entrepreneur from Midrand.",
      skills: [{ name: "Excel", verified: true }],
      aiSkills: [], aiSummary: ""
    };
  }
};

export const fetchMatches = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/match/u1`);
    const data = await res.json();
    return data.matches;
  } catch (e) {
    console.error('fetchMatches error:', e);
    return [
      { id: 'j1', title: "Data Capturer (Micro)", company: "Local NGO", location: "Randburg",
        requiredSkills: ["Excel"], stipend: "R1,500", type: "2 Weeks", matchScore: 100 },
      { id: 'j3', title: "Sales Assistant", company: "Retail Store", location: "Benoni",
        requiredSkills: ["Customer Service"], stipend: "R3,500", type: "Full-time", matchScore: 75 },
    ];
  }
};

export const verifySkill = async (skillName: string, evidence: string) => {
  const res = await fetch(`${BASE_URL}/api/verify-skill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'u1', skillName, evidence }),
  });
  if (!res.ok) throw new Error('Verification failed');
  return await res.json();
};

export const analyzeExperience = async (experienceText: string) => {
  const res = await fetch(`${BASE_URL}/api/analyze-experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'u1', experienceText }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'AI analysis failed');
  }
  return await res.json();
};

export const confirmAISkills = async (skills: string[]) => {
  const res = await fetch(`${BASE_URL}/api/confirm-ai-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'u1', skills }),
  });
  if (!res.ok) throw new Error('Confirmation failed');
  return await res.json();
};

export const fetchAdminMetrics = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/metrics`);
    return await res.json();
  } catch (e) {
    return {
      metrics: [
        { id: 'u1', name: 'Van Heerden MC.', location: 'Midrand', manualSkillsCount: 1,
          aiSkillsCount: 3, totalSkills: 4, status: 'Active',
          aiSummary: 'Retail operations and inventory management experience.' }
      ],
      totals: { totalUsers: 1, totalManualSkills: 1, totalAISkills: 3, totalSkills: 4 }
    };
  }
};