import { useEffect, useState } from "react";
import axios from "axios";

export default function RecipeModal({ recipe, close }) {
  const [details, setDetails] = useState(null);

  // 🔥 Fetch FULL details using ID
  useEffect(() => {
    if (!recipe?.idMeal) return;

    axios
      .get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
      )
      .then((res) => {
        setDetails(res.data.meals[0]);
      });
  }, [recipe]);

  if (!details) return <p className="text-white">Loading...</p>;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[700px] max-h-[90vh] overflow-y-auto p-6 relative">
        
        <button
          onClick={close}
          className="absolute top-3 right-3 text-xl"
        >
          ✖
        </button>

        <h1 className="text-2xl font-bold mb-3">
          {details.strMeal}
        </h1>

        <img
          src={details.strMealThumb}
          className="w-full rounded-lg mb-4"
        />

        <p className="text-sm text-gray-600 mb-4">
          {details.strInstructions}
        </p>

        {details.strYoutube && (
          <a
            href={details.strYoutube}
            target="_blank"
            className="text-red-500 font-semibold"
          >
            ▶ Watch Video
          </a>
        )}
      </div>
    </div>
  );
}