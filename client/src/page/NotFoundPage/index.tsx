import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ROUTES } from '@/lib/router/routes';
import { FileQuestion } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 text-center">
        <div className="mb-8">
          <FileQuestion className="mx-auto h-24 w-24 text-teal-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">페이지를 찾을 수 없습니다</h1>
        <p className="text-lg text-muted-foreground mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
        <Button asChild className="bg-teal-500 hover:bg-teal-600 transition-colors">
          <Link to={ROUTES.HOME}>홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
