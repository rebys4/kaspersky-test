import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UsersList() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"name" | "email" | "createdAt">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetch(
      `/api/users?` +
      new URLSearchParams({
        q,
        sort,
        order,
        page: String(page),
        limit: String(limit),
      })
    )
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      });
  }, [q, sort, order, page]);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Поиск по имени или email..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <select
            className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="createdAt">По дате</option>
            <option value="name">По имени</option>
            <option value="email">По email</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
            value={order}
            onChange={(e) => setOrder(e.target.value as any)}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <Link
            to="/users/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition"
          >
            + Добавить
          </Link>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-2 text-left">Имя</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Должность</th>
              <th className="px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  {u.lastName} {u.firstName}
                </td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.position || "—"}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/users/${u.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Открыть
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {items.map((u) => (
          <div
            key={u.id}
            className="rounded-xl border border-gray-200 shadow-sm p-3 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold text-gray-800">
                {u.lastName} {u.firstName}
              </div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </div>
            <Link
              to={`/users/${u.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              →
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6 text-sm">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1.5 border rounded-lg disabled:opacity-40"
        >
          Назад
        </button>
        <span>
          Стр. {page} / {Math.max(1, Math.ceil(total / limit))}
        </span>
        <button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1.5 border rounded-lg disabled:opacity-40"
        >
          Вперёд
        </button>
      </div>
    </div>
  );
}
