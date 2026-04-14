const TFIDF = require('../utils/tfidf');
const { cosineSimilarity, jaccardSimilarity, calculateWeightedSimilarity } = require('../utils/cosineSimilarity');
const nlpProcessor = require('./nlpProcessor');
const { skillWeights, skillsDatabase } = require('../data/skillsDatabase');

/**
 * Skill Matching Service
 * Compares resume against job description using multiple metrics
 */

class SkillMatcher {
    constructor() {
        this.tfidf = new TFIDF();
    }

    /**
     * Main analysis function
     * Compares resume text with job description
     */
    analyze(resumeText, jobDescriptionText) {
        // Clear cache for fresh analysis
        this.tfidf.clearCache();

        // Extract skills from both documents
        const resumeSkills = nlpProcessor.extractSkills(resumeText);
        const jdSkills = nlpProcessor.extractSkills(jobDescriptionText);

        // Calculate skill match metrics
        const skillMatch = this.matchSkills(resumeSkills, jdSkills);

        // Calculate TF-IDF similarity
        const tfidfScore = this.calculateTFIDFSimilarity(resumeText, jobDescriptionText);

        // Calculate overall score with weighted components
        const overallScore = this.calculateOverallScore(skillMatch, tfidfScore);

        // Generate recommendations
        const recommendations = this.generateRecommendations(
            skillMatch, 
            overallScore, 
            resumeText
        );

        // Extract key phrases for insights
        const resumeKeyPhrases = nlpProcessor.extractKeyPhrases(resumeText, 15);
        const jdKeyPhrases = nlpProcessor.extractKeyPhrases(jobDescriptionText, 15);

        // Categorize skills
        const categorizedResumeSkills = nlpProcessor.categorizeSkills(resumeSkills);
        const categorizedJdSkills = nlpProcessor.categorizeSkills(jdSkills);

        // Get text statistics
        const resumeStats = nlpProcessor.getTextStats(resumeText);

        return {
            scores: {
                overall: overallScore,
                skillMatch: skillMatch.percentage,
                tfidfSimilarity: Math.round(tfidfScore * 100),
                keywordDensity: this.calculateKeywordDensity(resumeText, jdSkills)
            },
            skills: {
                resume: {
                    all: resumeSkills,
                    categorized: categorizedResumeSkills,
                    count: resumeSkills.length
                },
                jobDescription: {
                    all: jdSkills,
                    categorized: categorizedJdSkills,
                    count: jdSkills.length
                },
                matched: skillMatch.matched,
                missing: skillMatch.missing,
                additional: skillMatch.additional,
                matchDetails: skillMatch
            },
            analysis: {
                resumeKeyPhrases,
                jdKeyPhrases,
                resumeStats,
                strengthAreas: this.identifyStrengths(categorizedResumeSkills, categorizedJdSkills),
                improvementAreas: this.identifyWeaknesses(categorizedResumeSkills, categorizedJdSkills)
            },
            recommendations,
            summary: this.generateSummary(overallScore, skillMatch, recommendations)
        };
    }

    /**
     * Match skills between resume and job description
     */
    matchSkills(resumeSkills, jdSkills) {
        const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
        const jdSet = new Set(jdSkills.map(s => s.toLowerCase()));

        const matched = [];
        const missing = [];
        const additional = [];

        // Find matched and missing skills
        jdSkills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            if (resumeSet.has(skillLower)) {
                matched.push(skill);
            } else {
                // Check for partial matches
                const partialMatch = resumeSkills.find(rs => 
                    rs.toLowerCase().includes(skillLower) || 
                    skillLower.includes(rs.toLowerCase())
                );
                if (partialMatch) {
                    matched.push(skill);
                } else {
                    missing.push(skill);
                }
            }
        });

        // Find additional skills in resume not required by JD
        resumeSkills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            if (!jdSet.has(skillLower)) {
                const isInMatched = matched.some(m => 
                    m.toLowerCase() === skillLower ||
                    m.toLowerCase().includes(skillLower) ||
                    skillLower.includes(m.toLowerCase())
                );
                if (!isInMatched) {
                    additional.push(skill);
                }
            }
        });

        const percentage = jdSkills.length > 0 
            ? Math.round((matched.length / jdSkills.length) * 100) 
            : 0;

        return {
            matched,
            missing,
            additional,
            percentage,
            total: {
                resume: resumeSkills.length,
                jobDescription: jdSkills.length,
                matched: matched.length,
                missing: missing.length
            }
        };
    }

    /**
     * Calculate TF-IDF based similarity
     */
    calculateTFIDFSimilarity(resumeText, jdText) {
        const documents = [resumeText, jdText];
        
        // Create TF-IDF vectors
        const resumeVector = this.tfidf.createVector(resumeText, documents);
        const jdVector = this.tfidf.createVector(jdText, documents);
        
        // Calculate cosine similarity
        return cosineSimilarity(resumeVector, jdVector);
    }

    /**
     * Calculate keyword density
     */
    calculateKeywordDensity(resumeText, jdSkills) {
        const resumeLower = resumeText.toLowerCase();
        const words = resumeLower.split(/\s+/).length;
        
        let keywordCount = 0;
        jdSkills.forEach(skill => {
            const regex = new RegExp(skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = resumeLower.match(regex);
            if (matches) {
                keywordCount += matches.length;
            }
        });

        return Math.min(100, Math.round((keywordCount / words) * 100 * 10));
    }

    /**
     * Calculate overall weighted score
     */
    calculateOverallScore(skillMatch, tfidfScore) {
        // Weights for different components
        const weights = {
            skillMatch: 0.50,      // 50% weight on skill matching
            tfidf: 0.30,           // 30% weight on text similarity
            coverage: 0.20         // 20% weight on coverage (matched/total)
        };

        const skillScore = skillMatch.percentage;
        const tfidfScorePercent = tfidfScore * 100;
        
        const coverageScore = skillMatch.total.jobDescription > 0
            ? (skillMatch.matched.length / skillMatch.total.jobDescription) * 100
            : 0;

        const weightedScore = 
            (skillScore * weights.skillMatch) +
            (tfidfScorePercent * weights.tfidf) +
            (coverageScore * weights.coverage);

        return Math.min(100, Math.round(weightedScore));
    }

    /**
     * Identify strength areas
     */
    identifyStrengths(resumeCategories, jdCategories) {
        const strengths = [];

        Object.entries(resumeCategories).forEach(([category, skills]) => {
            const jdSkillsInCategory = jdCategories[category] || [];
            const matchedCount = skills.filter(s => 
                jdSkillsInCategory.some(js => 
                    js.toLowerCase() === s.toLowerCase()
                )
            ).length;

            if (matchedCount > 0 && jdSkillsInCategory.length > 0) {
                const percentage = Math.round((matchedCount / jdSkillsInCategory.length) * 100);
                if (percentage >= 70) {
                    strengths.push({
                        category: this.formatCategoryName(category),
                        matchedSkills: matchedCount,
                        requiredSkills: jdSkillsInCategory.length,
                        percentage
                    });
                }
            }
        });

        return strengths.sort((a, b) => b.percentage - a.percentage);
    }

    /**
     * Identify areas for improvement
     */
    identifyWeaknesses(resumeCategories, jdCategories) {
        const weaknesses = [];

        Object.entries(jdCategories).forEach(([category, jdSkills]) => {
            const resumeSkillsInCategory = resumeCategories[category] || [];
            const missingSkills = jdSkills.filter(js => 
                !resumeSkillsInCategory.some(rs => 
                    rs.toLowerCase() === js.toLowerCase()
                )
            );

            if (missingSkills.length > 0) {
                const percentage = Math.round((missingSkills.length / jdSkills.length) * 100);
                if (percentage >= 30) {
                    weaknesses.push({
                        category: this.formatCategoryName(category),
                        missingSkills,
                        missingCount: missingSkills.length,
                        totalRequired: jdSkills.length,
                        percentage
                    });
                }
            }
        });

        return weaknesses.sort((a, b) => b.percentage - a.percentage);
    }

    /**
     * Format category name for display
     */
    formatCategoryName(category) {
        const nameMap = {
            programmingLanguages: 'Programming Languages',
            frontend: 'Frontend Development',
            backend: 'Backend Development',
            databases: 'Databases',
            cloudDevops: 'Cloud & DevOps',
            mobile: 'Mobile Development',
            dataScience: 'Data Science & ML',
            testing: 'Testing & QA',
            versionControl: 'Version Control',
            security: 'Security',
            softSkills: 'Soft Skills',
            design: 'Design',
            architecture: 'Architecture',
            blockchain: 'Blockchain',
            gameDev: 'Game Development',
            embedded: 'Embedded Systems',
            other: 'Other Skills'
        };

        return nameMap[category] || category;
    }

    /**
     * Generate recommendations based on analysis
     */
    generateRecommendations(skillMatch, overallScore, resumeText) {
        const recommendations = [];
        const priority = { high: [], medium: [], low: [] };

        // High priority: Missing critical skills
        if (skillMatch.missing.length > 0) {
            const criticalSkills = skillMatch.missing.slice(0, 5);
            priority.high.push({
                type: 'missing_skills',
                title: 'Add Missing Key Skills',
                description: `Your resume is missing ${skillMatch.missing.length} skills mentioned in the job description.`,
                skills: criticalSkills,
                action: `Consider adding these skills if you have experience: ${criticalSkills.join(', ')}`
            });
        }

        // Medium priority: Improve keyword usage
        if (overallScore < 70) {
            priority.medium.push({
                type: 'keyword_optimization',
                title: 'Optimize Keywords',
                description: 'Your resume could use more relevant keywords from the job description.',
                action: 'Mirror the language used in the job description while describing your experience.'
            });
        }

        // Check resume length
        const wordCount = resumeText.split(/\s+/).length;
        if (wordCount < 200) {
            priority.medium.push({
                type: 'content_length',
                title: 'Add More Detail',
                description: 'Your resume appears brief. Consider adding more details about your experience.',
                action: 'Expand on your achievements and responsibilities for each role.'
            });
        } else if (wordCount > 1500) {
            priority.low.push({
                type: 'content_length',
                title: 'Consider Condensing',
                description: 'Your resume is quite detailed. Consider focusing on the most relevant experience.',
                action: 'Prioritize experiences and skills most relevant to this specific role.'
            });
        }

        // Low priority: Additional skills
        if (skillMatch.additional.length > 10) {
            priority.low.push({
                type: 'additional_skills',
                title: 'Highlight Relevant Skills',
                description: `You have ${skillMatch.additional.length} skills not mentioned in the job description.`,
                action: 'Focus on skills that complement the job requirements or remove less relevant ones.'
            });
        }

        // Score-based recommendations
        if (overallScore >= 80) {
            priority.low.push({
                type: 'strong_match',
                title: 'Strong Match!',
                description: 'Your resume aligns well with this job description.',
                action: 'Focus on crafting a compelling cover letter that highlights your matched skills.'
            });
        } else if (overallScore >= 60) {
            priority.medium.push({
                type: 'good_match',
                title: 'Good Foundation',
                description: 'Your resume has a solid foundation but could be improved.',
                action: 'Focus on addressing the missing skills and optimizing your keywords.'
            });
        } else {
            priority.high.push({
                type: 'needs_improvement',
                title: 'Significant Gap',
                description: 'There\'s a notable gap between your resume and the job requirements.',
                action: 'Consider if this role is the right fit, or significantly revise your resume to highlight relevant experience.'
            });
        }

        return {
            high: priority.high,
            medium: priority.medium,
            low: priority.low,
            totalCount: priority.high.length + priority.medium.length + priority.low.length
        };
    }

    /**
     * Generate a summary of the analysis
     */
    generateSummary(overallScore, skillMatch, recommendations) {
        let matchLevel, description;

        if (overallScore >= 85) {
            matchLevel = 'Excellent';
            description = 'Your resume is an excellent match for this position. You meet most of the key requirements.';
        } else if (overallScore >= 70) {
            matchLevel = 'Good';
            description = 'Your resume is a good match. With some optimization, you can strengthen your application.';
        } else if (overallScore >= 50) {
            matchLevel = 'Moderate';
            description = 'Your resume has a moderate match. Consider addressing the gaps to improve your chances.';
        } else if (overallScore >= 30) {
            matchLevel = 'Fair';
            description = 'Your resume has limited alignment. Significant improvements may be needed for this role.';
        } else {
            matchLevel = 'Low';
            description = 'Your resume has low alignment with this job. This role may require different qualifications.';
        }

        return {
            matchLevel,
            description,
            score: overallScore,
            matchedSkillsCount: skillMatch.matched.length,
            missingSkillsCount: skillMatch.missing.length,
            recommendationsCount: recommendations.totalCount,
            quickStats: {
                matchPercentage: `${skillMatch.percentage}%`,
                skillsCovered: `${skillMatch.matched.length}/${skillMatch.total.jobDescription}`,
                gapCount: skillMatch.missing.length
            }
        };
    }
}

module.exports = new SkillMatcher();
