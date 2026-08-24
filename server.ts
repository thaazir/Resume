import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini endpoints will return fallback data or error.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const MODEL_NAME = "gemini-3.7-flash";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. Bullet Point Enhancement
  app.post("/api/gemini/enhance-bullet", async (req, res) => {
    try {
      const { bullet, position, company, targetRole } = req.body;
      if (!bullet || typeof bullet !== "string") {
        return res.status(400).json({ error: "Bullet text is required" });
      }

      const ai = getGenAI();
      const prompt = `You are an expert ATS Resume Coach and Technical Recruiter.
Analyze this raw resume bullet point: "${bullet}"
Context:
- Position: ${position || "Professional"}
- Company: ${company || "Enterprise"}
- Target Role: ${targetRole || "Competitive Industry Position"}

Generate 3 high-impact, ATS-optimized variations using strong action verbs, the XYZ / STAR formula (Accomplished [X] as measured by [Y], by doing [Z]), and realistic quantifiable metric placeholders (% increase, $ saved, hours reduced, team size, volume).

Return valid JSON with:
{
  "original": "${bullet.replace(/"/g, '\\"')}",
  "actionVerbUsed": "string",
  "metricType": "string (e.g., Efficiency %, Revenue, Latency, Scale)",
  "variations": [
    {
      "type": "Metric & Impact Focused",
      "text": "string starting with strong past-tense action verb and clear quantifiable outcome",
      "explanation": "why this passes ATS and catches recruiter attention"
    },
    {
      "type": "STAR Formula (Action & Result)",
      "text": "string detailing action taken and concrete business result",
      "explanation": "why this works"
    },
    {
      "type": "Leadership & Scope Oriented",
      "text": "string highlighting leadership, collaboration, or scale",
      "explanation": "why this works"
    }
  ],
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in enhance-bullet:", error);
      res.status(500).json({
        error: error.message || "Failed to enhance bullet point",
        fallback: [
          `Spearheaded key initiatives resulting in measurable improvements across core deliverables`,
          `Streamlined workflow processes, reducing turnaround time by 25% while maintaining strict quality benchmarks`,
          `Collaborated with cross-functional stakeholders to deliver critical project milestones ahead of schedule`,
        ],
      });
    }
  });

  // 2. Generate Professional Summary
  app.post("/api/gemini/generate-summary", async (req, res) => {
    try {
      const { personalInfo, experiences, skills, targetRole, tone } = req.body;
      const ai = getGenAI();

      const prompt = `You are a top executive resume writer and ATS specialist.
Create 3 distinct ATS-friendly professional summary options (3-4 concise lines each) tailored for the target role: "${targetRole || personalInfo?.jobTitle || "Professional"}".

Candidate Details:
- Current Title: ${personalInfo?.jobTitle || "Experienced Candidate"}
- Years/Experience Context: ${experiences?.map((e: any) => `${e.position} at ${e.company}`).join("; ") || "Experienced"}
- Key Skills: ${skills?.map((s: any) => s.skills?.join(", ")).join(", ") || "General Skills"}
- Desired Tone: ${tone || "Professional & Impactful"}

Summaries should:
1. Include high-value target industry keywords.
2. Highlight core strengths and quantified track record.
3. Be 100% free of fluffy clichés ("hardworking team player").

Return valid JSON:
{
  "options": [
    {
      "title": "Impact & Results-Driven (Standard ATS)",
      "summary": "string"
    },
    {
      "title": "Executive & Leadership Focused",
      "summary": "string"
    },
    {
      "title": "Technical & Skills-Dense",
      "summary": "string"
    }
  ],
  "coreKeywordsIncluded": ["string", "string", "string"]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in generate-summary:", error);
      res.status(500).json({ error: error.message || "Failed to generate summary" });
    }
  });

  // 3. Suggest Industry Skills & Action Verbs
  app.post("/api/gemini/suggest-skills", async (req, res) => {
    try {
      const { role, industry, currentSkills } = req.body;
      const ai = getGenAI();

      const prompt = `You are an ATS database engineer. List high-ranking ATS keywords and skills for the role: "${role || "Software Engineer"}" in industry: "${industry || "Technology"}".
Existing candidate skills: ${JSON.stringify(currentSkills || [])}

Provide recommended additions organized into clear ATS categories.
Return valid JSON:
{
  "categories": [
    {
      "name": "Hard Skills & Domain Knowledge",
      "skills": ["string", "string", "string", "string", "string"]
    },
    {
      "name": "Tools, Frameworks & Technologies",
      "skills": ["string", "string", "string", "string", "string"]
    },
    {
      "name": "Methodologies & Certifications",
      "skills": ["string", "string", "string", "string"]
    },
    {
      "name": "High-Impact Action Verbs",
      "skills": ["Orchestrated", "Engineered", "Accelerated", "Streamlined", "Maximized", "Spearheaded"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in suggest-skills:", error);
      res.status(500).json({ error: error.message || "Failed to suggest skills" });
    }
  });

  // 4. Tailor to Job Description & Keyword Gap Analysis
  app.post("/api/gemini/tailor-job", async (req, res) => {
    try {
      const { resume, jobDescription, targetCompany, targetRole } = req.body;
      if (!jobDescription || typeof jobDescription !== "string") {
        return res.status(400).json({ error: "Job description is required" });
      }

      const ai = getGenAI();
      const prompt = `You are an ATS parsing algorithm and Senior Talent Screener.
Analyze this Resume against the provided Target Job Description.

TARGET JOB DESCRIPTION:
"""
${jobDescription.slice(0, 4000)}
"""

CURRENT RESUME DATA:
"""
${JSON.stringify({
  title: resume.personalInfo?.jobTitle,
  summary: resume.personalInfo?.summary,
  skills: resume.skills,
  experiences: resume.experiences?.map((e: any) => ({
    pos: e.position,
    comp: e.company,
    bullets: e.bullets,
  })),
}).slice(0, 4000)}
"""

Tasks:
1. Extract top required keywords and skills from the job description.
2. Match them against the resume to find MATCHED vs MISSING keywords.
3. Calculate ATS Match Score (0-100%).
4. Provide targeted rewrite recommendations to embed missing keywords legitimately.
5. Generate an updated ATS tailored summary and up to 3 optimized bullet rewrites.

Return valid JSON:
{
  "matchPercentage": 78,
  "jobTitleIdentified": "string",
  "matchedKeywords": [
    { "keyword": "TypeScript", "count": 3, "category": "Technical" },
    { "keyword": "CI/CD", "count": 1, "category": "DevOps" }
  ],
  "missingKeywords": [
    { "keyword": "Kubernetes", "importance": "high", "category": "DevOps" },
    { "keyword": "System Architecture", "importance": "high", "category": "Architecture" },
    { "keyword": "Agile Scrum", "importance": "medium", "category": "Process" }
  ],
  "tailoredSummary": "A revised 3-4 sentence professional summary explicitly incorporating key job requirements",
  "bulletImprovements": [
    {
      "original": "Original bullet from resume",
      "tailored": "Rewritten bullet naturally incorporating missing target keyword",
      "keywordIntegrated": "Kubernetes",
      "reason": "Matches key qualification in job posting"
    }
  ],
  "topAdvice": [
    "Advice point 1",
    "Advice point 2",
    "Advice point 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in tailor-job:", error);
      res.status(500).json({ error: error.message || "Failed to tailor resume" });
    }
  });

  // 5. Deep ATS Audit Engine
  app.post("/api/gemini/ats-audit", async (req, res) => {
    try {
      const { resume } = req.body;
      const ai = getGenAI();

      const prompt = `You are a real Applicant Tracking System (ATS) Parser parser simulation engine (like Taleo, Workday, Greenhouse, Lever).
Perform a strict 4-pillar audit on this candidate resume:

RESUME:
"""
${JSON.stringify(resume).slice(0, 5000)}
"""

Evaluate across 4 pillars (0-100 each):
1. FORMATTING & PARSABILITY (standard single-column layout, standard headers, no illegal symbols/tables, date formatting)
2. KEYWORD & SKILL DENSITY (clear technical & core competencies, industry terminology, no keyword stuffing)
3. IMPACT & METRICS (STAR method, % improvements, dollar values, action verbs vs passive voice)
4. SECTION COMPLETENESS (Contact info, Summary, Work Experience with dates, Education, Skills)

Return valid JSON:
{
  "overallScore": 86,
  "grade": "A",
  "summary": "Concise 2-sentence executive assessment of ATS readiness",
  "pillars": {
    "formatting": {
      "name": "Formatting & Parsability",
      "score": 95,
      "weight": 25,
      "status": "passed",
      "details": ["Standard ATS date conventions detected", "Clear sequential hierarchy", "Zero unparseable tables or text boxes"]
    },
    "keywords": {
      "name": "Keywords & Hard Skills",
      "score": 80,
      "weight": 25,
      "status": "passed",
      "details": ["Strong domain keyword coverage", "Recommend adding 2-3 additional modern tooling keywords"]
    },
    "impact": {
      "name": "Quantified Impact & Metrics",
      "score": 75,
      "weight": 30,
      "status": "warning",
      "details": ["Some bullet points lack measurable outcomes (%, $, scale)", "Action verbs are strong in top 2 roles"]
    },
    "completeness": {
      "name": "Section Completeness & Contact",
      "score": 95,
      "weight": 20,
      "status": "passed",
      "details": ["Complete contact details including LinkedIn", "Standard section headers (Experience, Education, Skills)"]
    }
  },
  "criticalIssues": [],
  "warnings": [
    "2 bullet points in recent experience lack specific quantitative metrics."
  ],
  "passedChecks": [
    "Standard contact information structure detected",
    "Chronological work experience ordering is valid",
    "Categorized skills section is easily indexable by ATS scanners",
    "No complex tables or column traps detected"
  ],
  "suggestedFixes": [
    {
      "id": "fix-metrics",
      "section": "experience",
      "title": "Quantify Results in Experience",
      "description": "Add specific metric percentages or team numbers to your bullets to increase recruiter engagement.",
      "actionable": true,
      "autoFixType": "enhance_bullets"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in ats-audit:", error);
      res.status(500).json({ error: error.message || "Failed to audit resume" });
    }
  });

  // 6. Google Search Grounded Market Insights & In-Demand Skills
  app.post("/api/gemini/grounded-market-insights", async (req, res) => {
    try {
      const { role, industry, location } = req.body;
      const ai = getGenAI();

      const queryRole = role || "Senior Full Stack Engineer";
      const queryIndustry = industry || "Technology";
      const queryLocation = location || "United States / Remote";

      const prompt = `Using live Google Search, investigate the current hiring market requirements, in-demand technical keywords, essential soft skills, expected certifications, and salary benchmarks for:
Role: "${queryRole}"
Industry: "${queryIndustry}"
Location: "${queryLocation}"

Provide an up-to-date analysis of what recruiters and ATS filters are specifically scanning for in 2025/2026 for this role.

Return valid JSON:
{
  "role": "${queryRole}",
  "industry": "${queryIndustry}",
  "inDemandKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "keyHardSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "keySoftSkills": ["skill1", "skill2", "skill3", "skill4"],
  "certificationsValued": ["cert1", "cert2"],
  "averageSalaryRange": "e.g. $130,000 - $175,000 / year",
  "hiringTrendsSummary": "2-3 sentences explaining what hiring managers prioritize right now in 2025/2026 for this job profile."
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);

      // Extract Grounding metadata sources if available
      const sources: { title: string; uri: string }[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && Array.isArray(chunks)) {
        for (const chunk of chunks) {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || "Industry Search Source",
              uri: chunk.web.uri,
            });
          }
        }
      }

      parsed.sources = sources.slice(0, 5);
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in grounded-market-insights:", error);
      res.status(500).json({
        error: error.message || "Failed to fetch market insights",
        fallback: {
          role: req.body.role || "Software Engineer",
          industry: req.body.industry || "Technology",
          inDemandKeywords: ["System Design", "Cloud Native", "CI/CD", "TypeScript", "REST APIs", "Agile", "Kubernetes", "Microservices"],
          keyHardSkills: ["Software Architecture", "API Integration", "Database Optimization", "Unit Testing", "Cloud Infrastructure"],
          keySoftSkills: ["Cross-functional Collaboration", "Problem Solving", "Mentorship", "Technical Communication"],
          certificationsValued: ["AWS Certified Solutions Architect", "Google Cloud Professional"],
          averageSalaryRange: "$120,000 - $165,000",
          hiringTrendsSummary: "Demand is high for engineers who demonstrate quantifiable project ownership and full lifecycle delivery with strong communication skills.",
        },
      });
    }
  });

  // 7. Parse Raw Resume Text into Structured JSON
  app.post("/api/gemini/parse-resume", async (req, res) => {
    try {
      const text = req.body.text || req.body.resumeText;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Resume text is required" });
      }

      const ai = getGenAI();
      const prompt = `You are a universal resume parser. Extract and structure this resume text into clean, standardized JSON conforming to our schema.

RAW RESUME TEXT:
"""
${text.slice(0, 10000)}
"""

Return valid JSON with this exact structure:
{
  "personalInfo": {
    "fullName": "string",
    "jobTitle": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedIn": "string or empty",
    "github": "string or empty",
    "portfolio": "string or empty",
    "summary": "string"
  },
  "experiences": [
    {
      "id": "exp-1",
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "e.g. 2021-03",
      "endDate": "e.g. 2024-01 or Present",
      "isCurrent": boolean,
      "bullets": ["bullet 1", "bullet 2"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string or empty"
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "name": "Technical Skills",
      "skills": ["Skill 1", "Skill 2"]
    },
    {
      "id": "skill-2",
      "name": "Tools & Frameworks",
      "skills": ["Tool 1", "Tool 2"]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "string",
      "technologies": ["string"],
      "link": "string or empty",
      "bullets": ["string"]
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "string",
      "issuer": "string",
      "issueDate": "string"
    }
  ],
  "languages": [
    {
      "id": "lang-1",
      "language": "English",
      "proficiency": "Fluent"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in parse-resume:", error);
      res.status(500).json({ error: error.message || "Failed to parse resume text" });
    }
  });

  // 7b. Specialized LinkedIn Profile Parser & ATS Transformer
  app.post("/api/gemini/parse-linkedin", async (req, res) => {
    try {
      const text = req.body.text || req.body.linkedInText;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "LinkedIn profile text is required" });
      }

      const ai = getGenAI();
      const prompt = `You are an expert LinkedIn Profile to ATS Resume Converter and Executive Career Consultant.
Transform this raw copied LinkedIn profile text (which may come from direct web page copy or LinkedIn "Save to PDF" export) into an ATS-optimized professional resume structure.

LINKEDIN RAW CONTENT:
"""
${text.slice(0, 12000)}
"""

CRITICAL ATS TRANSFORMATION RULES:
1. Contact & Identity:
   - Extract Full Name, current Headline/Job Title, verified Email, Phone, City/State/Country Location, LinkedIn URL, Portfolio, GitHub.
2. Professional Summary:
   - Convert conversational LinkedIn "About" text into a high-impact, 3-4 sentence ATS professional summary highlighting core strengths, quantified achievements, and target keywords. Remove conversational first-person references ("I am", "My passion is") in favor of authoritative professional voice.
3. Experience & Work History:
   - Extract every position and employer. Parse dates accurately into "YYYY-MM" (or "YYYY") and "Present". Set isCurrent appropriately.
   - IMPORTANT: Convert narrative job descriptions or casual LinkedIn notes into strong, ATS-compliant bullet points. Each bullet MUST start with a strong past-tense action verb (e.g. "Spearheaded", "Architected", "Accelerated", "Orchestrated", "Engineered") and include quantifiable metrics/impact wherever possible.
4. Skills Categorization:
   - Extract all listed skills and endorsements, categorizing them logically into ATS-friendly groupings: "Core Competencies & Domain Expertise", "Technologies, Frameworks & Languages", and "Tools & Methodologies".
5. Education, Licenses, Certifications, and Languages:
   - Accurately structure degrees, institutions, graduation dates, credential names, issuers, and language proficiencies.

Return valid JSON with this exact schema:
{
  "personalInfo": {
    "fullName": "string",
    "jobTitle": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedIn": "string",
    "github": "string",
    "portfolio": "string",
    "summary": "string"
  },
  "experiences": [
    {
      "id": "exp-1",
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or Present",
      "isCurrent": boolean,
      "bullets": [
        "Action verb + quantifiable achievement + business impact",
        "Action verb + technical project delivery + metric outcome"
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "location": "string",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "gpa": "string or empty"
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "name": "Core Competencies & Architecture",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    },
    {
      "id": "skill-2",
      "name": "Frameworks, Tools & Platforms",
      "skills": ["Tool 1", "Tool 2", "Tool 3"]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "string",
      "technologies": ["Tech 1", "Tech 2"],
      "link": "string or empty",
      "bullets": ["Impact bullet 1"]
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "string",
      "issuer": "string",
      "issueDate": "string"
    }
  ],
  "languages": [
    {
      "id": "lang-1",
      "language": "string",
      "proficiency": "string"
    }
  ],
  "parsedStats": {
    "totalExperiences": 2,
    "totalEducation": 1,
    "totalSkills": 12,
    "totalCertifications": 2,
    "totalLanguages": 2
  }
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in parse-linkedin:", error);
      res.status(500).json({ error: error.message || "Failed to parse LinkedIn text" });
    }
  });

  // 8. Generate Cover Letter
  app.post("/api/gemini/generate-cover-letter", async (req, res) => {
    try {
      const { resume, jobDescription, companyName, recipientName, tone } = req.body;
      const ai = getGenAI();

      const prompt = `You are a professional career consultant. Write a high-converting, ATS-friendly cover letter for this candidate applying to "${companyName || "Target Company"}".

Job Description:
"""
${(jobDescription || "Standard Role Description").slice(0, 3000)}
"""

Candidate Profile:
- Name: ${resume?.personalInfo?.fullName || "Candidate"}
- Title: ${resume?.personalInfo?.jobTitle || "Professional"}
- Key Experience: ${resume?.experiences?.map((e: any) => `${e.position} at ${e.company}: ${e.bullets?.[0] || ""}`).join("; ") || ""}
- Top Skills: ${resume?.skills?.map((s: any) => s.skills?.join(", ")).join(", ") || ""}

Tone: ${tone || "Professional, confident, and results-driven"}

Write 3 to 4 impactful paragraphs:
1. Hook & Introduction (why applying, enthusiasm for company, role alignment)
2. Body Paragraph 1 (top quantified achievement from resume directly solving their job pain points)
3. Body Paragraph 2 (relevant hard skills, leadership, and culture fit)
4. Strong Call to Action & Professional Closing

Return valid JSON:
{
  "recipientName": "${recipientName || "Hiring Team"}",
  "recipientTitle": "Hiring Manager",
  "companyName": "${companyName || "Target Company"}",
  "jobTitle": "${resume?.personalInfo?.jobTitle || "Target Role"}",
  "bodyParagraphs": [
    "Paragraph 1 text...",
    "Paragraph 2 text...",
    "Paragraph 3 text..."
  ],
  "closing": "Sincerely,"
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in generate-cover-letter:", error);
      res.status(500).json({ error: error.message || "Failed to generate cover letter" });
    }
  });

  // 9. Predict Interview Questions
  app.post("/api/gemini/predict-interview-questions", async (req, res) => {
    try {
      const { resume, jobDescription, targetRole } = req.body;
      const ai = getGenAI();

      const prompt = `You are a Senior Bar Raiser and Technical Hiring Manager.
Based on this resume and target role (${targetRole || resume?.personalInfo?.jobTitle || "Professional"}), predict 5 likely interview questions recruiters and hiring managers will ask this candidate.

RESUME SNIPPET:
${JSON.stringify({
  title: resume?.personalInfo?.jobTitle,
  experiences: resume?.experiences?.map((e: any) => ({
    company: e.company,
    role: e.position,
    bullets: e.bullets,
  })),
  skills: resume?.skills,
}).slice(0, 3000)}

JOB POSTING:
${(jobDescription || "Standard Role Description").slice(0, 2000)}

Provide a mix of Behavioral (STAR), Technical/Domain, and Resume-Specific deep dive questions with high-scoring answer frameworks.

Return valid JSON:
{
  "questions": [
    {
      "id": "q-1",
      "question": "string",
      "category": "behavioral | technical | situational | resume-specific",
      "whyAsked": "what the interviewer is testing for",
      "starTip": "how to structure the response using Situation, Task, Action, Result",
      "sampleAnswerFramework": "concise sample bullet points the candidate can touch on"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in predict-interview-questions:", error);
      res.status(500).json({ error: error.message || "Failed to predict interview questions" });
    }
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ResuMate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
