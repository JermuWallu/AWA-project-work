import { useState, useEffect } from "react";
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CardEdit from './CardEdit';

interface Card {
    _id: string;
    title: string;
    text: string;
    color: string;
    columnId: string;
}

interface Column {
    _id: string;
}

export default function Cards(column: Column) {
    const [cards, setCards] = useState<Card[]>([]);
    const [editingCard, setEditingCard] = useState<Card | null>(null);

    // Function to fetch cards for a specific column
    const fetchCards = async (columnId: string) => {
        try {
            const token = localStorage.getItem('token') || "";
            if (!token) {
                console.error('No token found, user might not be logged in');
                return;
            }
            const response = await axios.get('http://localhost:1234/api/cards/'+columnId, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
            setCards(response.data);
        } catch (error) {
            console.error('Failed to fetch cards', error);
        }
    };

    useEffect(() => {
        fetchCards(column._id);
    }, [column._id]);

    const handleEditClick = (card: Card) => {
        setEditingCard(card);
    };
    const handleEditClose = () => {
        setEditingCard(null);
    };
    const handleEditSave = (title: string, text: string, color: string) => {
        // Update the card in the local state after save
        setCards(cards => cards.map(c => c._id === editingCard?._id ? { ...c, title, text, color } : c));
    };

    return (
        <>
        {cards.map((card) => (
            <div key={card?._id} style={{ backgroundColor: card?.color }} className="border border-gray-400 rounded p-4 relative">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium flex-1">{card?.title}</h3>
                  <IconButton size="small" onClick={() => handleEditClick(card)} className="ml-2">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </div>
                <hr className="mb-2" />
                <p>{card?.text}</p>
            </div>
        ))}
        {editingCard && (
          <CardEdit
            cardId={editingCard._id}
            initialTitle={editingCard.title}
            initialText={editingCard.text}
            initialColor={editingCard.color}
            onClose={handleEditClose}
            onSave={handleEditSave}
          />
        )}
        </>
    );
}