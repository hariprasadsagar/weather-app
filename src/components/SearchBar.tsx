import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="glass rounded-2xl flex items-center px-4 py-3 gap-3">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="bg-transparent w-full text-foreground placeholder:text-muted-foreground outline-none text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="glass-subtle rounded-xl px-4 py-1.5 text-sm font-medium text-foreground hover:bg-primary/20 transition-colors disabled:opacity-40"
        >
          {isLoading ? "..." : "Go"}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
