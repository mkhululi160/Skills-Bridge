const users = [
  {
    id: "u1",
    name: "Mkhululi Van Heerden",
    location: "Soweto, JHB",
    bio: "Software Developer, Data Analyst and Entrepreneur from Midrand.",
    skills: [
      { name: "Excel", verified: true, source: "manual", evidence: "Created inventory tracker" }
    ],
    aiSkills: [],
    aiSummary: "",
    informalExperience: "",
    matches: []
  }
];

const jobs = [
  {
    id: "j1",
    title: "Data Capturer (Micro-Internship)",
    company: "SD Youth NGO",
    location: "Sandton, JHB",
    type: "Micro-Internship (2 weeks)",
    stipend: "R1,500",
    requiredSkills: ["Excel", "Data Entry"],
    description: "Capture community survey data into our Excel database. Training provided."
  },
  {
    id: "j2",
    title: "Junior Web Developer",
    company: "Township Tech Hub",
    location: "Remote",
    type: "Part-time",
    stipend: "R4,000/month",
    requiredSkills: ["Coding", "HTML", "JavaScript"],
    description: "Maintain our local business directory website."
  },
  {
    id: "j3",
    title: "Sales Assistant",
    company: "Local Retail Store",
    location: "Centurion, JHB",
    type: "Full-time",
    stipend: "R3,500/month",
    requiredSkills: ["Customer Service", "Retail Operations", "Cash Handling"],
    description: "Assist customers and manage stock."
  },
  {
    id: "j4",
    title: "Bicycle Repair Technician",
    company: "Township Cycles",
    location: "Midrand, JHB",
    type: "Part-time",
    stipend: "R2,800/month",
    requiredSkills: ["Bicycle Repair", "Customer Service", "Problem Solving"],
    description: "Repair and service bicycles for community members."
  },
  {
    id: "j5",
    title: "Event Coordinator Assistant",
    company: "Community Events Co.",
    location: "JHB CBD",
    type: "Micro-Internship (1 month)",
    stipend: "R2,000",
    requiredSkills: ["Event Coordination", "Logistics", "Communication"],
    description: "Help organize community events and manage logistics."
  }
];

module.exports = { users, jobs };