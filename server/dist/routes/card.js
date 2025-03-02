"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Board_1 = require("../models/Board");
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
// Create a new Board
router.post('/Board', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = new Board_1.Board(req.body);
        await board.save();
        res.status(201).send(board);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Get all Boards
router.get('/Board', validateToken_1.validateToken, async (req, res) => {
    try {
        const boards = await Board_1.Board.find();
        res.status(200).send(boards);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Get a single Board
router.get('/Board/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.Board.findById(req.params.id);
        if (!board) {
            res.status(404).send();
            return;
        }
        res.status(200).send(board);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// Update a Board
router.patch('/Board/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.Board.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!board) {
            res.status(404).send();
            return;
        }
        res.status(200).send(board);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Delete a Board
router.delete('/Board/:id', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.Board.findByIdAndDelete(req.params.id);
        if (!board) {
            res.status(404).send();
            return;
        }
        res.status(200).send(board);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = router;
