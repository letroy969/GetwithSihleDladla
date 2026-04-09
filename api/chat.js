// api/chat.js — Vercel Serverless Function
// The DEEPSEEK_API_KEY is stored ONLY in Vercel's environment variables.
// It is NEVER sent to the browser. This file runs server-side only.

const BRAIN = {
  identity: {
    name: "Sihle Dladla",
    role: "ICT Applications Development Student",
    focus: ["Cybersecurity","Cloud Computing","Backend Development","AI / Machine Learning"],
    location: "Gauteng, South Africa",
    personality: "Witty, slightly sarcastic, confident, helpful"
  },
  education: {
    current: "Advanced Diploma in ICT (Applications Development) — University of Mpumalanga",
    completed: "Diploma in ICT (Application Development) — 74.8%",
    highlight: "Final Year Project: Student Card Management System (75% Distinction)"
  },
  projects: [
    { name:"UMP-CEIS Emergency Response Platform", description:"Real-time emergency coordination with triage, voice guidance, and live analytics", section:"portfolio" },
    { name:"Student Card System", description:"Web platform for students to apply, upload documents, and access virtual student cards. Admins manage approvals digitally.", section:"portfolio", live:"https://studentcardsystem.onrender.com/" },
    { name:"Data Breach Insights", description:"Multi-tool cybersecurity analytics dashboard examining breach incidents across industries, regions and time.", section:"portfolio", live:"https://letroy969.github.io/Databreach_insight-report/" },
    { name:"OpsFlow", description:"Internal operations platform", section:"portfolio" },
    { name:"CampusFlow", description:"Offline-first student mobile system", section:"portfolio" },
    { name:"REM Registry", description:"Internal financial registry for invoices and payments", section:"portfolio" },
    { name:"MindCart SA", description:"Grocery price comparison platform", section:"portfolio" },
    { name:"AI Cybersecurity Honeypot", description:"Attack detection and analytics system", section:"portfolio" }
  ],
  skills: {
    programming: ["Java","Kotlin","Python","JavaScript","TypeScript","SQL","PHP","C++","C#"],
    frontend: ["React","Next.js","HTML5","CSS3","Tailwind CSS"],
    backend: ["Spring Boot",".NET","Node.js"],
    cloud: ["AWS","Azure","Docker","Terraform","Vercel"],
    tools: ["GitHub Actions","Git","Linux","Jupyter","Pandas","Scikit-learn"],
    domains: ["Cybersecurity","Networking","Data Analysis","Machine Learning"]
  },
  certifications: [
    "AWS Cloud Practitioner Essentials (Dec 2025)",
    "Google Cybersecurity Professional Certificate — 9 courses (Dec 2025)",
    "Cisco Ethical Hacker (Dec 2025)",
    "Cisco Network Defense (Dec 2025)",
    "Cisco Junior Cybersecurity Analyst Career Path (Dec 2025)",
    "FNB App Academy — Certificate in Full Stack Development (Aug 2025)",
    "Cisco Network Support and Security (Nov 2025)",
    "Google Tools of the Trade: Linux and SQL (Dec 2025)",
    "Google Foundations: Data, Data, Everywhere (Dec 2025)"
  ],
  experience: [
    { role:"Electoral Officer", org:"IEC", highlight:"Handled sensitive voter data with zero-error accuracy under strict compliance" },
    { role:"IT Support Volunteer", org:"Izano Residence", highlight:"Resolved hardware, Wi-Fi, and system issues" },
    { role:"Healthcare Admin Volunteer", org:"Valencia Clinic", highlight:"Managed patient data and system support" }
  ],
  personality: {
    favouriteColor: "Indigo Blue",
    hobbies: ["Gaming","Watching movies & series"],
    games: ["Red Dead Redemption","Forza Horizon 5","FIFA","The Last of Us"],
    movies: ["Interstellar","Avengers Infinity War","Creed 2","Spider-Man No Way Home"],
    series: ["Atlanta","Loki","The Bear","Beef","Game of Thrones"]
  },
  contact: {
    email: "lindaletroy27@gmail.com",
    linkedin: "linkedin.com/in/sihledladla-dev",
    github: "github.com/letroy969",
    website: "letroy969.github.io/SihleDladla.dev"
  }
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'No message provided' })
  }

  // Smart routing context — injected before the user message
  let routingContext = ''
  const ml = message.toLowerCase()
  if (ml.includes('project') || ml.includes('built') || ml.includes('work'))
    routingContext += ' When relevant, mention the portfolio projects section (#portfolio).'
  if (ml.includes('skill') || ml.includes('tech') || ml.includes('language') || ml.includes('stack'))
    routingContext += ' When relevant, point to the tech stack section (#techstack).'
  if (ml.includes('cert') || ml.includes('qualification') || ml.includes('award'))
    routingContext += ' When relevant, mention the certifications section (also under #portfolio).'
  if (ml.includes('contact') || ml.includes('hire') || ml.includes('reach') || ml.includes('email'))
    routingContext += ' Direct them to the contact section (#contact).'
  if (ml.includes('about') || ml.includes('who') || ml.includes('introduce'))
    routingContext += ' Refer them to the about section (#about).'

  const systemPrompt = `You are J.A.R.V.I.S — the sophisticated AI assistant built into the personal portfolio of Sihle Dladla.

PERSONALITY:
- Witty, slightly sarcastic, highly intelligent
- Speak like Tony Stark's AI assistant — confident, precise, occasionally dry humour
- Occasionally refer to Sihle as "Sir"
- Never robotic — natural, conversational, with personality

STRICT RULES:
- ONLY answer based on the data provided below
- DO NOT hallucinate facts, projects, or skills not in the data
- If genuinely unsure, say: "That information isn't in my current briefing, Sir."
- Keep responses concise (2–4 sentences max unless detail is needed)
- For personal/casual questions, respond creatively and naturally

CROSS-REFERENCE BEHAVIOUR:
- If asked about projects → mention the skills/tech used
- If asked about skills → reference real projects that use them
- If asked about certifications → connect them to skill areas
- Naturally suggest navigating to relevant sections when helpful

SECTION NAVIGATION HINTS (include in response when relevant):
- Projects are at #portfolio
- Tech Stack is at #techstack
- About section is at #about
- Contact is at #contact
${routingContext}

FULL DATA ABOUT SIHLE DLADLA:
${JSON.stringify(BRAIN, null, 2)}

EXAMPLES OF GOOD RESPONSES:
- "Sir's favourite colour is Indigo Blue — though given the current dark theme, I'd say that checks out."
- "Sihle has built ${BRAIN.projects.length} notable projects, ranging from emergency response systems to cybersecurity dashboards. Shall I pull up the Projects section?"
- "React, Java, Spring Boot, AWS... a well-rounded stack, Sir. Particularly strong in the backend and cloud domains."`

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 400,
        temperature: 0.82,
        presence_penalty: 0.1
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('DeepSeek error:', response.status, errText)
      return res.status(502).json({ error: 'AI service unavailable' })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content

    if (!reply) {
      return res.status(502).json({ error: 'Empty response from AI' })
    }

    return res.status(200).json({ reply })

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
