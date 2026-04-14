/**
 * Charts Module
 * Handles all Chart.js visualizations
 */

const Charts = {
    scoreChart: null,
    skillsChart: null,

    // Color palette
    colors: {
        primary: '#6366f1',
        secondary: '#0ea5e9',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        gray: '#9ca3af'
    },

    /**
     * Initialize or update the score breakdown chart
     * @param {Object} scores - Score data
     */
    createScoreChart(scores) {
        const ctx = document.getElementById('scoreChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.scoreChart) {
            this.scoreChart.destroy();
        }

        const data = {
            labels: ['Overall Match', 'Skill Match', 'Content Similarity', 'Keyword Density'],
            datasets: [{
                data: [
                    scores.overall,
                    scores.skillMatch,
                    scores.tfidfSimilarity,
                    scores.keywordDensity
                ],
                backgroundColor: [
                    this.colors.primary,
                    this.colors.success,
                    this.colors.secondary,
                    this.colors.warning
                ],
                borderColor: [
                    this.colors.primary,
                    this.colors.success,
                    this.colors.secondary,
                    this.colors.warning
                ],
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 40
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        };

        this.scoreChart = new Chart(ctx, config);
    },

    /**
     * Create skills distribution chart
     * @param {Object} skillsData - Skills data
     */
    createSkillsChart(skillsData) {
        const ctx = document.getElementById('skillsChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.skillsChart) {
            this.skillsChart.destroy();
        }

        const data = {
            labels: ['Matched', 'Missing', 'Additional'],
            datasets: [{
                data: [
                    skillsData.matched.length,
                    skillsData.missing.length,
                    skillsData.additional.length
                ],
                backgroundColor: [
                    this.colors.success,
                    this.colors.danger,
                    this.colors.secondary
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 
                                    ? Math.round((context.raw / total) * 100) 
                                    : 0;
                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };

        this.skillsChart = new Chart(ctx, config);
    },

    /**
     * Animate the score circle
     * @param {number} score - Score value (0-100)
     */
    animateScoreCircle(score) {
        const scoreFill = document.getElementById('scoreFill');
        const scoreValue = document.getElementById('scoreValue');
        const scoreLabel = document.getElementById('scoreLabel');

        if (!scoreFill || !scoreValue) return;

        // Determine color based on score
        let color, label;
        if (score >= 80) {
            color = this.colors.success;
            label = 'Excellent Match';
        } else if (score >= 60) {
            color = '#84cc16'; // lime
            label = 'Good Match';
        } else if (score >= 40) {
            color = this.colors.warning;
            label = 'Moderate Match';
        } else {
            color = this.colors.danger;
            label = 'Needs Improvement';
        }

        // Animate the score
        let currentScore = 0;
        const duration = 1500;
        const steps = 60;
        const increment = score / steps;
        const stepDuration = duration / steps;

        const animate = () => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                scoreFill.style.strokeDasharray = `${score}, 100`;
                scoreValue.textContent = `${score}%`;
            } else {
                scoreFill.style.strokeDasharray = `${Math.round(currentScore)}, 100`;
                scoreValue.textContent = `${Math.round(currentScore)}%`;
                setTimeout(animate, stepDuration);
            }
        };

        // Set color
        scoreFill.style.stroke = color;
        if (scoreLabel) {
            scoreLabel.textContent = label;
            scoreLabel.style.color = color;
        }

        // Start animation
        animate();
    },

    /**
     * Destroy all charts
     */
    destroyAll() {
        if (this.scoreChart) {
            this.scoreChart.destroy();
            this.scoreChart = null;
        }
        if (this.skillsChart) {
            this.skillsChart.destroy();
            this.skillsChart = null;
        }
    }
};

// Make it globally available
window.Charts = Charts;
