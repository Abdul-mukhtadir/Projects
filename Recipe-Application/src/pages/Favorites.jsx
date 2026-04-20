import { useEffect, useState } from "react";
import { getFavorites } from "../utils/favorites";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import Sidebar from "../components/Sidebar";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Your Favorites ❤️
        </h1>

        {favorites.length === 0 ? (
          <p>No favorites added yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((r) => (
              <RecipeCard
                key={r.idMeal}
                recipe={r}
                openModal={setSelected} // ⭐ IMPORTANT
              />
            ))}
          </div>
        )}

        {/* 🎬 MODAL */}
        {selected && (
          <RecipeModal
            recipe={selected}
            close={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}