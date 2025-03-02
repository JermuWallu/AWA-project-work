"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
const validateToken_1 = require("../middleware/validateToken");
const Column_1 = require("../models/Column");
const router = (0, express_1.Router)();
// Add a new column
router.post('/column', validateToken_1.validateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const newColumn = new Column_1.Column({ name });
        await newColumn.save();
        res.status(201).json(newColumn);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add column' });
    }
});
// Remove a column
router.delete('/column/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        // TODO: remove all cards in the column
        const { id } = req.params;
        await Column_1.Column.findByIdAndDelete(id);
        res.status(200).json({ message: 'Column removed' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove column' });
    }
});
// Rename a column
router.put('/column/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedColumn = await Column_1.Column.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json(updatedColumn);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to rename column' });
    }
});
exports.default = router;
