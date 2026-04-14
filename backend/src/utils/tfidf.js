/**
 * TF-IDF (Term Frequency - Inverse Document Frequency) Implementation
 * 
 * This measures how important a word is to a document in a collection.
 * - TF: How often a word appears in a document
 * - IDF: How rare/common a word is across all documents
 * 
 * Formula: TF-IDF = TF × IDF
 */

class TFIDF {
    constructor() {
        this.documents = [];
        this.vocabulary = new Set();
        this.idfCache = new Map();
    }

    /**
     * Tokenize text into words
     * Converts to lowercase, removes punctuation, splits by spaces
     */
    tokenize(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }
        
        return text
            .toLowerCase()
            .replace(/[^\w\s\-\+\#\.]/g, ' ')  // Keep hyphens, plus, hash, dots
            .replace(/\s+/g, ' ')               // Normalize whitespace
            .trim()
            .split(' ')
            .filter(word => word.length > 1);   // Remove single characters
    }

    /**
     * Calculate Term Frequency
     * TF = (Number of times term appears in document) / (Total terms in document)
     */
    calculateTF(term, document) {
        const terms = this.tokenize(document);
        const termCount = terms.filter(t => t === term).length;
        return terms.length > 0 ? termCount / terms.length : 0;
    }

    /**
     * Calculate Inverse Document Frequency
     * IDF = log(Total documents / Documents containing term)
     * 
     * Words that appear in many documents get lower scores
     * Rare words get higher scores
     */
    calculateIDF(term, documents) {
        // Check cache first
        if (this.idfCache.has(term)) {
            return this.idfCache.get(term);
        }

        const numDocuments = documents.length;
        const documentsWithTerm = documents.filter(doc => {
            const terms = this.tokenize(doc);
            return terms.includes(term);
        }).length;

        // Add 1 to avoid division by zero (smoothing)
        const idf = Math.log((numDocuments + 1) / (documentsWithTerm + 1)) + 1;
        
        this.idfCache.set(term, idf);
        return idf;
    }

    /**
     * Calculate TF-IDF score for a term in a document
     */
    calculateTFIDF(term, document, documents) {
        const tf = this.calculateTF(term, document);
        const idf = this.calculateIDF(term, documents);
        return tf * idf;
    }

    /**
     * Create TF-IDF vector for a document
     * Returns an object mapping each term to its TF-IDF score
     */
    createVector(document, documents) {
        const terms = this.tokenize(document);
        const vector = {};
        
        // Get unique terms
        const uniqueTerms = [...new Set(terms)];
        
        uniqueTerms.forEach(term => {
            vector[term] = this.calculateTFIDF(term, document, documents);
        });
        
        return vector;
    }

    /**
     * Create vectors for multiple documents
     * Used for comparing resume against job description
     */
    createVectors(documents) {
        return documents.map(doc => this.createVector(doc, documents));
    }

    /**
     * Get the vocabulary (all unique terms) from documents
     */
    getVocabulary(documents) {
        const vocabulary = new Set();
        
        documents.forEach(doc => {
            const terms = this.tokenize(doc);
            terms.forEach(term => vocabulary.add(term));
        });
        
        return [...vocabulary];
    }

    /**
     * Clear the IDF cache (useful when analyzing new documents)
     */
    clearCache() {
        this.idfCache.clear();
    }
}

module.exports = TFIDF;
