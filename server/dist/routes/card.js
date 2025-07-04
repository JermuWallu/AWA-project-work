"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
const validateToken_1 = require("../middleware/validateToken");
const Card_1 = require("../models/Card");
const Column_1 = require("../models/Column");
const router = (0, express_1.Router)();
router.get("/cards/:columnId", validateToken_1.validateToken, async (req, res) => {
    try {
        const { columnId } = req.params;
        console.log("Fetching cards with columnID:", columnId);
        const cards = await Card_1.Card.find({ columnID: columnId }).sort({ order: 1 });
        res.status(200).json(cards);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to remove card" });
    }
});
// Add a new card
router.post("/card", validateToken_1.validateToken, async (req, res) => {
    try {
        const columnId = req.body.columnId;
        const title = req.body.title;
        const text = req.body.text;
        if (!columnId || !title || !text) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        console.log("Adding card to column: '" +
            columnId +
            "' with title: '" +
            title +
            "' and text: '" +
            text +
            "'");
        // Check if the column exists
        const columnExists = await Column_1.Column.findById(columnId);
        if (!columnExists) {
            console.error("Column not found with ID:", columnId);
            res.status(404).json({ error: "Column not found" });
            return;
        }
        const cardCount = await Card_1.Card.countDocuments({ columnID: columnId });
        const newCard = new Card_1.Card({
            columnID: columnId,
            title: title,
            text: text,
            order: cardCount + 1,
        });
        await newCard.save();
        res.status(201).json(newCard);
    }
    catch (error) {
        console.error("Error adding card:", error);
        console.error("Request body:", req.body);
        res.status(500).json({ error: "Failed to add card" });
    }
});
// Move a card to another column
router.put("/card/:columnId/move", validateToken_1.validateToken, async (req, res) => {
    try {
        const columnId = req.params.id;
        const newColumnId = req.body;
        const updatedCard = await Card_1.Card.findByIdAndUpdate(columnId, { column: newColumnId }, { new: true });
        res.status(200).json(updatedCard);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to move card" });
    }
});
// Swap places of two cards
router.put("/card/swap", validateToken_1.validateToken, async (req, res) => {
    try {
        const { cardId, cardId2 } = req.body;
        if (!cardId || !cardId2) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        var card1 = await Card_1.Card.findById(cardId);
        var card2 = await Card_1.Card.findById(cardId2);
        if (!card1 || !card2) {
            res.status(404).json({ error: "One or both cards not found" });
            return;
        }
        const tempOrder = card1.order;
        card1.order = card2.order;
        card2.order = tempOrder;
        await card1.save();
        await card2.save();
        res.status(200).json({ message: "Cards swapped", card1, card2 });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to move card" });
    }
});
// Remove a card
router.delete("/card/", validateToken_1.validateToken, async (req, res) => {
    try {
        const { cardId } = req.body;
        await Card_1.Card.findByIdAndDelete(cardId);
        res.status(200).json({ message: "Card removed" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to remove card" });
    }
});
// Edit a card
router.put("/card/:id", validateToken_1.validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, text, color } = req.body;
        if (!title || !text || !color) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const updatedCard = await Card_1.Card.findByIdAndUpdate(id, { title, text, color, timeUpdated: Date.now() }, { new: true });
        if (!updatedCard) {
            res.status(404).json({ error: "Card not found" });
            return;
        }
        res.status(200).json(updatedCard);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to edit card" });
    }
});
exports.default = router;
