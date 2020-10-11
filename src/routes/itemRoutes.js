const { Router } = require('express');
const router = Router();
const Item = require('../models/Item');
const ItemSchema = require('../schemas/itemSchema');

// Get all
router.get('/', async (req,res,next) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (error) {
        next(error);
    }
});

// Create One
router.post('/add', async (req, res, next) => {
    try {
        const value = await ItemSchema.validateAsync(req.body, { abortEarly: false });
        const validated = new Item(value);
        const inserted = await validated.save();
        res.json(inserted);
    } catch (error) {
        next(error);
    }
});

// Get One
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await Item.findOne({
            _id: id
        });
        if (!item) return next();
        return res.json(item);
    } catch (error) {
        next(error);
    }
})

// Edit One
router.put('/edit/:id', async (req,res, next) => {
    try {
        const { id } = req.params;
        const value = await ItemSchema.validateAsync(req.body, { abortEarly: false })
        const item = await Item.findOne({
            _id: id
        });
        if (!item) return next();
        const updated = await Item.update({
            _id: id
        }, {
            $set: value
        });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.delete('/delete/:id', async (req,res,next) => {
    try {
        const { id } = req.params;
        const deleted = await Item.remove({_id: id});
        res.json(deleted);
    } catch (error) {
        next(error);
    }
});


module.exports = router;