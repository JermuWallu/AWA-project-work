import { useTranslation } from 'react-i18next';
import { Suspense, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Card {
    _id: string;
    title: string;
    description: string;
}

interface Column {
    _id: string;
    name: string;
    cards: Card[];
}

export default function Board() {
    const { t } = useTranslation();
    const [columns, setColumns] = useState<Column[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in, redirecting to login page...');
            navigate('/login');
            return;
        }

        const fetchColumns = async () => {
            try {
                const response = await axios.get('http://localhost:1234/api/columns', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setColumns(response.data);
            } catch (error) {
                console.error('Failed to fetch columns', error);
            }
        };

        fetchColumns();
    }, [navigate]);

    const addColumn = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in, redirecting to login page...');
            navigate('/login');
            return;
        }

        const newColumn = {
            name: 'New Column',
            order: columns.length + 1
        };

        try {
            const response = await axios.post('http://localhost:1234/api/columns', newColumn, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setColumns([...columns, response.data]);
        } catch (error) {
            console.error('Failed to add column', error);
        }
    };

    return (
        <Suspense fallback="loading">
            <div>
                <h1>{t('kanban board')}</h1>
                <button onClick={addColumn}>Add Column</button>
                {columns.map(column => (
                    <div key={column._id}>
                        <h2>{column.name}</h2>
                        {column.cards.map(card => (
                            <div key={card._id}>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Suspense>
    );
}