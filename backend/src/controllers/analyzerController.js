const textExtractor = require('../services/textExtractor');
const skillMatcher = require('../services/skillMatcher');

/**
 * Analyzer Controller
 * Handles incoming requests and orchestrates the analysis
 */

class AnalyzerController {
    /**
     * Analyze resume against job description
     */
    async analyzeResume(req, res) {
        try {
            // Validate request
            if (!req.file) {
                return res.status(400).json({
                    error: 'No resume file uploaded',
                    message: 'Please upload a PDF, DOCX, or TXT file'
                });
            }

            if (!req.body.jobDescription) {
                return res.status(400).json({
                    error: 'No job description provided',
                    message: 'Please provide a job description to compare against'
                });
            }

            const { jobDescription } = req.body;
            const file = req.file;

            console.log(`Processing file: ${file.originalname} (${file.mimetype})`);

            // Extract text from resume
            const resumeText = await textExtractor.extract(file.buffer, file.mimetype);

            if (!resumeText || resumeText.trim().length < 50) {
                return res.status(400).json({
                    error: 'Insufficient content',
                    message: 'The uploaded file contains too little text to analyze'
                });
            }

            // Perform analysis
            const analysis = skillMatcher.analyze(resumeText, jobDescription);

            // Add file info to response
            const fileInfo = textExtractor.getFileInfo(
                file.buffer, 
                file.mimetype, 
                file.originalname
            );

            res.json({
                success: true,
                fileInfo,
                analysis,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Analysis error:', error);
            
            res.status(500).json({
                error: 'Analysis failed',
                message: error.message || 'An unexpected error occurred during analysis'
            });
        }
    }

    /**
     * Analyze text directly (without file upload)
     */
    async analyzeText(req, res) {
        try {
            const { resumeText, jobDescription } = req.body;

            if (!resumeText || resumeText.trim().length < 50) {
                return res.status(400).json({
                    error: 'Invalid resume text',
                    message: 'Please provide at least 50 characters of resume content'
                });
            }

            if (!jobDescription || jobDescription.trim().length < 20) {
                return res.status(400).json({
                    error: 'Invalid job description',
                    message: 'Please provide a more detailed job description'
                });
            }

            // Perform analysis
            const analysis = skillMatcher.analyze(resumeText, jobDescription);

            res.json({
                success: true,
                analysis,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Text analysis error:', error);
            
            res.status(500).json({
                error: 'Analysis failed',
                message: error.message || 'An unexpected error occurred'
            });
        }
    }

    /**
     * Health check endpoint
     */
    healthCheck(req, res) {
        res.json({
            status: 'healthy',
            service: 'Resume Analyzer API',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = new AnalyzerController();
