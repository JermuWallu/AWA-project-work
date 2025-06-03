"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
const validateToken_1 = require("../middleware/validateToken");
const Column_1 = require("../models/Column");
const router = (0, express_1.Router)();
// Get all columns
router.get('/columns', validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.user?.email;
        console.log("User ID:", userId);
        const columns = await Column_1.Column.find({ owner: userId }).sort({ order: 1 });
        res.status(200).json(columns);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get columns' });
    }
});
// Add a new column
router.post('/column', validateToken_1.validateToken, async (req, res) => {
    try {
        const userId = req.user?.email;
        console.log("User ID:", userId, "Request Body:", req.body);
        const columnAmount = await Column_1.Column.countDocuments({ owner: userId });
        const newColumn = new Column_1.Column({
            owner: req.user?.email,
            name: req.body?.name ? req.body?.name : "New Column",
            order: columnAmount + 1, // Set order based on current number of columns
        });
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
        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }
        console.log("updating column with ID:", id, "to name:", name);
        const updatedColumn = await Column_1.Column.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json(updatedColumn);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to rename column' });
    }
});
// Reorder columns
router.put('/columns/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        var { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'no Id given as parameter' });
        }
        var { order, columnID } = req.body;
        console.log("Reordering columns with ID:", id, "Order:", order, "ColumnID:", columnID);
        var column1 = await Column_1.Column.findById(id);
        if (!column1) {
            res.status(404).json({ error: 'Column not found' });
            return;
        }
        // You can swap by either giving new order or swapped columnID
        if (order) {
            var column2 = await Column_1.Column.findOne({ order: order });
            if (!column2) {
                res.status(404).json({ error: 'Column with order number not found' });
                return;
            }
            // Swap the order of the two columns, ensuring order is not undefined
            if (typeof column1.order === 'number' && typeof column2.order === 'number') {
                var tempOrder = column1.order;
                column1.order = column2.order;
                column2.order = tempOrder;
                await column1.save();
                await column2.save();
                res.status(200).json({ message: 'Columns reordered successfully' });
                return;
            }
            else {
                res.status(400).json({ error: 'Column order is invalid' });
                return;
            }
        }
        else if (columnID) {
            var column2 = await Column_1.Column.findById(columnID);
            if (!column2) {
                res.status(404).json({ error: 'Column not found with ID' });
                return;
            }
            if (typeof column1.order === 'number' && typeof column2.order === 'number') {
                var tempOrder = column1.order;
                column1.order = column2.order;
                column2.order = tempOrder;
                await column1.save();
                await column2.save();
                res.status(200).json({ message: 'Column order updated successfully' });
                return;
            }
            else {
                res.status(400).json({ error: 'Column order is invalid' });
                return;
            }
        }
        else {
            res.status(400).json({ error: 'Order or columnID are required' });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to rename column' });
    }
});
exports.default = router;
