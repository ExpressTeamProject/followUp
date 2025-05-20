import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router';

export default function PageHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Users className="mr-2 h-8 w-8 text-teal-500" />
          커뮤니티
        </h1>
        <p className="text-muted-foreground mt-1">다양한 학문적 주제에 대해 토론하고 정보를 공유하는 공간입니다</p>
      </div>
      <Link to="/community/new">
        <Button className="rounded-full bg-teal-500 hover:bg-teal-600 transition-colors">
          <MessageSquare className="mr-2 h-4 w-4" /> 새 글 작성
        </Button>
      </Link>
    </div>
  );
}
