const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Text Extraction Service
 * Handles extracting text from PDF, DOCX, and plain text files
 */

class TextExtractor {
    /**
     * Extract text based on file type
     * @param {Buffer} fileBuffer - The file content as a buffer
     * @param {string} mimeType - The MIME type of the file
     * @returns {Promise<string>} - Extracted text
     */
    async extract(fileBuffer, mimeType) {
        try {
            switch (mimeType) {
                case 'application/pdf':
                    return await this.extractFromPDF(fileBuffer);
                    
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                case 'application/msword':
                    return await this.extractFromDOCX(fileBuffer);
                    
                case 'text/plain':
                    return this.extractFromText(fileBuffer);
                    
                default:
                    throw new Error(`Unsupported file type: ${mimeType}`);
            }
        } catch (error) {
            console.error('Text extraction error:', error.message);
            throw new Error(`Failed to extract text: ${error.message}`);
        }
    }

    /**
     * Extract text from PDF files
     */
    async extractFromPDF(buffer) {
        try {
            const data = await pdfParse(buffer, {
                // Options to improve extraction
                max: 0, // No page limit
                version: 'v2.0.550'
            });
            
            let text = data.text || '';
            
            // Clean up the extracted text
            text = this.cleanText(text);
            
            if (!text || text.trim().length < 10) {
                throw new Error('Could not extract meaningful text from PDF. The file might be image-based or corrupted.');
            }
            
            return text;
        } catch (error) {
            if (error.message.includes('meaningful text')) {
                throw error;
            }
            throw new Error(`PDF extraction failed: ${error.message}`);
        }
    }

    /**
     * Extract text from DOCX files
     */
    async extractFromDOCX(buffer) {
        try {
            const result = await mammoth.extractRawText({ buffer });
            
            let text = result.value || '';
            
            // Log any warnings
            if (result.messages && result.messages.length > 0) {
                console.warn('DOCX extraction warnings:', result.messages);
            }
            
            // Clean up the extracted text
            text = this.cleanText(text);
            
            if (!text || text.trim().length < 10) {
                throw new Error('Could not extract meaningful text from DOCX file.');
            }
            
            return text;
        } catch (error) {
            if (error.message.includes('meaningful text')) {
                throw error;
            }
            throw new Error(`DOCX extraction failed: ${error.message}`);
        }
    }

    /**
     * Extract text from plain text files
     */
    extractFromText(buffer) {
        const text = buffer.toString('utf-8');
        return this.cleanText(text);
    }

    /**
     * Clean and normalize extracted text
     */
    cleanText(text) {
        if (!text) return '';
        
        return text
            // Replace multiple spaces with single space
            .replace(/\s+/g, ' ')
            // Replace multiple newlines with double newline
            .replace(/\n{3,}/g, '\n\n')
            // Remove special characters that might interfere
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            // Normalize quotes
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'")
            // Normalize dashes
            .replace(/[–—]/g, '-')
            // Remove excessive punctuation
            .replace(/([.!?]){2,}/g, '$1')
            // Trim whitespace
            .trim();
    }

    /**
     * Get file info
     */
    getFileInfo(buffer, mimeType, filename) {
        return {
            filename,
            mimeType,
            size: buffer.length,
            sizeFormatted: this.formatFileSize(buffer.length)
        };
    }

    /**
     * Format file size in human-readable format
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

module.exports = new TextExtractor();
