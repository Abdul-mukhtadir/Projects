import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const activeClass =
    "block bg-yellow-400 py-2 rounded-lg text-center font-semibold";

  const normalClass =
    "block py-2 text-center hover:bg-gray-100 rounded-lg";

  return (
    <div className="w-64 h-screen bg-white p-6 shadow-lg flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-10 text-black-500">
          Recipe-Chart👨‍🍳
        </h1>

        <div className="space-y-4">
          {/* 🏠 Recipes */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClass : normalClass
            }
          >
            Recipes
          </NavLink>

          {/* ❤️ Favorites */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? activeClass : normalClass
            }
          >
            Favorites
          </NavLink>

          
        </div>
      </div>

      <p className="text-sm text-gray-400">© 2026 Chefie</p>
    </div>
  );
}