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
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoggedIn(false);
            navigate('/login');
            alert('You are not logged in, redirecting to login page...');

        } else {
            setLoggedIn(true);
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
        }

    }, [navigate]);

    const addColumn = async () => {
        const token = localStorage.getItem('token');
        if (!loggedIn) {
            alert('You are not logged in, redirecting to login page...');
            navigate('/login');
        }

        const newColumn = {
            name: 'New Column',
            order: columns.length + 1
        };

        try {
            const response = await axios.post('http://localhost:1234/api/column', newColumn, {
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
            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-6">{t('kanban board')}</h1>
                <button
                    onClick={addColumn}
                    className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Column
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map(column => (
                        <div key={column._id} className="bg-white shadow-md rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{column.name}</h2>
                                <h1 className="relative group">
                                    <span className="text-gray-500 hover:text-gray-700">⋮</span>
                                    <button className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md hidden group-click:block">
                                        <ul className="py-1">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 1</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 2</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 3</li>
                                        </ul>
                                    </button>
                                </h1>
                            </div>
                            <div className="space-y-4 mb-4">
                                {column.cards.map(card => (
                                    <div key={card._id} className="border border-gray-300 rounded p-4">
                                        <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                                        <hr className="mb-2" />
                                        <p>{card.description}</p>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Add Card
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Suspense>
    );
}