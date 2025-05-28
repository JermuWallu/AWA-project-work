import { useTranslation } from 'react-i18next';
import { Suspense } from "react";
import axios from 'axios';

export default function Login() {
    const { t } = useTranslation();

    async function handleLogin(): Promise<void> {
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:1234/user/login', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:1234'
                }
            });

            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('token', data.token);
                window.location.href = '/home';
            }  else {
                console.error('Error during login:', response);
                alert('Internal error');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log('Failed login:', error.response);
                if (error.status === 401) {
                    alert('Login failed');
                }
            } else {
            console.error('Error during login:', error);
            alert('Internal error');
            }
        }
    }

    async function handleRegister(): Promise<void> {
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:1234/user/register', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

            if (response.status === 200) {
                alert(t('registrationSuccess'));
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Internal error');
        }
    }

    return (
        <Suspense fallback="loading">
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-8 text-center">{t('loginPage')}</h1>
                <form className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">{t('email')}</label>
                        <input
                            type="email"
                            id="email" 
                            name="email" 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">{t('password')}</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button 
                            type="button" 
                            onClick={handleLogin} 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {t('login')}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleRegister} 
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            {t('register')}
                        </button>
                    </div>
                </form>
            </div>
        </Suspense>
    );
}