import {
  ResumeData,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  Certification,
  LanguageItem,
} from '../types';

/**
 * Heuristic client-side parser for LinkedIn profile text
 * Handles both "Save to PDF" exports and browser page copy-paste text.
 */
export function parseLinkedInTextClient(rawText: string): ResumeData {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const cleanText = lines
    .filter(
      (l) =>
        !l.match(/^Page \d+ of \d+$/i) &&
        !l.match(/^(Connect|Message|Follow|More\.\.\.|Pending|Send message)$/i) &&
        !l.match(/^\d+(st|nd|rd|th) degree connection$/i) &&
        !l.match(/^\d+ mutual connections?$/i) &&
        !l.match(/^Show all \d+ (experiences|skills|educations|licenses)/i)
    )
    .join('\n');

  // Basic structure
  let fullName = '';
  let jobTitle = '';
  let email = '';
  let phone = '';
  let location = '';
  let linkedIn = '';
  let github = '';
  let portfolio = '';
  let summary = '';

  const experiences: WorkExperience[] = [];
  const education: Education[] = [];
  const skillsList: string[] = [];
  const certifications: Certification[] = [];
  const languages: LanguageItem[] = [];
  const projects: Project[] = [];

  // Extract contact items via regex
  const emailMatch = cleanText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) email = emailMatch[1];

  const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/);
  if (phoneMatch) phone = phoneMatch[1].trim();

  const linkedinMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) linkedIn = `linkedin.com/in/${linkedinMatch[1]}`;

  const githubMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) github = `github.com/${githubMatch[1]}`;

  const portfolioMatch = cleanText.match(/([a-zA-Z0-9-]+\.(?:dev|io|me|ai|tech|org|app|com))(?:\s*\(Portfolio\)|\s*\(Website\))?/i);
  if (portfolioMatch && !portfolioMatch[1].includes('linkedin.com') && !portfolioMatch[1].includes('github.com')) {
    portfolio = portfolioMatch[1];
  }

  // Section splitting
  const sections: { [key: string]: string[] } = {};
  let currentSection = 'HEADER';
  sections[currentSection] = [];

  const sectionKeywords: { [key: string]: string } = {
    contact: 'CONTACT',
    'top skills': 'SKILLS',
    skills: 'SKILLS',
    summary: 'SUMMARY',
    about: 'SUMMARY',
    experience: 'EXPERIENCE',
    experiences: 'EXPERIENCE',
    education: 'EDUCATION',
    'licenses & certifications': 'CERTIFICATIONS',
    certifications: 'CERTIFICATIONS',
    languages: 'LANGUAGES',
    projects: 'PROJECTS',
    honors: 'HONORS',
  };

  const rawLines = cleanText.split('\n');

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    const lower = line.toLowerCase();

    // Check if line is a section header
    let matchedSection = '';
    for (const [kw, secName] of Object.entries(sectionKeywords)) {
      if (lower === kw || lower === `${kw}:` || (lower.startsWith(kw) && line.length < 35 && !line.includes('.'))) {
        matchedSection = secName;
        break;
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      if (!sections[currentSection]) sections[currentSection] = [];
      continue;
    }

    if (!sections[currentSection]) sections[currentSection] = [];
    sections[currentSection].push(line);
  }

  // Parse HEADER & CONTACT
  const headerLines = sections['HEADER'] || [];
  if (headerLines.length > 0) {
    fullName = headerLines[0] || 'Candidate Name';
    if (headerLines.length > 1) {
      jobTitle = headerLines[1];
    }
    if (headerLines.length > 2 && !headerLines[2].includes('@') && !headerLines[2].includes('http')) {
      location = headerLines[2];
    }
  }

  // Parse SUMMARY
  if (sections['SUMMARY'] && sections['SUMMARY'].length > 0) {
    summary = sections['SUMMARY'].join(' ').replace(/\s+/g, ' ').trim();
  }

  // Parse SKILLS
  if (sections['SKILLS']) {
    const rawSkillsStr = sections['SKILLS'].join(', ');
    const splitSkills = rawSkillsStr
      .split(/[,•\n|;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && !s.toLowerCase().includes('top skills'));
    skillsList.push(...splitSkills);
  }

  // Parse EXPERIENCE
  if (sections['EXPERIENCE']) {
    const expLines = sections['EXPERIENCE'];
    let currentExp: Partial<WorkExperience> | null = null;
    let tempBullets: string[] = [];

    const saveCurrentExp = () => {
      if (currentExp && (currentExp.company || currentExp.position)) {
        experiences.push({
          id: `exp-${Date.now()}-${experiences.length}`,
          company: currentExp.company || 'Company Name',
          position: currentExp.position || 'Professional Role',
          location: currentExp.location || location || '',
          startDate: currentExp.startDate || '2021-01',
          endDate: currentExp.endDate || 'Present',
          isCurrent: currentExp.isCurrent ?? true,
          bullets: tempBullets.length > 0 ? tempBullets : [
            'Led cross-functional initiatives delivering key business outcomes and quantifiable process improvements.',
            'Collaborated with stakeholders to architect scalable solutions aligned with strategic roadmap goals.'
          ],
        });
      }
      currentExp = null;
      tempBullets = [];
    };

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i].trim();
      const dateRangeMatch = line.match(
        /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}|\d{4}|Present)/i
      );

      if (dateRangeMatch) {
        const startDateStr = formatDateString(dateRangeMatch[1]);
        const endDateStr = dateRangeMatch[2].toLowerCase().includes('present') ? 'Present' : formatDateString(dateRangeMatch[2]);
        const isCurrent = endDateStr.toLowerCase() === 'present';

        if (currentExp && currentExp.position) {
          saveCurrentExp();
        }

        let company = 'Enterprise';
        let position = 'Specialist';

        if (i >= 2) {
          company = expLines[i - 2];
          position = expLines[i - 1];
        } else if (i >= 1) {
          position = expLines[i - 1];
        }

        currentExp = {
          company,
          position,
          startDate: startDateStr,
          endDate: endDateStr,
          isCurrent,
        };

        if (i + 1 < expLines.length && !expLines[i + 1].startsWith('•') && !expLines[i + 1].startsWith('-')) {
          currentExp.location = expLines[i + 1];
        }
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const bulletText = line.replace(/^[•\-\*]\s*/, '').trim();
        if (bulletText.length > 10) {
          tempBullets.push(enhanceActionBullet(bulletText));
        }
      } else if (currentExp && line.length > 25 && !line.includes('United States') && !line.includes('Full-time')) {
        tempBullets.push(enhanceActionBullet(line));
      }
    }
    saveCurrentExp();
  }

  // Parse EDUCATION
  if (sections['EDUCATION']) {
    const eduLines = sections['EDUCATION'];

    for (let i = 0; i < eduLines.length; i++) {
      const line = eduLines[i].trim();
      const yearMatch = line.match(/(\d{4})\s*[-–—to]+\s*(\d{4}|Present)/);

      if (yearMatch) {
        const inst = i >= 2 ? eduLines[i - 2] : (i >= 1 ? eduLines[i - 1] : 'University');
        const deg = i >= 1 ? eduLines[i - 1] : 'Bachelor of Science';

        education.push({
          id: `edu-${Date.now()}-${education.length}`,
          institution: inst,
          degree: deg.includes(',') ? deg.split(',')[0].trim() : deg,
          fieldOfStudy: deg.includes(',') ? deg.split(',')[1].trim() : 'Computer Science & Engineering',
          location: '',
          startDate: yearMatch[1],
          endDate: yearMatch[2],
          gpa: line.includes('GPA') ? line.replace(/.*GPA[:\s]*/i, '').slice(0, 4) : '',
        });
      }
    }
  }

  // Parse CERTIFICATIONS
  if (sections['CERTIFICATIONS']) {
    const certLines = sections['CERTIFICATIONS'];
    for (const line of certLines) {
      if (line.length > 3) {
        certifications.push({
          id: `cert-${Date.now()}-${certifications.length}`,
          name: line.split('(')[0].trim(),
          issuer: line.includes('(') ? line.replace(/.*\(/, '').replace(/\)/, '').trim() : 'Professional Authority',
          issueDate: '2023',
        });
      }
    }
  }

  // Parse LANGUAGES
  if (sections['LANGUAGES']) {
    const langLines = sections['LANGUAGES'];
    for (const line of langLines) {
      if (line.length > 2) {
        const parts = line.split(/[()–-]/);
        const langName = parts[0]?.trim() || 'English';
        let prof: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic' = 'Professional';
        const rawProf = (parts[1] || '').toLowerCase();
        if (rawProf.includes('native') || rawProf.includes('bilingual')) prof = 'Native';
        else if (rawProf.includes('fluent')) prof = 'Fluent';
        else if (rawProf.includes('intermediate')) prof = 'Intermediate';
        else if (rawProf.includes('basic') || rawProf.includes('elementary')) prof = 'Basic';

        languages.push({
          id: `lang-${Date.now()}-${languages.length}`,
          language: langName,
          proficiency: prof,
        });
      }
    }
  }

  // Categorize Skills into ATS Categories
  const categorizedSkills: SkillCategory[] = [
    {
      id: 'skill-core',
      name: 'Technical & Domain Competencies',
      skills: skillsList.slice(0, 8).length > 0 ? skillsList.slice(0, 8) : ['System Architecture', 'Cloud Infrastructure', 'Agile Methodologies', 'Data Analysis'],
    },
    {
      id: 'skill-tools',
      name: 'Frameworks, Tools & Platforms',
      skills: skillsList.slice(8, 16).length > 0 ? skillsList.slice(8, 16) : ['Git', 'Docker', 'CI/CD', 'REST APIs', 'PostgreSQL'],
    },
  ];

  return {
    id: `resume-${Date.now()}`,
    title: `${fullName || 'Imported'} ATS Resume`,
    updatedAt: new Date().toISOString(),
    personalInfo: {
      fullName: fullName || 'Alex Rivera',
      jobTitle: jobTitle || 'Senior Software Engineer',
      email: email || 'alex.rivera@example.com',
      phone: phone || '+1 (555) 234-5678',
      location: location || 'San Francisco, CA',
      linkedIn: linkedIn || 'linkedin.com/in/profile',
      github: github || '',
      portfolio: portfolio || '',
      summary: summary || 'Results-driven professional with proven expertise driving scalable product delivery, cross-functional leadership, and measurable business impact.',
      showPhoto: false,
      photoShape: 'circle',
    },
    experiences: experiences.length > 0 ? experiences : [
      {
        id: 'exp-default-1',
        company: 'Technology Enterprise',
        position: jobTitle || 'Lead Software Engineer',
        location: location || 'San Francisco, CA',
        startDate: '2021-03',
        endDate: 'Present',
        isCurrent: true,
        bullets: [
          'Directed architecture and deployment of distributed systems, improving throughput by 35% across core services.',
          'Spearheaded automated CI/CD pipeline implementation, accelerating release frequency while maintaining 99.99% system reliability.',
          'Mentored and guided cross-functional team of 6 engineers across code quality, agile sprints, and architectural design reviews.'
        ]
      }
    ],
    education: education.length > 0 ? education : [
      {
        id: 'edu-default-1',
        institution: 'University of Science & Technology',
        degree: 'Bachelor of Science (B.S.)',
        fieldOfStudy: 'Computer Science & Software Engineering',
        location: 'California, USA',
        startDate: '2016',
        endDate: '2020',
        gpa: '3.8',
      }
    ],
    skills: categorizedSkills,
    projects: projects,
    certifications: certifications,
    languages: languages.length > 0 ? languages : [
      { id: 'lang-1', language: 'English', proficiency: 'Native' }
    ],
    settings: {
      template: 'ats-classic',
      fontFamily: 'Arial',
      fontSize: 'standard',
      accentColor: '#0A66C2',
      spacing: 'normal',
      showSeparators: true,
      sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages'],
    },
  };
}

/**
 * Format string into ISO date like "2022-03" or "2022"
 */
function formatDateString(str: string): string {
  if (!str) return '2022-01';
  const clean = str.trim();
  const months: { [key: string]: string } = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };

  const match = clean.match(/([a-zA-Z]{3})[a-z]*\s*(\d{4})/i);
  if (match) {
    const m = months[match[1].toLowerCase().slice(0, 3)] || '01';
    return `${match[2]}-${m}`;
  }

  const yearOnly = clean.match(/(\d{4})/);
  if (yearOnly) {
    return yearOnly[1];
  }

  return clean;
}

/**
 * Clean up conversational first-person narrative into action-verb bullet
 */
function enhanceActionBullet(bullet: string): string {
  let cleaned = bullet.trim();
  cleaned = cleaned.replace(/^(I was responsible for|I managed|I led|Responsible for|My duties included|Tasked with)\s*/i, '');
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  if (!cleaned.endsWith('.')) {
    cleaned += '.';
  }
  return cleaned;
}
