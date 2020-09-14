const express = require('express');

const router = express.Router();

// Every route ir is preceded by /auth
router.get('/', (req, res) => {
    res.json({
        message: 'Authentication!'
    });
});

module.exports = router;