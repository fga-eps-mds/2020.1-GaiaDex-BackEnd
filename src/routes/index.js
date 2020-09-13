const { Router } = require('express');
const router = Router();

router.get('/test', (req, res) => {
    const data = {
        "name": "Zeca",
        "website": "google.com"
    }
    res.json(data)
});
router.get('/create', (req, res) => {
    const data = {
        "name" : "delete"
    }
    res.json(data)
});
router.get('/delete', (req, res) => {
    const data = {
        "name" : "delete"
    }
    res.json(data)
});

module.exports = router;