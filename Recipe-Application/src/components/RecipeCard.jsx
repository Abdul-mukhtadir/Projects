import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavorite, removeFavorite, isFavorite } from "../utils/favorites";

export default function RecipeCard({ recipe, openModal }) {
  const [fav, setFav] = useState(isFavorite(recipe.idMeal));

  const toggleFav = (e) => {
    e.stopPropagation(); // prevent modal click
    if (fav) {
      removeFavorite(recipe.idMeal);
      setFav(false);
    } else {
      addFavorite(recipe);
      setFav(true);
    }
  };

  return (
    <div
      onClick={() => openModal(recipe)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden relative"
    >
      {/* ❤️ Favorite */}
      <div
        onClick={toggleFav}
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
      >
        {fav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </div>

      <img
        src={recipe.strMealThumb}
        className="h-40 w-full object-cover"
      />

      <div className="p-3">
        <h3 className="font-semibold text-lg truncate">
          {recipe.strMeal}
        </h3>

        <p className="text-sm text-gray-400">
          {recipe.strCategory}
        </p>
      </div>
    </div>
  );
}