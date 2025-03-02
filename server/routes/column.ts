import { Request, Response, Router } from 'express'
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
import { validateToken } from '../middleware/validateToken'
import { Column, IColumn } from '../models/Column';

const router: Router = Router()

// Get all columns
router.get('/columns', validateToken, async (req: Request, res: Response) => {
    try {
        const columns = await Column.find();
        res.status(200).json(columns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get columns' });
    }
});

// Add a new column
router.post('/columns', validateToken, async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const newColumn = new Column({ name });
        await newColumn.save();
        res.status(201).json(newColumn);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add column' });
    }
});

// Remove a column
router.delete('/columns/:id', validateToken, async (req: Request, res: Response) => {
    try {
        // TODO: remove all cards in the column
        const { id } = req.params;
        await Column.findByIdAndDelete(id);
        res.status(200).json({ message: 'Column removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove column' });
    }
});

// Rename a column
router.put('/columns/:id', validateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedColumn = await Column.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json(updatedColumn);
    } catch (error) {
        res.status(500).json({ error: 'Failed to rename column' });
    }
});


export default router