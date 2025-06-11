import Cards from './Cards';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

interface Column {
    _id: string;
    name: string;
}

export default function Column(column: Column) {
    const { t } = useTranslation();
    return (
        <Suspense fallback={"Loading..."}>
        <div key={column._id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{column.name}</h2>
                <h1 className="relative group">
                    <span className="text-gray-500 hover:text-gray-700">⋮</span>
                    <button className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md hidden group-click:block">
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("Option 1")}</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("Option 2")}</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{t("Option 3")}</li>
                        </ul>
                    </button>
                </h1>
            </div>
            <div className="space-y-4 mb-4">
              <Cards _id={column._id}/>
            </div>
            <button
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                {t("Add Card")}
            </button>
        </div>
        </Suspense>
    )
}