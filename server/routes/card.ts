import { Request, Response, Router } from 'express'
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
import { validateToken, CustomRequest } from '../middleware/validateToken'
import { Card, ICard } from '../models/Card';
import { Column, IColumn } from '../models/Column';

const router: Router = Router()


router.get('/cards/:columnId', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { columnId } = req.params;
        console.log("Fetching cards with columnID:", columnId);
        const cards = await Card.find({ columnID: columnId }).sort({ order: 1 });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove card' });
    }
});

// Add a new card
router.post('/card', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const columnId: string = req.body.columnId;
        const title: string = req.body.title;
        const text: string = req.body.text;
        
        if (!columnId || !title || !text) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        console.log("Adding card to column: '"+columnId+"' with title: '"+title+"' and text: '"+text+"'");

        // Check if the column exists
        const columnExists = await Column.findById(columnId);
        if (!columnExists) {
            console.error("Column not found with ID:", columnId);
            res.status(404).json({ error: 'Column not found' });
            return;
        }
        const cardCount = await Card.countDocuments({ columnID: columnId });
        const newCard = new Card({
            columnID: columnId,
            title: title,
            text: text,
            order: cardCount + 1,
        });
        await newCard.save();
        res.status(201).json(newCard);
    } catch (error) {
        console.error("Error adding card:", error);
        console.error("Request body:", req.body);
        res.status(500).json({ error: 'Failed to add card' });
    }
});

// Move a card to another column
router.put('/card/:columnId/move', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const columnId: string = req.params.id;
        const newColumnId = req.body;
        const updatedCard = await Card.findByIdAndUpdate(columnId, { column: newColumnId }, { new: true });
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to move card' });
    }
});

// Swap places of two cards
router.put('/card/swap', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const {cardId, cardId2 } = req.body;
        if (!cardId || !cardId2) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        var card1 = await Card.findById(cardId)
        var card2 = await Card.findById(cardId2)

        if (!card1 || !card2) {
            res.status(404).json({ error: 'One or both cards not found' });
            return;
        }

        const tempOrder = card1.order;
        card1.order = card2.order;
        card2.order = tempOrder;
        await card1.save();
        await card2.save();

        res.status(200).json({message: "Cards swapped", card1, card2});
    } catch (error) {
        res.status(500).json({ error: 'Failed to move card' });
    }
});

// Remove a card
router.delete('/card/', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { cardId } = req.body;
        await Card.findByIdAndDelete(cardId);
        res.status(200).json({ message: 'Card removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove card' });
    }
});

// Edit a card
router.put('/card/:id', validateToken, async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, text, color } = req.body;
        if (!title || !text || !color) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const updatedCard = await Card.findByIdAndUpdate(id, { title, text, color }, { new: true });
        if (!updatedCard) {
            res.status(404).json({ error: 'Card not found' });
            return;
        }
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit card' });
    }
});

export default router