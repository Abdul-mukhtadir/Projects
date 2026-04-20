const categories = ["All", "Chicken", "Beef", "Dessert", "Seafood"];

export default function CategoryFilter({ setCategory }) {
  return (
    <div className="flex gap-3 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className="px-4 py-1 bg-gray-200 rounded-full"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}