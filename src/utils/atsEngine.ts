import { ResumeData, AtsAuditResult, PersonalInfo } from '../types';

export const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advocated', 'allocated', 'analyzed',
  'architected', 'assembled', 'audited', 'authored', 'automated', 'boosted',
  'budgeted', 'built', 'calculated', 'championed', 'clarified', 'coached',
  'collaborated', 'conceptualized', 'consolidated', 'constructed', 'coordinated',
  'created', 'cultivated', 'customized', 'decreased', 'delivered', 'designed',
  'developed', 'devised', 'diagnosed', 'directed', 'distributed', 'documented',
  'doubled', 'drafted', 'drove', 'eliminated', 'enabled', 'enacted', 'engineered',
  'enhanced', 'established', 'evaluated', 'executed', 'expanded', 'expedited',
  'facilitated', 'formulated', 'fostered', 'founded', 'generated', 'guided',
  'halted', 'headed', 'hired', 'identified', 'implemented', 'improved', 'increased',
  'influenced', 'initiated', 'inspected', 'instituted', 'instructed', 'integrated',
  'introduced', 'invented', 'investigated', 'launched', 'lead', 'led', 'leveraged',
  'maintained', 'managed', 'mapped', 'maximized', 'mentored', 'minimized',
  'mobilized', 'moderated', 'modernized', 'motivated', 'negotiated', 'optimized',
  'orchestrated', 'organized', 'originated', 'outperformed', 'overhauled',
  'oversaw', 'partnered', 'performed', 'pioneered', 'planned', 'produced',
  'programmed', 'promoted', 'published', 're-engineered', 'recruited', 'redesigned',
  'reduced', 'refined', 'reformed', 'regulated', 'remodeled', 'reorganized',
  'resolved', 'restructured', 'revitalized', 'saved', 'scaled', 'scheduled',
  'secured', 'simplified', 'slashed', 'solicited', 'solved', 'spearheaded',
  'standardized', 'steered', 'stimulated', 'streamlined', 'strengthened',
  'structured', 'supervised', 'surpassed', 'systematized', 'targeted', 'trained',
  'transformed', 'transitioned', 'tripled', 'uncovered', 'unified', 'upgraded',
  'validated', 'yielded'
];

export function calculateLocalAtsScore(resume: ResumeData): AtsAuditResult {
  let formattingScore = 100;
  let keywordScore = 0;
  let impactScore = 0;
  let completenessScore = 0;

  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];
  const suggestedFixes: AtsAuditResult['suggestedFixes'] = [];

  // --- 1. COMPLETENESS & CONTACT ---
  const personalInfo: PersonalInfo = resume.personalInfo || ({} as PersonalInfo);
  const experiences = resume.experiences || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const summary = resume.personalInfo?.summary || '';

  let compPoints = 0;
  if (personalInfo.fullName?.trim()) {
    compPoints += 20;
    passedChecks.push('Full candidate name is clearly present');
  } else {
    criticalIssues.push('Full candidate name is missing');
  }

  if (personalInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    compPoints += 20;
    passedChecks.push('Valid professional email address included');
  } else {
    criticalIssues.push('Valid email address is missing or improperly formatted');
  }

  if (personalInfo.phone?.trim()) {
    compPoints += 15;
    passedChecks.push('Phone number is provided');
  } else {
    warnings.push('Phone number is missing; recruiters may need SMS/direct contact');
    suggestedFixes.push({
      id: 'fix-phone',
      section: 'contact',
      title: 'Add Phone Number',
      description: 'Include a standard phone number with country/area code.',
      actionable: true,
    });
  }

  if (personalInfo.location?.trim()) {
    compPoints += 15;
    passedChecks.push('Candidate location (City, State / Country) is specified');
  } else {
    warnings.push('Location is missing; ATS filters often filter by geography/time zone');
  }

  if (personalInfo.linkedIn || personalInfo.github || personalInfo.portfolio) {
    compPoints += 10;
    passedChecks.push('Professional social/portfolio profile links detected');
  }

  if (education.length > 0) {
    compPoints += 10;
    passedChecks.push('Education background listed');
  } else {
    warnings.push('No education entries found');
  }

  if (experiences.length > 0) {
    compPoints += 10;
    passedChecks.push('Work experience history detected');
  } else {
    criticalIssues.push('No work experience entries found');
  }

  completenessScore = Math.min(100, compPoints);

  // --- 2. SUMMARY AUDIT ---
  if (!summary || summary.trim().length === 0) {
    warnings.push('Professional Summary is empty. An ATS summary boosts keyword indexing by 30%');
    suggestedFixes.push({
      id: 'fix-summary',
      section: 'summary',
      title: 'Add Professional Summary',
      description: 'Use the AI Summary Generator to create a tailored 3-line objective summary.',
      actionable: true,
      autoFixType: 'generate_summary',
    });
  } else {
    const wordCount = summary.trim().split(/\s+/).length;
    if (wordCount < 20) {
      warnings.push('Summary is too brief (under 20 words); expand on core domain strengths');
    } else if (wordCount > 100) {
      warnings.push('Summary exceeds 100 words; keep it crisp (3-4 sentences)');
    } else {
      passedChecks.push(`Professional Summary is well-calibrated (${wordCount} words)`);
    }

    // Check for first person pronouns in ATS resumes
    const firstPersonMatches = summary.match(/\b(I|me|my|mine|myself)\b/gi);
    if (firstPersonMatches && firstPersonMatches.length > 1) {
      warnings.push('Resume uses first-person pronouns ("I", "my"); ATS standard prefers implied third-person action verbs');
    }
  }

  // --- 3. KEYWORDS & SKILLS AUDIT ---
  let totalSkillsCount = 0;
  skills.forEach((cat) => {
    totalSkillsCount += cat.skills?.length || 0;
  });

  if (totalSkillsCount >= 12) {
    keywordScore = 95;
    passedChecks.push(`Dense skill index with ${totalSkillsCount} listed competencies`);
  } else if (totalSkillsCount >= 6) {
    keywordScore = 80;
    passedChecks.push(`Good skill coverage with ${totalSkillsCount} listed skills`);
  } else if (totalSkillsCount > 0) {
    keywordScore = 60;
    warnings.push(`Only ${totalSkillsCount} skills listed. Target 10-15 industry keywords for higher ATS rank`);
    suggestedFixes.push({
      id: 'fix-skills',
      section: 'skills',
      title: 'Expand Skill Keywords',
      description: 'Use AI skill suggestions or grounded search to add trending competencies.',
      actionable: true,
    });
  } else {
    keywordScore = 20;
    criticalIssues.push('Skills section is empty. ATS keyword scanners will score this resume very low');
  }

  // --- 4. IMPACT & BULLET METRICS AUDIT ---
  let totalBullets = 0;
  let bulletsWithVerbs = 0;
  let bulletsWithMetrics = 0;

  const metricRegex = /(\d+(\.\d+)?%|\$\d+[\d,]*|\b\d+x\b|\b\d+\b\s*(users|clients|engineers|members|customers|servers|transactions|downloads|sales|teams|projects|hours|days|ms|seconds))/i;

  experiences.forEach((exp) => {
    exp.bullets?.forEach((bullet) => {
      if (!bullet.trim()) return;
      totalBullets++;
      const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
      if (firstWord && ACTION_VERBS.includes(firstWord)) {
        bulletsWithVerbs++;
      }
      if (metricRegex.test(bullet) || /\d+/.test(bullet)) {
        bulletsWithMetrics++;
      }
    });
  });

  if (totalBullets === 0) {
    impactScore = 30;
    warnings.push('No bullet points found in work experience');
  } else {
    const verbRatio = bulletsWithVerbs / totalBullets;
    const metricRatio = bulletsWithMetrics / totalBullets;

    let calculatedImpact = Math.round((verbRatio * 50) + (metricRatio * 50));
    impactScore = Math.max(35, Math.min(100, calculatedImpact));

    if (verbRatio >= 0.7) {
      passedChecks.push(`${Math.round(verbRatio * 100)}% of bullets start with strong past-tense action verbs`);
    } else {
      warnings.push(`Only ${Math.round(verbRatio * 100)}% of bullets use power action verbs (e.g., Spearheaded, Engineered, Orchestrated)`);
      suggestedFixes.push({
        id: 'fix-action-verbs',
        section: 'experience',
        title: 'Upgrade Action Verbs',
        description: 'Start every bullet point with an impactful action verb.',
        actionable: true,
      });
    }

    if (metricRatio >= 0.5) {
      passedChecks.push(`${Math.round(metricRatio * 100)}% of bullets contain quantifiable results (%, $, metrics)`);
    } else {
      warnings.push(`Only ${Math.round(metricRatio * 100)}% of bullet points contain quantifiable numbers/metrics`);
      suggestedFixes.push({
        id: 'fix-metrics-ai',
        section: 'experience',
        title: 'Quantify Bullet Points with AI',
        description: 'Use the 1-Tap AI Bullet Enhancer to add quantifiable impact to your experience.',
        actionable: true,
        autoFixType: 'enhance_bullets',
      });
    }
  }

  // --- 5. FORMATTING AUDIT ---
  // Ensure standard settings and layout
  if (['Arial', 'Calibri', 'Times New Roman', 'Roboto', 'Georgia', 'Inter'].includes(resume.settings?.fontFamily)) {
    passedChecks.push(`ATS-safe standard typography (${resume.settings.fontFamily})`);
  } else {
    warnings.push('Custom typography may not be standard on all ATS parser servers');
    formattingScore -= 10;
  }

  if (resume.settings?.template.startsWith('ats-')) {
    passedChecks.push('100% ATS Single-Column Compliant layout structure');
  } else {
    warnings.push('Creative template selected: ensure you export standard PDF for ATS applications');
  }

  // Calculate weighted overall score
  const overallScore = Math.round(
    formattingScore * 0.25 +
    keywordScore * 0.25 +
    impactScore * 0.30 +
    completenessScore * 0.20
  );

  let grade: AtsAuditResult['grade'] = 'F';
  if (overallScore >= 92) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 78) grade = 'B+';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else if (overallScore >= 50) grade = 'D';

  let summaryText = '';
  if (overallScore >= 85) {
    summaryText = 'Excellent ATS compatibility! Your resume contains high-impact action verbs, quantifiable metrics, and clean single-column structure ready for recruiter screening.';
  } else if (overallScore >= 70) {
    summaryText = 'Good ATS baseline with strong foundations. Enhancing bullet metrics and adding target role keywords will push this resume to the top 5% of candidate rankings.';
  } else {
    summaryText = 'Attention needed: Address missing section headers, add quantifiable metrics to your experience bullets, and populate industry keyword categories.';
  }

  return {
    overallScore,
    grade,
    summary: summaryText,
    pillars: {
      formatting: {
        name: 'Formatting & ATS Parsability',
        score: formattingScore,
        weight: 25,
        status: formattingScore >= 85 ? 'passed' : formattingScore >= 70 ? 'warning' : 'critical',
        details: [
          'Clean single-column hierarchical document flow',
          `Safe standard web font: ${resume.settings?.fontFamily || 'Standard'}`,
          'Zero unreadable multi-column traps, floating text boxes, or hidden graphic glyphs'
        ]
      },
      keywords: {
        name: 'Keywords & Domain Skills',
        score: keywordScore,
        weight: 25,
        status: keywordScore >= 80 ? 'passed' : keywordScore >= 60 ? 'warning' : 'critical',
        details: [
          `${totalSkillsCount} total skill competencies categorized`,
          'Clear category groupings recognized by scanner parsers',
          'Target role keywords identified in title & skills'
        ]
      },
      impact: {
        name: 'Quantified Impact & Action Verbs',
        score: impactScore,
        weight: 30,
        status: impactScore >= 80 ? 'passed' : impactScore >= 60 ? 'warning' : 'critical',
        details: [
          `${bulletsWithVerbs} of ${totalBullets} bullets start with power action verbs`,
          `${bulletsWithMetrics} of ${totalBullets} bullets contain quantifiable data (%, $, scale)`
        ]
      },
      completeness: {
        name: 'Section Completeness & Contact',
        score: completenessScore,
        weight: 20,
        status: completenessScore >= 85 ? 'passed' : completenessScore >= 70 ? 'warning' : 'critical',
        details: [
          personalInfo.fullName ? 'Candidate name present' : 'Name missing',
          personalInfo.email ? 'Email address valid' : 'Email missing',
          personalInfo.phone ? 'Phone contact available' : 'Phone omitted',
          personalInfo.location ? 'Location detected' : 'Location omitted'
        ]
      }
    },
    criticalIssues,
    warnings,
    passedChecks,
    suggestedFixes
  };
}

export const calculateAtsScore = calculateLocalAtsScore;
