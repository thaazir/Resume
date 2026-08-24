import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../types';

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 65,
      origin: { y: 0.65 },
      colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
    });
  } catch (e) {
    // ignore
  }
}

export function triggerCelebration() {
  triggerConfetti();
}

export async function exportToPdf(elementId: string, fileName: string = 'Resume.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Generate canvas with high pixel ratio for print clarity
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(fileName);
  triggerConfetti();
}

export function exportToPlainText(resume: ResumeData): string {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = resume;
  const lines: string[] = [];

  // Header
  lines.push((personalInfo.fullName || 'RESUME').toUpperCase());
  if (personalInfo.jobTitle) lines.push(personalInfo.jobTitle);
  const contacts: string[] = [];
  if (personalInfo.email) contacts.push(personalInfo.email);
  if (personalInfo.phone) contacts.push(personalInfo.phone);
  if (personalInfo.location) contacts.push(personalInfo.location);
  if (personalInfo.linkedIn) contacts.push(personalInfo.linkedIn);
  if (personalInfo.github) contacts.push(personalInfo.github);
  if (personalInfo.portfolio) contacts.push(personalInfo.portfolio);
  if (contacts.length > 0) lines.push(contacts.join(' | '));
  lines.push('--------------------------------------------------\n');

  // Summary
  if (personalInfo.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(personalInfo.summary);
    lines.push('\n');
  }

  // Work Experience
  if (experiences && experiences.length > 0) {
    lines.push('WORK EXPERIENCE');
    experiences.forEach((exp) => {
      lines.push(`${exp.position.toUpperCase()} | ${exp.company} - ${exp.location}`);
      lines.push(`${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}`);
      exp.bullets.forEach((b) => {
        if (b.trim()) lines.push(`* ${b.trim()}`);
      });
      lines.push('');
    });
  }

  // Skills
  if (skills && skills.length > 0) {
    lines.push('SKILLS & COMPETENCIES');
    skills.forEach((cat) => {
      if (cat.skills && cat.skills.length > 0) {
        lines.push(`${cat.name}: ${cat.skills.join(', ')}`);
      }
    });
    lines.push('\n');
  }

  // Education
  if (education && education.length > 0) {
    lines.push('EDUCATION');
    education.forEach((edu) => {
      lines.push(`${edu.degree} in ${edu.fieldOfStudy}`);
      lines.push(`${edu.institution} - ${edu.location} (${edu.startDate} - ${edu.endDate})`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.honors) lines.push(`Honors: ${edu.honors}`);
      if (edu.relevantCoursework && edu.relevantCoursework.length > 0) {
        lines.push(`Relevant Coursework: ${edu.relevantCoursework.join(', ')}`);
      }
      lines.push('');
    });
  }

  // Projects
  if (projects && projects.length > 0) {
    lines.push('PROJECTS');
    projects.forEach((proj) => {
      lines.push(`${proj.title} ${proj.technologies?.length ? `(${proj.technologies.join(', ')})` : ''}`);
      if (proj.link) lines.push(`Link: ${proj.link}`);
      proj.bullets.forEach((b) => {
        if (b.trim()) lines.push(`* ${b.trim()}`);
      });
      lines.push('');
    });
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    certifications.forEach((cert) => {
      lines.push(`${cert.name} - ${cert.issuer} (${cert.issueDate})`);
    });
    lines.push('\n');
  }

  // Languages
  if (languages && languages.length > 0) {
    lines.push('LANGUAGES');
    lines.push(languages.map((l) => `${l.language} (${l.proficiency})`).join(', '));
    lines.push('\n');
  }

  return lines.join('\n');
}

export function exportToJson(resume: ResumeData) {
  const jsonStr = JSON.stringify(resume, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedName = (resume.personalInfo.fullName || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${sanitizedName}_Backup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  triggerConfetti();
}

export function downloadPlainTextResume(resume: ResumeData) {
  const text = exportToPlainText(resume);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedName = (resume.personalInfo.fullName || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${sanitizedName}_ATS_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  triggerCelebration();
}

export function downloadDocxResume(resume: ResumeData) {
  const plainText = exportToPlainText(resume);
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${resume.personalInfo.fullName || 'Resume'}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.35; color: #111827; }
      h1 { font-size: 18pt; margin-bottom: 2pt; color: #0f172a; text-transform: uppercase; }
      h2 { font-size: 12pt; border-bottom: 1.5pt solid #334155; margin-top: 14pt; margin-bottom: 4pt; color: #1e293b; text-transform: uppercase; }
      .contact { font-size: 9.5pt; color: #475569; margin-bottom: 10pt; }
      .role-header { font-weight: bold; }
      .date { font-style: italic; color: #64748b; }
      ul { margin-top: 3pt; margin-bottom: 6pt; padding-left: 18pt; }
      li { margin-bottom: 2pt; }
    </style>
    </head>
    <body>
      <div style="max-width: 700px; margin: 0 auto;">
        <pre style="font-family: inherit; white-space: pre-wrap;">${plainText}</pre>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedName = (resume.personalInfo.fullName || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${sanitizedName}_ATS_Resume.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  triggerCelebration();
}

export function downloadJsonResume(resume: ResumeData) {
  exportToJson(resume);
}

export function printResumeDocument() {
  window.print();
  triggerCelebration();
}
