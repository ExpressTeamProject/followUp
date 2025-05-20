import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import ProblemDetailCard from '@/components/problem-detail/ProblemDetailCard';

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="flex-1 w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container py-8 px-4 md:px-6 mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/problems" className="flex items-center text-gray-500 hover:text-teal-500 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            문제 목록으로 돌아가기
          </Link>
        </div>
        <ProblemDetailCard problemId={id || '0'} />
      </div>
    </main>
  );
}
