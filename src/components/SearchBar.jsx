export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full md:w-1/2 px-4 py-3 rounded-full border shadow-sm focus:outline-none"
        type="search"
      />
      {value && (
        <button
          className="px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={() => onChange("")}
        >
          Clear
        </button>
      )}
    </div>
  );
}


