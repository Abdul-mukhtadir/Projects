import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RecipeCard from "../components/RecipeCard";
import CategoryFilter from "../components/CategoryFilter";
import RecipeModal from "../components/RecipeModal";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch by search
  const fetchRecipes = async (query = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );

      setRecipes(res.data.meals || []);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // 🏷️ Fetch by category (FIXED)
  const fetchByCategory = async (cat) => {
    try {
      setLoading(true);

      if (cat === "All") {
        fetchRecipes(search);
        return;
      }

      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
      );

      setRecipes(res.data.meals || []);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Initial load
  useEffect(() => {
    fetchRecipes("");
  }, []);

  // 🔄 Auto search (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (category === "All") {
        fetchRecipes(search);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-8">
        {/* Header */}
        <Header search={search} setSearch={setSearch} />

        {/* HERO */}
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-100 rounded-2xl p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Learn, Cook, Eat your food
            </h1>
            <p className="text-gray-700 mb-3">
              Explore delicious recipes 🍳
            </p>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="food"
            className="w-32 hidden md:block"
          />
        </div>

        {/* CATEGORY FILTER */}
        <CategoryFilter
          setCategory={(cat) => {
            setCategory(cat);
            fetchByCategory(cat); // 🔥 FIXED
          }}
        />

        {/* LOADING */}
        {loading && <p className="mb-4">Loading...</p>}

        {/* EMPTY */}
        {!loading && recipes.length === 0 && (
          <p className="mb-4">No recipes found 😢</p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((r) => (
            <RecipeCard
              key={r.idMeal}
              recipe={r}
              openModal={setSelected}
            />
          ))}
        </div>

        {/* MODAL */}
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