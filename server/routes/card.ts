import { Request, Response, Router } from 'express'
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
import { validateToken, CustomRequest } from '../middleware/validateToken'
import { Card, ICard } from '../models/Card';

const router: Router = Router()

// Add a new card
router.post('/card', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { columnId } = req.params;
        const { title, description } = req.body;
        const newCard = new Card({ title, description, column: columnId });
        await newCard.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add card' });
    }
});

// Move a card to another column
router.put('/card/:id/move', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const id: string = req.params.id;
        const newColumnId = req.body;
        const updatedCard = await Card.findByIdAndUpdate(id, { column: newColumnId }, { new: true });
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to move card' });
    }
});

// Remove a card
router.delete('/card/:id', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        await Card.findByIdAndDelete(id);
        res.status(200).json({ message: 'Card removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove card' });
    }
});

export default router