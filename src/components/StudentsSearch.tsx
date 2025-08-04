"use client";

import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface StudentsSearchProps {
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
  currentSearch?: string;
}

export default function StudentsSearch({ onSearch, isLoading, currentSearch }: StudentsSearchProps) {
  const [searchTerm, setSearchTerm] = useState(currentSearch || "");

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-[528px] pb-7 pt-6">
      <div className="relative flex items-center bg-[#f2f5fa] rounded-xl border border-[#b9b9b9] overflow-hidden">
        <div className="flex items-center pl-3 pr-2">
          <Search className="h-5 w-5 text-[#9d9d9d]" />
        </div>
        <Input
          type="text"
          placeholder="search students by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 border-0 bg-transparent text-[#1a1a1a] placeholder:text-[#9d9d9d] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none px-0 py-4 text-base disabled:opacity-50"
        />
        <div className="flex items-center gap-2 mr-1">
          {searchTerm && (
            <Button
              onClick={handleClear}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="text-[#9d9d9d] hover:text-[#1a1a1a] h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="bg-[#f9663a] hover:bg-[#e55a35] text-[#ffffff] rounded-xl px-8 py-4 m-1 font-medium text-base disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
    </div>
  )
}