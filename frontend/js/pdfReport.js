/**
 * PDF Report Generator
 * Creates downloadable PDF reports using jsPDF
 */

const PDFReport = {
    /**
     * Generate and download PDF report
     * @param {Object} data - Analysis data
     */
    generate(data) {
    // Safely grab jsPDF regardless of how the browser attached it
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let y = margin;

        // Helper function to add new page if needed
        const checkNewPage = (requiredSpace = 30) => {
            if (y + requiredSpace > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = margin;
                return true;
            }
            return false;
        };

        // Title
        doc.setFontSize(24);
        doc.setTextColor(99, 102, 241); // Primary color
        doc.text('Resume Analysis Report', margin, y);
        y += 15;

        // Date
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // Gray
        doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
        y += 15;

        // Summary Section
        doc.setFontSize(16);
        doc.setTextColor(17, 24, 39); // Dark
        doc.text('Summary', margin, y);
        y += 10;

        // Score box
        doc.setFillColor(99, 102, 241);
        doc.roundedRect(margin, y, 50, 30, 3, 3, 'F');
        
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text(`${data.analysis.scores.overall}%`, margin + 10, y + 20);
        
        doc.setFontSize(12);
        doc.setTextColor(17, 24, 39);
        doc.text(`Match Level: ${data.analysis.summary.matchLevel}`, margin + 60, y + 12);
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        
        // Wrap description text
        const descriptionLines = doc.splitTextToSize(
            data.analysis.summary.description, 
            contentWidth - 60
        );
        doc.text(descriptionLines, margin + 60, y + 22);
        y += 40;

        // Stats
        y += 5;
        doc.setFontSize(11);
        doc.setTextColor(17, 24, 39);
        doc.text(`Skills Matched: ${data.analysis.skills.matched.length}`, margin, y);
        doc.text(`Skills Missing: ${data.analysis.skills.missing.length}`, margin + 60, y);
        doc.text(`Additional Skills: ${data.analysis.skills.additional.length}`, margin + 120, y);
        y += 15;

        // Scores Breakdown
        checkNewPage(60);
        doc.setFontSize(16);
        doc.setTextColor(17, 24, 39);
        doc.text('Score Breakdown', margin, y);
        y += 10;

        const scores = [
            { label: 'Overall Match', value: data.analysis.scores.overall },
            { label: 'Skill Match', value: data.analysis.scores.skillMatch },
            { label: 'Content Similarity', value: data.analysis.scores.tfidfSimilarity },
            { label: 'Keyword Density', value: data.analysis.scores.keywordDensity }
        ];

        scores.forEach(score => {
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128);
            doc.text(score.label, margin, y);
            
            // Progress bar background
            doc.setFillColor(229, 231, 235);
            doc.roundedRect(margin + 50, y - 5, 100, 8, 2, 2, 'F');
            
            // Progress bar fill
            const fillWidth = (score.value / 100) * 100;
            doc.setFillColor(99, 102, 241);
            doc.roundedRect(margin + 50, y - 5, fillWidth, 8, 2, 2, 'F');
            
            doc.setTextColor(17, 24, 39);
            doc.text(`${score.value}%`, margin + 155, y);
            y += 12;
        });
        y += 5;

        // Matched Skills
        checkNewPage(40);
        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129); // Green
        doc.text('Matched Skills', margin, y);
        y += 8;

        if (data.analysis.skills.matched.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(17, 24, 39);
            const matchedText = data.analysis.skills.matched.join(', ');
            const matchedLines = doc.splitTextToSize(matchedText, contentWidth);
            doc.text(matchedLines, margin, y);
            y += matchedLines.length * 5 + 5;
        } else {
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128);
            doc.text('No matched skills found', margin, y);
            y += 10;
        }

        // Missing Skills
        checkNewPage(40);
        doc.setFontSize(14);
        doc.setTextColor(239, 68, 68); // Red
        doc.text('Missing Skills', margin, y);
        y += 8;

        if (data.analysis.skills.missing.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(17, 24, 39);
            const missingText = data.analysis.skills.missing.join(', ');
            const missingLines = doc.splitTextToSize(missingText, contentWidth);
            doc.text(missingLines, margin, y);
            y += missingLines.length * 5 + 5;
        } else {
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128);
            doc.text('No missing skills - great job!', margin, y);
            y += 10;
        }

        // Additional Skills
        checkNewPage(40);
        doc.setFontSize(14);
        doc.setTextColor(14, 165, 233); // Blue
        doc.text('Additional Skills', margin, y);
        y += 8;

        if (data.analysis.skills.additional.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(17, 24, 39);
            const additionalText = data.analysis.skills.additional.join(', ');
            const additionalLines = doc.splitTextToSize(additionalText, contentWidth);
            doc.text(additionalLines, margin, y);
            y += additionalLines.length * 5 + 5;
        } else {
            doc.setFontSize(10);
            doc.setTextColor(107, 114, 128);
            doc.text('No additional skills found', margin, y);
            y += 10;
        }

        // Recommendations
        checkNewPage(60);
        doc.setFontSize(16);
        doc.setTextColor(17, 24, 39);
        doc.text('Recommendations', margin, y);
        y += 10;

        const allRecommendations = [
            ...data.analysis.recommendations.high.map(r => ({ ...r, priority: 'High' })),
            ...data.analysis.recommendations.medium.map(r => ({ ...r, priority: 'Medium' })),
            ...data.analysis.recommendations.low.map(r => ({ ...r, priority: 'Low' }))
        ];

        allRecommendations.forEach((rec, index) => {
            checkNewPage(35);
            
            // Priority badge
            const priorityColors = {
                'High': [239, 68, 68],
                'Medium': [245, 158, 11],
                'Low': [16, 185, 129]
            };
            
            doc.setFillColor(...priorityColors[rec.priority]);
            doc.roundedRect(margin, y, 25, 6, 2, 2, 'F');
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);
            doc.text(rec.priority, margin + 3, y + 4.5);
            
            // Title
            doc.setFontSize(11);
            doc.setTextColor(17, 24, 39);
            doc.text(rec.title, margin + 30, y + 4.5);
            y += 10;
            
            // Description
            doc.setFontSize(9);
            doc.setTextColor(107, 114, 128);
            const descLines = doc.splitTextToSize(rec.description, contentWidth - 5);
            doc.text(descLines, margin + 5, y);
            y += descLines.length * 4 + 3;
            
            // Action
            if (rec.action) {
                doc.setTextColor(79, 70, 229);
                const actionLines = doc.splitTextToSize(`→ ${rec.action}`, contentWidth - 5);
                doc.text(actionLines, margin + 5, y);
                y += actionLines.length * 4 + 5;
            }
            
            y += 3;
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(
                `Page ${i} of ${pageCount} | Resume Analyzer Report`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save the PDF
        const filename = `resume-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
    }
};

// Make it globally available
window.PDFReport = PDFReport;
