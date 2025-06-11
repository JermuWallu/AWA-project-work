import { useState, useEffect } from "react";
import axios from 'axios';
interface Card {
    _id: string;
    title: string;
    text: string;
}

interface Column {
    _id: string;
}

export default function Cards(column: Column) {
    const [cards, setCards] = useState<Card[]>([]);

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

    return (
        cards.map((card) => (
            <div key={card?._id} className="border border-gray-300 rounded p-4">
                <h3 className="text-lg font-medium mb-2">{card?.title}</h3>
                <hr className="mb-2" />
                <p>{card?.text}</p>
            </div>
        ))
    );
}