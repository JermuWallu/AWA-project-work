import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface User {
  _id: string;
  email: string;
  isAdmin: boolean;
}

export default function Admin() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = () => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";

      if (!token || !isAdmin) {
        alert(t("Access denied. Admin privileges required."));
        navigate("/login");
        return false;
      }
      return true;
    };

    const fetchUsers = async () => {
      if (!checkAdminAccess()) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:1234/user/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        alert(t("Failed to fetch users"));
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, t]);

  const handleUserClick = (userEmail: string) => {
    // Navigate to user's board (we'll need to create a route that accepts user email)
    navigate(`/board/${encodeURIComponent(userEmail)}`);
  };

  if (loading) {
    return <div className="p-6">{t("Loading...")}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{t("Admin Panel")}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t("All Users")}</h2>
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border border-gray-300 rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleUserClick(user.email)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{user.email}</h3>
                  <p className="text-sm text-gray-600">
                    {t("Role")}: {user.isAdmin ? t("Admin") : t("User")}
                  </p>
                </div>
                <div className="text-blue-500 hover:text-blue-700">
                  {t("View Board")} →
                </div>
              </div>
            </div>
          ))}
        </div>
        {users.length === 0 && (
          <p className="text-gray-600">{t("No users found.")}</p>
        )}
      </div>
    </div>
  );
}
