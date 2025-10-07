type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  error?: { message?: string } | null;
};

function SearchBar({ search, setSearch, error }: SearchBarProps) {
  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Søk prosjekter..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      {/* Notices */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {(error as any)?.message ||
            "Kunne ikke laste prosjekter. Prøv igjen senere."}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
