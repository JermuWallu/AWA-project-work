"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
const validateToken_1 = require("../middleware/validateToken");
const Card_1 = require("../models/Card");
const router = (0, express_1.Router)();
// Add a new card
router.post('/card', validateToken_1.validateToken, async (req, res) => {
    try {
        const { columnId } = req.params;
        const { title, description } = req.body;
        const newCard = new Card_1.Card({ title, description, column: columnId });
        await newCard.save();
        res.status(201).json(newCard);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add card' });
    }
});
// Move a card to another column
router.put('/card/:id/move', validateToken_1.validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const newColumnId = req.body;
        const updatedCard = await Card_1.Card.findByIdAndUpdate(id, { column: newColumnId }, { new: true });
        res.status(200).json(updatedCard);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to move card' });
    }
});
// Remove a card
router.delete('/card/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Card_1.Card.findByIdAndDelete(id);
        res.status(200).json({ message: 'Card removed' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove card' });
    }
});
exports.default = router;
