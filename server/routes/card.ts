import { Router } from 'express';
import { Board, IBoard } from '../models/Board';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Create a new Board
router.post('/Board', validateToken, async (req, res) => {
    try {
        const board = new Board(req.body);
        await board.save();
        res.status(201).send(board);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all Boards
router.get('/Board', validateToken, async (req, res) => {
    try {
        const boards = await Board.find();
        res.status(200).send(boards);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a single Board
router.get('/Board/:id', validateToken, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            res.status(404).send();
            return;
        }
        res.status(200).send(board);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a Board
router.patch('/Board/:id', validateToken, async (req, res) => {
    try {
        const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!board) {
            res.status(404).send();
            return 
        }
        res.status(200).send(board);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a Board
router.delete('/Board/:id', validateToken, async (req, res) => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        if (!board) {
            res.status(404).send();
            return 
        }
        res.status(200).send(board);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;