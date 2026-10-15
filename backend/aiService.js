const fetch = require('node-fetch');

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

/**
 * Analyzes informal experience text and returns professional skills + summary.
 */
async function analyzeExperience(experienceText) {
  const systemPrompt = `You are a career coach helping young South Africans translate informal work into professional skills.

The user will describe informal work (e.g., "sold sweets at school", "fixed bikes for neighbors").
Translate this into 3-5 professional, employer-recognizable skills.

CRITICAL: Return ONLY valid JSON. No markdown. No code fences. No explanation.

Format:
{
  "skills": ["Skill One", "Skill Two", "Skill Three"],
  "summary": "One professional sentence about this person.",
  "confidence": 0.85
}

Rules:
- Skills must be 2-4 words, professional, employer-recognizable
- Confidence is 0.0 to 1.0 based on how much detail the user gave
- Summary must be written in third person, professional tone`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ubuntulink.app",
        "X-Title": "UbuntuLink SkillsBridge"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Informal experience: "${experienceText}"` }
        ],
        temperature: 0.3,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter ${response.status}: ${errText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Malformed AI response");
    }

    let raw = data.choices[0].message.content.trim();

    // Strip markdown fences (models sometimes add them anyway)
    raw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Extract JSON object from raw text (safety net)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) raw = jsonMatch[0];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.skills) || parsed.skills.length === 0) {
      throw new Error("AI returned no skills");
    }

    return {
      skills: parsed.skills.slice(0, 5),
      summary: parsed.summary || "Hard-working individual with practical experience.",
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
      source: "ai"
    };
  } catch (error) {
    console.error("AI Service Error:", error.message);

    // Graceful fallback so app NEVER crashes
    return {
      skills: ["General Labor", "Time Management", "Adaptability"],
      summary: "Hard-working individual with practical experience.",
      confidence: 0.3,
      source: "fallback"
    };
  }
}

module.exports = { analyzeExperience };