import { CircleSpinner } from './spinner';
import { cn } from '@/lib/utils';

interface LoadingBoxProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}

export function LoadingBox({ message = '데이터를 불러오는 중입니다...', size = 'xl' }: LoadingBoxProps) {
  return (
    <div className={cn('flex items-center justify-center py-20', size === 'sm' && 'py-10')}>
      <div className="flex flex-col items-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-teal-100 dark:bg-teal-900/30 blur-lg opacity-70"></div>
          <CircleSpinner size={size} color="teal" className="relative z-10" />
        </div>
        <p className="text-teal-600 dark:text-teal-400 font-medium mt-4">{message}</p>
      </div>
    </div>
  );
}
