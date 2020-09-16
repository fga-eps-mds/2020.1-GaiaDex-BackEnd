const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/UsersController');

const usersController = new UsersController();

router.get('/', (req, res) => {
    res.json({
        message: 'Authentication!'
    });
});

router.post('/signup', usersController.signup);
router.put('/update-user', usersController.update);
router.delete('/delete-user', usersController.delete);

module.exports = router;
