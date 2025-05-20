import { CategoryFilter } from '@/components/category-filter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SlidersHorizontal } from 'lucide-react';

function FilterSidebar({
  showFilters,
  toggleCategory: handleCategoryChange,
  toggleTag: handleTagChange,
  popularTags,
  selectedTags,
  categories,
}: {
  showFilters: boolean;
  selectedStatus: string;
  handleStatusChange: (status: string) => void;
  toggleCategory: (category: string) => void;
  toggleTag: (tag: string) => void;
  popularTags: readonly string[];
  selectedTags: readonly string[];
  categories: Set<string>;
}) {
  return (
    <div className={`md:w-1/4 lg:w-1/5 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
      <Card className="overflow-hidden border-none shadow-md dark:shadow-gray-800/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <SlidersHorizontal className="mr-2 h-5 w-5 text-teal-500" />
            상세 필터
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">카테고리</h4>
              <CategoryFilter categories={categories} toggleCategory={handleCategoryChange} />
            </div>
            <div>
              <h4 className="font-medium mb-2">인기 태그</h4>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                    className={`
                  ${
                    selectedTags.includes(tag)
                      ? 'bg-teal-500 hover:bg-teal-600'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
                  } cursor-pointer
                `}
                    onClick={() => handleTagChange(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default FilterSidebar;
