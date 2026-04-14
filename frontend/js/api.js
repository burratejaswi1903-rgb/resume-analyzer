/**
 * API Service
 * Handles all communication with the backend
 */

const API = {
// Force it to use your local backend
    baseURL: 'https://resume-analyzer-api-xxxx.onrender.com',
    /**
     * Analyze resume with file upload
     * @param {File} resumeFile - The resume file
     * @param {string} jobDescription - Job description text
     * @returns {Promise<Object>} Analysis results
     */
    async analyzeResume(resumeFile, jobDescription) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobDescription', jobDescription);

        try {
            const response = await fetch(`${this.baseURL}/api/analyze`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Analysis failed');
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to server. Please check if the server is running.');
            }
            throw error;
        }
    },

    /**
     * Analyze resume text directly (without file upload)
     * @param {string} resumeText - Resume content as text
     * @param {string} jobDescription - Job description text
     * @returns {Promise<Object>} Analysis results
     */
    async analyzeText(resumeText, jobDescription) {
        try {
            const response = await fetch(`${this.baseURL}/api/analyze-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ resumeText, jobDescription })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Analysis failed');
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Unable to connect to server. Please check if the server is running.');
            }
            throw error;
        }
    },

    /**
     * Check API health
     * @returns {Promise<Object>} Health status
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return await response.json();
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    },

    /**
     * Set custom base URL (useful for deployment)
     * @param {string} url - New base URL
     */
    setBaseURL(url) {
        this.baseURL = url.replace(/\/$/, ''); // Remove trailing slash
    }
};

// Make it globally available
window.API = API;
