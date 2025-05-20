import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, MessageSquare, Award } from 'lucide-react';

const activityLog = [
  {
    id: 1,
    type: 'problem',
    action: 'created',
    title: '미분방정식의 일반해 구하기',
    date: '2023-04-28',
  },
  {
    id: 2,
    type: 'solution',
    action: 'submitted',
    title: '뉴턴의 운동법칙 적용 문제',
    date: '2023-04-27',
  },
  {
    id: 3,
    type: 'post',
    action: 'created',
    title: '미분방정식 공부 방법 추천',
    date: '2023-05-02',
  },
  {
    id: 4,
    type: 'comment',
    action: 'commented',
    title: '유기화학 반응 메커니즘 설명',
    date: '2023-04-26',
  },
  {
    id: 5,
    type: 'badge',
    action: 'earned',
    title: '해결사 골드 배지',
    date: '2023-04-25',
  },
];

export default function Activities() {
  return (
    <Card className="border-none shadow-md dark:shadow-gray-800/30">
      <CardHeader>
        <CardTitle>활동 내역</CardTitle>
        <CardDescription>사용자의 최근 활동 내역입니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityLog.map(activity => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                {activity.type === 'problem' && <BookOpen className="h-5 w-5 text-blue-500" />}
                {activity.type === 'solution' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {activity.type === 'post' && <MessageSquare className="h-5 w-5 text-purple-500" />}
                {activity.type === 'comment' && <MessageSquare className="h-5 w-5 text-amber-500" />}
                {activity.type === 'badge' && <Award className="h-5 w-5 text-yellow-500" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <p className="font-medium">
                    {activity.action === 'created' && '새 문제를 등록했습니다'}
                    {activity.action === 'submitted' && '문제를 해결했습니다'}
                    {activity.action === 'commented' && '댓글을 작성했습니다'}
                    {activity.action === 'earned' && '배지를 획득했습니다'}
                  </p>
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                </div>
                <p className="text-sm mt-1">{activity.title}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
