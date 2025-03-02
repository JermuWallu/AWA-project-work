import { useTranslation } from 'react-i18next';
import { Suspense } from "react";

export default function Home() {
    const { t } = useTranslation();


    return (
        <Suspense fallback="loading">
            <div>
                <h1>{t('frontPage')}</h1>
            </div>
        </Suspense>
    )
}