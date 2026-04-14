const express = require('express');
const multer = require('multer');
const analyzerController = require('../controllers/analyzerController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    }
});

// Routes
// POST /api/analyze - Upload resume and analyze
router.post('/analyze', upload.single('resume'), analyzerController.analyzeResume);

// POST /api/analyze-text - Analyze text directly (no file upload)
router.post('/analyze-text', analyzerController.analyzeText);

// GET /api/health - Health check
router.get('/health', analyzerController.healthCheck);

// Error handling for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'Maximum file size is 5MB'
            });
        }
        return res.status(400).json({
            error: 'File upload error',
            message: error.message
        });
    }
    
    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
            error: 'Invalid file type',
            message: error.message
        });
    }
    
    next(error);
});

module.exports = router;
