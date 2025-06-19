import { useTranslation } from 'react-i18next';
import { Suspense, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from './Cards';
import Column from './Column';

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

    // Function to add a new column
    const addColumn = async () => {
        const token = localStorage.getItem('token') || "";
        if (!loggedIn || !token) {
            alert('You are not logged in, redirecting to login page...');
            navigate('/login');
        }

        const newColumn = {
            name: 'Brand New Column'
        };

        try {
            const response = await axios.post('http://localhost:1234/api/column', newColumn, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status !== 201) {
                console.error('Failed to add column:', response);
                alert('Failed to add column');
                return;
            }
            setColumns([...columns, response.data]);
            // fetchColumns(token); // Refresh columns after adding a new one
        } catch (error) {
            console.error('Failed to add column', error);
        }
    };

        // Check if user is logged in and fetch columns on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoggedIn(false);
            navigate('/login'); // TODO: user react navigation
            alert('You are not logged in, redirecting to login page...');

        } else {
            setLoggedIn(true);
                // Function to fetch columns from the API
            const fetchColumns = async (token: string) => {
                try {
                    const response = await axios.get('http://localhost:1234/api/columns', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setColumns(response.data);
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        if (error.status == 403) {
                        alert('You do not have permission to access this resource.');
                        return;
                        }
                        else if (error.status == 401) {
                            setLoggedIn(false);
                            navigate('/login'); // TODO: user react navigation
                            alert('You are not logged in, redirecting to login page...');
                            return;
                        } else {
                            console.error('Failed to fetch columns:', error.response);
                        }
                    } else {
                        console.error('Failed to fetch columns:', error);
                    }
                }
            };
            fetchColumns(token);
        }

    }, [setColumns, navigate]);
    return (
        <Suspense fallback="loading">
            <div className="p-6 bg-gray-100">
                <h1 className="text-3xl font-bold mb-6">
                    {t('kanban board')}
                </h1>
                <button
                    onClick={addColumn}
                    className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {t("Add Column")}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map(column => (
                    <Column key={column._id} {...column} />
                ))}
            </div>
        </Suspense>
    );
}