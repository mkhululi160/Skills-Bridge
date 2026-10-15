const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { users, jobs } = require('./data');
const { analyzeExperience } = require('./aiService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------- 1. Get User ----------
app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// ---------- 2. Verify Skill (manual) ----------
app.post('/api/verify-skill', (req, res) => {
  const { userId, skillName, evidence } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  let skill = user.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
  if (skill) {
    skill.verified = true;
    skill.evidence = evidence;
  } else {
    user.skills.push({ name: skillName, verified: true, source: "manual", evidence });
  }

  res.json({ success: true, message: `Skill ${skillName} verified!`, user });
});

// ---------- 3. AI: Analyze Experience ----------
app.post('/api/analyze-experience', async (req, res) => {
  const { userId, experienceText } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!experienceText || experienceText.trim().length < 10) {
    return res.status(400).json({ error: "Please describe your experience in more detail (at least 10 characters)." });
  }

  const result = await analyzeExperience(experienceText);

  // Store temporarily for confirmation step
  user.pendingAI = {
    skills: result.skills,
    summary: result.summary,
    confidence: result.confidence,
    source: result.source,
    rawInput: experienceText
  };

  res.json({
    success: true,
    skills: result.skills,
    summary: result.summary,
    confidence: result.confidence,
    source: result.source
  });
});

// ---------- 4. Confirm AI Skills (add to profile) ----------
app.post('/api/confirm-ai-skills', (req, res) => {
  const { userId, skills } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "No skills to confirm" });
  }

  // Merge into aiSkills (dedupe)
  const existing = new Set(user.aiSkills.map(s => s.name.toLowerCase()));
  skills.forEach(skillName => {
    if (!existing.has(skillName.toLowerCase())) {
      user.aiSkills.push({
        name: skillName,
        verified: true,
        source: "ai",
        verifiedAt: new Date().toISOString()
      });
    }
  });

  // Save AI summary
  if (user.pendingAI) {
    user.aiSummary = user.pendingAI.summary;
    user.informalExperience = user.pendingAI.rawInput;
    delete user.pendingAI;
  }

  res.json({ success: true, message: "Skills added to profile", user });
});

// ---------- 5. Smart Matching (uses manual + AI skills) ----------
app.get('/api/match/:userId', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const userSkills = [
    ...user.skills.filter(s => s.verified).map(s => s.name),
    ...user.aiSkills.map(s => s.name)
  ];

  const matchedJobs = jobs
    .map(job => {
      const matchCount = job.requiredSkills.filter(reqSkill =>
        userSkills.some(uSkill =>
          uSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
          reqSkill.toLowerCase().includes(uSkill.toLowerCase())
        )
      ).length;

      const matchScore = Math.round((matchCount / job.requiredSkills.length) * 100);
      return { ...job, matchScore };
    })
    .filter(job => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json({ matches: matchedJobs, userSkills });
});

// ---------- 6. Admin Metrics ----------
app.get('/api/admin/metrics', (req, res) => {
  const metrics = users.map(u => ({
    id: u.id,
    name: u.name,
    location: u.location,
    manualSkillsCount: u.skills.filter(s => s.verified).length,
    aiSkillsCount: u.aiSkills.length,
    totalSkills: u.skills.filter(s => s.verified).length + u.aiSkills.length,
    aiSummary: u.aiSummary || "No AI analysis yet",
    status: (u.skills.some(s => s.verified) || u.aiSkills.length > 0) ? "Active" : "Pending"
  }));

  const totals = {
    totalUsers: metrics.length,
    totalManualSkills: metrics.reduce((sum, u) => sum + u.manualSkillsCount, 0),
    totalAISkills: metrics.reduce((sum, u) => sum + u.aiSkillsCount, 0),
    totalSkills: metrics.reduce((sum, u) => sum + u.totalSkills, 0)
  };

  res.json({ metrics, totals });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 UbuntuLink Backend running on port ${PORT}`);
  console.log(`🤖 AI Model: ${process.env.OPENROUTER_API_KEY ? 'Connected' : '⚠️  NO API KEY'}`);
});