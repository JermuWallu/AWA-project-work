import { Router } from 'express';
import { Card, ICard } from '../models/Card';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Create a new Card
router.post('/Card', validateToken, async (req, res) => {
    try {
        const card = new Card(req.body);
        await card.save();
        res.status(201).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all Cards
router.get('/Card', validateToken, async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).send(cards);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a single Card
router.get('/Card/:id', validateToken, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            res.status(404).send();
            return;
        }
        res.status(200).send(card);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a Card
router.patch('/Card/:id', validateToken, async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!card) {
            res.status(404).send();
            return 
        }
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a Card
router.delete('/Card/:id', validateToken, async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) {
            res.status(404).send();
            return 
        }
        res.status(200).send(card);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;