import { useTranslation } from 'react-i18next';
import { Suspense } from "react";

export default function register() {
    const { t } = useTranslation();


    return (
        <Suspense fallback="loading">
            <div>
                <h1>{t('registerPage')}</h1>
            </div>
        </Suspense>
    )
}