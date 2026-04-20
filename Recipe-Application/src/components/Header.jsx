export default function Header({ search, setSearch }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <input
        className="border px-4 py-2 rounded-full w-1/2 shadow-sm focus:outline-none"
        placeholder="Search recipes (e.g. chicken)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      
    </div>
  );
}