const natural = require('natural');
const stopword = require('stopword');
const { skillsSet, skillSynonyms, skillsDatabase } = require('../data/skillsDatabase');

/**
 * NLP Processing Service
 * Handles text preprocessing, tokenization, and normalization
 */

class NLPProcessor {
    constructor() {
        // Initialize tokenizer
        this.tokenizer = new natural.WordTokenizer();
        
        // Initialize stemmer (reduces words to root form)
        this.stemmer = natural.PorterStemmer;
        
        // Additional stopwords specific to resumes
        this.resumeStopwords = [
            'resume', 'cv', 'curriculum', 'vitae', 'experience', 'education',
            'skills', 'work', 'history', 'profile', 'summary', 'objective',
            'references', 'available', 'upon', 'request', 'page', 'phone',
            'email', 'address', 'city', 'state', 'zip', 'country',
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december',
            'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
            'present', 'current', 'year', 'years', 'month', 'months',
            'responsible', 'responsibilities', 'duties', 'role',
            'company', 'organization', 'firm', 'corporation',
            'university', 'college', 'school', 'institute', 'degree'
        ];
    }

    /**
     * Preprocess text for analysis
     * - Lowercase
     * - Remove special characters (keep tech-relevant ones)
     * - Tokenize
     * - Remove stopwords
     * - Apply stemming (optional)
     */
    preprocess(text, options = {}) {
        const {
            stem = false,
            removeStopwords = true,
            preserveTechTerms = true
        } = options;

        if (!text || typeof text !== 'string') {
            return [];
        }

        // Convert to lowercase
        let processedText = text.toLowerCase();

        // Preserve tech terms with special characters (c++, c#, .net, etc.)
        const techTermsMap = new Map();
        if (preserveTechTerms) {
            const techPatterns = [
                /c\+\+/g, /c#/g, /f#/g, /\.net/g, /node\.js/g, /react\.js/g,
                /vue\.js/g, /express\.js/g, /next\.js/g, /nuxt\.js/g,
                /three\.js/g, /d3\.js/g, /web3\.js/g, /ethers\.js/g
            ];
            
            let counter = 0;
            techPatterns.forEach(pattern => {
                processedText = processedText.replace(pattern, (match) => {
                    const placeholder = `__TECH_${counter}__`;
                    techTermsMap.set(placeholder, match.replace('.', '-'));
                    counter++;
                    return placeholder;
                });
            });
        }

        // Replace special characters but keep hyphens
        processedText = processedText
            .replace(/[^\w\s\-\_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Tokenize
        let tokens = this.tokenizer.tokenize(processedText);

        // Restore tech terms
        tokens = tokens.map(token => {
            if (techTermsMap.has(token)) {
                return techTermsMap.get(token);
            }
            return token;
        });

        // Remove stopwords
        if (removeStopwords) {
            // Remove English stopwords
            tokens = stopword.removeStopwords(tokens);
            
            // Remove resume-specific stopwords
            tokens = tokens.filter(token => 
                !this.resumeStopwords.includes(token) && 
                token.length > 1
            );
        }

        // Apply stemming if requested
        if (stem) {
            tokens = tokens.map(token => this.stemmer.stem(token));
        }

        // Normalize skill synonyms
        tokens = tokens.map(token => {
            const normalized = skillSynonyms[token];
            return normalized || token;
        });

        return tokens;
    }

    /**
     * Extract skills from text
     * Returns an array of recognized skills
     */
    extractSkills(text) {
        if (!text) return [];

        const processedTokens = this.preprocess(text, { 
            stem: false, 
            preserveTechTerms: true 
        });
        
        const foundSkills = new Set();
        const textLower = text.toLowerCase();

        // Method 1: Direct token matching
        processedTokens.forEach(token => {
            const normalizedToken = skillSynonyms[token] || token;
            if (skillsSet.has(normalizedToken)) {
                foundSkills.add(normalizedToken);
            }
        });

        // Method 2: N-gram matching (for multi-word skills)
        const multiWordSkills = [
            'machine learning', 'deep learning', 'data science', 'data analysis',
            'web development', 'mobile development', 'cloud computing',
            'continuous integration', 'continuous deployment', 'version control',
            'project management', 'problem solving', 'critical thinking',
            'natural language processing', 'computer vision', 'neural networks',
            'api development', 'database design', 'system design',
            'unit testing', 'integration testing', 'test driven development',
            'agile methodology', 'scrum master', 'product management',
            'user experience', 'user interface', 'responsive design',
            'cross platform', 'full stack', 'front end', 'back end',
            'devops engineer', 'site reliability', 'software engineering',
            'object oriented', 'functional programming', 'microservices architecture',
            'event driven', 'domain driven design', 'clean architecture',
            'distributed systems', 'real time', 'high availability'
        ];

        multiWordSkills.forEach(skill => {
            if (textLower.includes(skill)) {
                foundSkills.add(skill.replace(/\s+/g, '-'));
            }
        });

        // Method 3: Pattern matching for technologies
        const patterns = [
            { pattern: /react(?:\.?js)?/gi, skill: 'reactjs' },
            { pattern: /vue(?:\.?js)?/gi, skill: 'vuejs' },
            { pattern: /angular(?:\.?js)?/gi, skill: 'angularjs' },
            { pattern: /node(?:\.?js)?/gi, skill: 'nodejs' },
            { pattern: /next(?:\.?js)?/gi, skill: 'nextjs' },
            { pattern: /express(?:\.?js)?/gi, skill: 'expressjs' },
            { pattern: /type\s?script/gi, skill: 'typescript' },
            { pattern: /java\s?script/gi, skill: 'javascript' },
            { pattern: /mongo\s?db/gi, skill: 'mongodb' },
            { pattern: /postgre(?:s|sql)/gi, skill: 'postgresql' },
            { pattern: /my\s?sql/gi, skill: 'mysql' },
            { pattern: /docker/gi, skill: 'docker' },
            { pattern: /kubernetes|k8s/gi, skill: 'kubernetes' },
            { pattern: /aws|amazon\s+web\s+services/gi, skill: 'aws' },
            { pattern: /gcp|google\s+cloud/gi, skill: 'gcp' },
            { pattern: /azure/gi, skill: 'azure' },
            { pattern: /python/gi, skill: 'python' },
            { pattern: /java(?!\s*script)/gi, skill: 'java' },
            { pattern: /c\+\+/gi, skill: 'c++' },
            { pattern: /c#|csharp/gi, skill: 'c#' },
            { pattern: /\.net|dotnet/gi, skill: '.net' },
            { pattern: /ruby(?:\s+on\s+rails)?/gi, skill: 'ruby' },
            { pattern: /rails/gi, skill: 'rails' },
            { pattern: /django/gi, skill: 'django' },
            { pattern: /flask/gi, skill: 'flask' },
            { pattern: /spring\s*boot/gi, skill: 'spring-boot' },
            { pattern: /tensorflow/gi, skill: 'tensorflow' },
            { pattern: /pytorch/gi, skill: 'pytorch' },
            { pattern: /scikit[- ]?learn|sklearn/gi, skill: 'scikit-learn' },
            { pattern: /pandas/gi, skill: 'pandas' },
            { pattern: /git(?:hub|lab)?/gi, skill: 'git' },
            { pattern: /jenkins/gi, skill: 'jenkins' },
            { pattern: /terraform/gi, skill: 'terraform' },
            { pattern: /ansible/gi, skill: 'ansible' },
            { pattern: /graphql/gi, skill: 'graphql' },
            { pattern: /rest(?:ful)?\s*api/gi, skill: 'rest' },
            { pattern: /ci\/?cd/gi, skill: 'ci/cd' },
            { pattern: /agile/gi, skill: 'agile' },
            { pattern: /scrum/gi, skill: 'scrum' },
            { pattern: /jira/gi, skill: 'jira' },
            { pattern: /figma/gi, skill: 'figma' },
            { pattern: /tailwind(?:\s*css)?/gi, skill: 'tailwindcss' },
            { pattern: /bootstrap/gi, skill: 'bootstrap' },
            { pattern: /sass|scss/gi, skill: 'sass' },
            { pattern: /redux/gi, skill: 'redux' },
            { pattern: /webpack/gi, skill: 'webpack' },
            { pattern: /vite/gi, skill: 'vite' },
            { pattern: /jest/gi, skill: 'jest' },
            { pattern: /cypress/gi, skill: 'cypress' },
            { pattern: /selenium/gi, skill: 'selenium' },
            { pattern: /linux/gi, skill: 'linux' },
            { pattern: /bash|shell/gi, skill: 'bash' },
            { pattern: /sql/gi, skill: 'sql' },
            { pattern: /nosql/gi, skill: 'nosql' },
            { pattern: /redis/gi, skill: 'redis' },
            { pattern: /elasticsearch/gi, skill: 'elasticsearch' },
            { pattern: /kafka/gi, skill: 'kafka' },
            { pattern: /rabbitmq/gi, skill: 'rabbitmq' },
            { pattern: /nginx/gi, skill: 'nginx' },
            { pattern: /oauth/gi, skill: 'oauth' },
            { pattern: /jwt/gi, skill: 'jwt' },
            { pattern: /blockchain/gi, skill: 'blockchain' },
            { pattern: /solidity/gi, skill: 'solidity' },
            { pattern: /flutter/gi, skill: 'flutter' },
            { pattern: /react\s*native/gi, skill: 'react-native' },
            { pattern: /swift/gi, skill: 'swift' },
            { pattern: /kotlin/gi, skill: 'kotlin' },
            { pattern: /go(?:lang)?/gi, skill: 'go' },
            { pattern: /rust/gi, skill: 'rust' }
        ];

        patterns.forEach(({ pattern, skill }) => {
            if (pattern.test(text)) {
                foundSkills.add(skill);
            }
        });

        return [...foundSkills].sort();
    }

    /**
     * Categorize extracted skills
     */
    categorizeSkills(skills) {
        const categorized = {};
        
        Object.entries(skillsDatabase).forEach(([category, categorySkills]) => {
            const matched = skills.filter(skill => 
                categorySkills.some(cs => 
                    cs.toLowerCase() === skill.toLowerCase() ||
                    cs.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(cs.toLowerCase())
                )
            );
            
            if (matched.length > 0) {
                categorized[category] = matched;
            }
        });

        // Add uncategorized skills
        const allCategorized = Object.values(categorized).flat();
        const uncategorized = skills.filter(skill => !allCategorized.includes(skill));
        
        if (uncategorized.length > 0) {
            categorized['other'] = uncategorized;
        }

        return categorized;
    }

    /**
     * Extract key phrases from text
     */
    extractKeyPhrases(text, topN = 20) {
        const tokens = this.preprocess(text, { stem: false });
        
        // Count frequency
        const frequency = {};
        tokens.forEach(token => {
            frequency[token] = (frequency[token] || 0) + 1;
        });

        // Sort by frequency and return top N
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(([term, count]) => ({ term, count }));
    }

    /**
     * Calculate text statistics
     */
    getTextStats(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

        return {
            characters: text.length,
            words: words.length,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            averageWordLength: words.length > 0 
                ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1)
                : 0,
            averageSentenceLength: sentences.length > 0
                ? (words.length / sentences.length).toFixed(1)
                : 0
        };
    }
}

module.exports = new NLPProcessor();
