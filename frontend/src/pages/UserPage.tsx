import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserPage() {
    const { id } = useParams();
    const isNew = !id || id === "new";
    const nav = useNavigate();
    const [data, setData] = useState<any>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
    });

    useEffect(() => {
        if (id && !isNew) {
            fetch(`/api/users/${id}`)
                .then((r) => r.json())
                .then(setData);
        }
    }, [id, isNew]);

    async function save() {
        const method = isNew ? "POST" : "PATCH";
        const url = isNew ? "/api/users" : `/api/users/${id}`;
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) nav("/users");
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold mb-6">
                {isNew ? "Новый пользователь" : "Редактирование"}
            </h1>

            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Имя
                    </label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={data.firstName}
                        onChange={(e) => setData({ ...data, firstName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Фамилия
                    </label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={data.lastName}
                        onChange={(e) => setData({ ...data, lastName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон
                    </label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Должность
                    </label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={data.position}
                        onChange={(e) => setData({ ...data, position: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={save}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Сохранить
                </button>
                <button
                    onClick={() => nav(-1)}
                    className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}
