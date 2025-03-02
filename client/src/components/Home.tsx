import { useTranslation } from 'react-i18next';
import { Suspense, useEffect, useState } from "react";
import axios from 'axios';

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

export default function Home() {
    const { t } = useTranslation();
    const [columns, setColumns] = useState<Column[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in, redirecting to login page...');
            window.location.href = '/login';
            return;
        }

        const fetchColumns = async () => {
            try {
                const response = await axios.get('/api/columns', {
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
    }, [history]);

    return (
        <Suspense fallback="loading">
            <div>
                <h1>{t('frontPage')}</h1>
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