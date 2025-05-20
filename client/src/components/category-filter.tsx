import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { PROBLEM_CATEGORY_OPTIONS } from '@/config/options';

interface CategoryFilterProps {
  toggleCategory: (category: string) => void;
  categories: Set<string>;
}

export function CategoryFilter({ toggleCategory, categories = new Set() }: CategoryFilterProps) {
  console.log(Array.from(categories).map(category => console.log(category)));
  return (
    <div className="space-y-3">
      {PROBLEM_CATEGORY_OPTIONS.map(category => (
        <div key={category.value} className="flex items-center space-x-2 group">
          <Checkbox
            id={`category-${category.value}`}
            checked={categories.has(category.value)}
            onCheckedChange={() => toggleCategory(category.value)}
            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
          />
          <Label
            htmlFor={`category-${category.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer group-hover:text-teal-500 transition-colors"
          >
            {category.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
