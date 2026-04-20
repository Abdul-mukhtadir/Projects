import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../utils/favorites";

export default function RecipeDetails() {
  const { id } = useParams();

  // 👇 ADD HERE (state section)
  const [recipe, setRecipe] = useState(null);
  const [fav, setFav] = useState(false);

  // 👇 ADD HERE (inside component, after useState)
  useEffect(() => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => {
        setRecipe(res.data.meals[0]);
        setFav(isFavorite(id)); // ⭐ this line
      });
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-500">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold">{recipe.strMeal}</h1>

      <img src={recipe.strMealThumb} className="w-80 my-4 rounded" />

      {/* ⭐ ADD BUTTON HERE */}
      <button
        onClick={() => {
          if (fav) {
            removeFavorite(recipe.idMeal);
            setFav(false);
          } else {
            addFavorite(recipe);
            setFav(true);
          }
        }}
        className={`px-4 py-2 rounded mt-3 ${
          fav ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {fav ? "Remove from Favorites ❤️" : "Add to Favorites ⭐"}
      </button>

      <p className="mt-4">{recipe.strInstructions}</p>

      <a
        href={recipe.strYoutube}
        target="_blank"
        className="text-red-500 block mt-4"
      >
        ▶ Watch Video
      </a>
    </div>
  );
}