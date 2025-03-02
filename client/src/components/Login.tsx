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
            } else if (response.status === 401) {
                alert('Login failed');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Internal error');
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
            <div>
                <h1>{t('loginPage')}</h1>
                <form>
                    <div>
                        <label htmlFor="email">{t('email')}</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div>
                        <label htmlFor="password">{t('password')}</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div>
                        <button type="button" onClick={handleLogin}>{t('login')}</button>
                        <button type="button" onClick={handleRegister}>{t('register')}</button>
                    </div>
                </form>
            </div>
        </Suspense>
    )
}