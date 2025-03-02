"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Card_1 = require("../models/Card");
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
// Create a new Card
router.post('/Card', validateToken_1.validateToken, async (req, res) => {
    try {
        const card = new Card_1.Card(req.body);
        await card.save();
        res.status(201).send(card);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Get all Cards
router.get('/Card', validateToken_1.validateToken, async (req, res) => {
    try {
        const cards = await Card_1.Card.find();
        res.status(200).send(cards);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Get a single Card
router.get('/Card/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const card = await Card_1.Card.findById(req.params.id);
        if (!card) {
            res.status(404).send();
            return;
        }
        res.status(200).send(card);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Update a Card
router.patch('/Card/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const card = await Card_1.Card.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!card) {
            res.status(404).send();
            return;
        }
        res.status(200).send(card);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Delete a Card
router.delete('/Card/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const card = await Card_1.Card.findByIdAndDelete(req.params.id);
        if (!card) {
            res.status(404).send();
            return;
        }
        res.status(200).send(card);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = router;
