// api/chat.js — Vercel Serverless Function (Groq AI)
// GROQ_API_KEY is stored ONLY in Vercel environment variables.
// Never exposed to frontend.

const BRAIN = {
  identity: {
    name: "Sihle Dladla",
    role: "ICT Applications Development Student",
    focus: ["Cybersecurity", "Cloud Computing", "Backend Development", "AI / Machine Learning"],
    location: "Gauteng, South Africa",
    personality: "Witty, slightly sarcastic, confident, helpful"
  },
  education: {
    current: "Advanced Diploma in ICT (Applications Development) — University of Mpumalanga",
    completed: "Diploma in ICT (Application Development) — 74.8%",
    highlight: "Final Year Project: Student Card Management System (75% Distinction)"
  },
  projects: [
    { name: "UMP-CEIS Emergency Response Platform", description: "Real-time emergency coordination with triage, voice guidance, and live analytics", section: "portfolio" },
    { name: "Student Card System", description: "Web platform for students to apply, upload documents, and access virtual student cards.", live: "https://studentcardsystem.onrender.com/", section: "portfolio" },
    { name: "Data Breach Insights", description: "Cybersecurity analytics dashboard for breach analysis", live: "https://letroy969.github.io/Databreach_insight-report/", section: "portfolio" },
    { name: "OpsFlow", description: "Internal operations platform", section: "portfolio" },
    { name: "CampusFlow", description: "Offline-first student mobile system", section: "portfolio" },
    { name: "REM Registry", description: "Financial registry system", section: "portfolio" },
    { name: "MindCart SA", description: "Grocery price comparison platform", section: "portfolio" },
    { name: "AI Cybersecurity Honeypot", description: "Attack detection system", section: "portfolio" }
  ],
  skills: {
    programming: ["Java", "Kotlin", "Python", "JavaScript", "TypeScript", "SQL", "PHP", "C++", "C#"],
    frontend: ["React", "Next.js", "HTML5", "CSS3", "Tailwind CSS"],
    backend: ["Spring Boot", ".NET", "Node.js"],
    cloud: ["AWS", "Azure", "Docker", "Terraform", "Vercel"],
    tools: ["GitHub Actions", "Git", "Linux", "Pandas", "Scikit-learn"],
    domains: ["Cybersecurity", "Networking", "Data Analysis", "Machine Learning"]
  },
  personality: {
    favouriteColor: "Indigo Blue",
    hobbies: ["Gaming", "Watching movies & series"],
    games: ["Red Dead Redemption", "Forza Horizon 5", "FIFA", "The Last of Us"],
    movies: ["Interstellar", "Avengers Infinity War", "Creed 2", "Spider-Man No Way Home"],
    series: ["Atlanta", "Loki", "The Bear", "Beef", "Game of Thrones"]
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided" });
  }

  const systemPrompt = `
You are J.A.R.V.I.S — a witty, slightly sarcastic AI assistant for Sihle Dladla.

RULES:
- Be concise (2–4 sentences max)
- Be intelligent, slightly humorous, and confident
- Never invent information outside provided data
- If unsure: "That information isn't in my current briefing, Sir."

DATA:
${JSON.stringify(BRAIN, null, 2)}
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.8,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);

      return res.status(502).json({
        error: "AI service unavailable"
      });
    }

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "Empty AI response"
      });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Server error:", err);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
}
