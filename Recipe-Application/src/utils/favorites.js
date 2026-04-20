export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

export const addFavorite = (recipe) => {
  const favs = getFavorites();
  const exists = favs.find((r) => r.idMeal === recipe.idMeal);

  if (!exists) {
    localStorage.setItem("favorites", JSON.stringify([...favs, recipe]));
  }
};

export const removeFavorite = (id) => {
  const favs = getFavorites().filter((r) => r.idMeal !== id);
  localStorage.setItem("favorites", JSON.stringify(favs));
};

export const isFavorite = (id) => {
  return getFavorites().some((r) => r.idMeal === id);
};