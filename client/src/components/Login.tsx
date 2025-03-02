import { useTranslation } from 'react-i18next';
import { Suspense } from "react";

export default function Login() {
    const { t } = useTranslation();


    return (
        <Suspense fallback="loading">
            <div>
                <h1>{t('loginPage')}</h1>
            </div>
        </Suspense>
    )
}