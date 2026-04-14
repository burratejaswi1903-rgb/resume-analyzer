/**
 * Main Application Logic
 * Handles UI interactions and orchestrates the analysis flow
 */

class ResumeAnalyzerApp {
    constructor() {
        this.resumeFile = null;
        this.analysisData = null;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.checkServerHealth();
    }

    cacheElements() {
        // Upload elements
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('resumeFile');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.removeFileBtn = document.getElementById('removeFile');
        
        // Job description
        this.jobDescriptionInput = document.getElementById('jobDescription');
        this.charCount = document.getElementById('charCount');
        
        // Buttons
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.analyzeAgainBtn = document.getElementById('analyzeAgainBtn');
        this.downloadReportBtn = document.getElementById('downloadReport');
        
        // States
        this.loadingState = document.getElementById('loadingState');
        this.resultsSection = document.getElementById('resultsSection');
        
        // Results elements
        this.matchedCount = document.getElementById('matchedCount');
        this.missingCount = document.getElementById('missingCount');
        this.additionalCount = document.getElementById('additionalCount');
        this.summaryDescription = document.getElementById('summaryDescription');
        this.matchedSkills = document.getElementById('matchedSkills');
        this.missingSkills = document.getElementById('missingSkills');
        this.additionalSkills = document.getElementById('additionalSkills');
        this.recommendationsList = document.getElementById('recommendationsList');
    }

    bindEvents() {
        // File upload - drag and drop
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', () => this.handleDragLeave());
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Remove file
        this.removeFileBtn.addEventListener('click', () => this.removeFile());
        
        // Job description
        this.jobDescriptionInput.addEventListener('input', () => this.updateCharCount());
        
        // Analyze button
        this.analyzeBtn.addEventListener('click', () => this.analyzeResume());
        
        // Analyze again
        this.analyzeAgainBtn.addEventListener('click', () => this.resetForm());
        
        // Download report
        this.downloadReportBtn.addEventListener('click', () => this.downloadReport());
    }

    async checkServerHealth() {
        try {
            const health = await API.checkHealth();
            if (health.status !== 'healthy') {
                this.showNotification('Server is not responding. Please try again later.', 'warning');
            }
        } catch (error) {
            console.warn('Health check failed:', error);
        }
    }

    // File handling
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave() {
        this.dropZone.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain'
        ];
        
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Invalid file type. Please upload a PDF, DOCX, DOC, or TXT file.', 'error');
            return;
        }
        
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File too large. Maximum size is 5MB.', 'error');
            return;
        }
        
        this.resumeFile = file;
        this.showFileInfo(file);
        this.updateAnalyzeButton();
    }

    showFileInfo(file) {
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        this.fileInfo.style.display = 'flex';
        this.dropZone.style.display = 'none';
    }

    removeFile() {
        this.resumeFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.dropZone.style.display = 'block';
        this.updateAnalyzeButton();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Job description handling
    updateCharCount() {
        const count = this.jobDescriptionInput.value.length;
        this.charCount.textContent = count;
        this.updateAnalyzeButton();
    }

    updateAnalyzeButton() {
        const hasFile = this.resumeFile !== null;
        const hasJD = this.jobDescriptionInput.value.trim().length >= 20;
        this.analyzeBtn.disabled = !(hasFile && hasJD);
    }

    // Analysis
    async analyzeResume() {
        const jobDescription = this.jobDescriptionInput.value.trim();
        
        if (!this.resumeFile || !jobDescription) {
            this.showNotification('Please upload a resume and provide a job description.', 'error');
            return;
        }

        // Show loading state
        this.showLoading(true);

        try {
            const result = await API.analyzeResume(this.resumeFile, jobDescription);
            
            if (result.success) {
                this.analysisData = result;
                this.displayResults(result);
            } else {
                throw new Error(result.message || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification(error.message || 'Failed to analyze resume. Please try again.', 'error');
            this.showLoading(false);
        }
    }

    showLoading(show) {
        if (show) {
            this.analyzeBtn.disabled = true;
            this.loadingState.style.display = 'block';
            this.resultsSection.style.display = 'none';
        } else {
            this.analyzeBtn.disabled = false;
            this.loadingState.style.display = 'none';
        }
    }

    displayResults(data) {
        const analysis = data.analysis;
        
        // Hide loading, show results
        this.showLoading(false);
        this.resultsSection.style.display = 'block';
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Animate score circle
        Charts.animateScoreCircle(analysis.scores.overall);
        
        // Update stats
        this.matchedCount.textContent = analysis.skills.matched.length;
        this.missingCount.textContent = analysis.skills.missing.length;
        this.additionalCount.textContent = analysis.skills.additional.length;
        
        // Update summary description
        this.summaryDescription.textContent = analysis.summary.description;
        
        // Create charts
        setTimeout(() => {
            Charts.createScoreChart(analysis.scores);
            Charts.createSkillsChart(analysis.skills);
        }, 100);
        
        // Display skills
        this.displaySkillTags(this.matchedSkills, analysis.skills.matched, 'matched');
        this.displaySkillTags(this.missingSkills, analysis.skills.missing, 'missing');
        this.displaySkillTags(this.additionalSkills, analysis.skills.additional, 'additional');
        
        // Display recommendations
        this.displayRecommendations(analysis.recommendations);
    }

    displaySkillTags(container, skills, type) {
        container.innerHTML = '';
        
        if (skills.length === 0) {
            container.innerHTML = `<div class="empty-state">No ${type} skills</div>`;
            return;
        }
        
        skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            container.appendChild(tag);
        });
    }

    displayRecommendations(recommendations) {
        this.recommendationsList.innerHTML = '';
        
        const allRecs = [
            ...recommendations.high.map(r => ({ ...r, priority: 'high' })),
            ...recommendations.medium.map(r => ({ ...r, priority: 'medium' })),
            ...recommendations.low.map(r => ({ ...r, priority: 'low' }))
        ];
        
        if (allRecs.length === 0) {
            this.recommendationsList.innerHTML = '<div class="empty-state">No recommendations at this time.</div>';
            return;
        }
        
        allRecs.forEach(rec => {
            const item = document.createElement('div');
            item.className = `recommendation-item ${rec.priority}`;
            
            let skillsHtml = '';
            if (rec.skills && rec.skills.length > 0) {
                skillsHtml = `
                    <div class="recommendation-skills">
                        ${rec.skills.map(s => `<span class="recommendation-skill">${s}</span>`).join('')}
                    </div>
                `;
            }
            
            item.innerHTML = `
                <div class="recommendation-header">
                    <span class="recommendation-priority">${rec.priority}</span>
                    <span class="recommendation-title">${rec.title}</span>
                </div>
                <p class="recommendation-description">${rec.description}</p>
                ${rec.action ? `<p class="recommendation-action">${rec.action}</p>` : ''}
                ${skillsHtml}
            `;
            
            this.recommendationsList.appendChild(item);
        });
    }

    downloadReport() {
        if (!this.analysisData) {
            this.showNotification('No analysis data available to download.', 'error');
            return;
        }
        
        try {
            PDFReport.generate(this.analysisData);
            this.showNotification('Report downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('Failed to generate PDF. Please try again.', 'error');
        }
    }

    resetForm() {
        // Reset file
        this.removeFile();
        
        // Reset job description
        this.jobDescriptionInput.value = '';
        this.charCount.textContent = '0';
        
        // Hide results
        this.resultsSection.style.display = 'none';
        
        // Destroy charts
        Charts.destroyAll();
        
        // Clear analysis data
        this.analysisData = null;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    background: white;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                }
                .notification-success { border-left: 4px solid #10b981; }
                .notification-error { border-left: 4px solid #ef4444; }
                .notification-warning { border-left: 4px solid #f59e0b; }
                .notification-info { border-left: 4px solid #6366f1; }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    color: #9ca3af;
                }
                .notification-close:hover { color: #374151; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ResumeAnalyzerApp();
});
