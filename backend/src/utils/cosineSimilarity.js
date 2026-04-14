/**
 * Cosine Similarity Implementation
 * 
 * Measures similarity between two vectors by calculating the cosine
 * of the angle between them. Result ranges from 0 (no similarity) 
 * to 1 (identical).
 * 
 * Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 * Where:
 *   A · B = dot product of vectors
 *   ||A|| = magnitude (length) of vector A
 */

/**
 * Calculate dot product of two vectors
 * Multiply corresponding elements and sum them
 */
function dotProduct(vectorA, vectorB) {
    let product = 0;
    
    // Only iterate over keys that exist in vectorA
    for (const key in vectorA) {
        if (vectorB.hasOwnProperty(key)) {
            product += vectorA[key] * vectorB[key];
        }
    }
    
    return product;
}

/**
 * Calculate magnitude (Euclidean length) of a vector
 * sqrt(sum of squares of all values)
 */
function magnitude(vector) {
    let sumOfSquares = 0;
    
    for (const key in vector) {
        sumOfSquares += vector[key] * vector[key];
    }
    
    return Math.sqrt(sumOfSquares);
}

/**
 * Calculate cosine similarity between two TF-IDF vectors
 * Returns a value between 0 and 1
 */
function cosineSimilarity(vectorA, vectorB) {
    // Handle empty vectors
    if (Object.keys(vectorA).length === 0 || Object.keys(vectorB).length === 0) {
        return 0;
    }
    
    const dot = dotProduct(vectorA, vectorB);
    const magA = magnitude(vectorA);
    const magB = magnitude(vectorB);
    
    // Avoid division by zero
    if (magA === 0 || magB === 0) {
        return 0;
    }
    
    const similarity = dot / (magA * magB);
    
    // Clamp between 0 and 1 (floating point errors can cause slight overflows)
    return Math.max(0, Math.min(1, similarity));
}

/**
 * Calculate Jaccard similarity (alternative metric)
 * Good for comparing sets of skills
 * 
 * Formula: |A ∩ B| / |A ∪ B|
 */
function jaccardSimilarity(setA, setB) {
    const arrayA = Array.isArray(setA) ? setA : [...setA];
    const arrayB = Array.isArray(setB) ? setB : [...setB];
    
    const intersection = arrayA.filter(item => arrayB.includes(item));
    const union = [...new Set([...arrayA, ...arrayB])];
    
    if (union.length === 0) {
        return 0;
    }
    
    return intersection.length / union.length;
}

/**
 * Calculate weighted similarity score
 * Combines cosine similarity with skill matching
 */
function calculateWeightedSimilarity(cosineSim, skillMatchRatio, weights = { cosine: 0.4, skills: 0.6 }) {
    return (cosineSim * weights.cosine) + (skillMatchRatio * weights.skills);
}

module.exports = {
    cosineSimilarity,
    jaccardSimilarity,
    calculateWeightedSimilarity,
    dotProduct,
    magnitude
};
