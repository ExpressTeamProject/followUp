import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { communityFilterSchema } from '@/lib/validations/community';

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = communityFilterSchema.parse(Object.fromEntries(searchParams));

  const [searchInput, setSearchInput] = useState(search || '');
  const [debouncedSearch] = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearchParams(prev => {
      prev.set('search', debouncedSearch);
      prev.set('page', '1');
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="커뮤니티 검색..."
        className="pl-10 py-6 rounded-full border-gray-300 dark:border-gray-700 focus-visible:ring-teal-500"
        value={searchInput}
        onChange={onSearch}
      />
    </div>
  );
}
