import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Mail, GraduationCap, Calendar, Edit } from 'lucide-react';
import { ResUserInfo } from '@/types/common';
import { ROUTE_SEGMENT } from '@/lib/router/routes';
import { ROUTES } from '@/lib/router/routes';

interface Props {
  user: ResUserInfo;
  isMe: boolean;
}

export default function UserBasicInfo({ user, isMe }: Props) {
  const profileUrl = `${import.meta.env.VITE_API_URL}${user.profileImage || '/placeholder.svg'}`;

  return (
    <Card className="border-none shadow-lg dark:shadow-gray-800/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-md">
              <AvatarImage src={profileUrl} alt={user.username} />
              <AvatarFallback className="text-4xl">{user.nickname.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">{user.nickname}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
              {isMe ? (
                <Link to={ROUTES.USER.SETTINGS.replace(ROUTE_SEGMENT.ID, user._id)}>
                  <Button className="mt-2 md:mt-0 bg-teal-500 hover:bg-teal-600 transition-colors">
                    <Edit className="mr-2 h-4 w-4" /> 프로필 편집
                  </Button>
                </Link>
              ) : (
                <Button className="mt-2 md:mt-0 bg-teal-500 hover:bg-teal-600 transition-colors">
                  <Mail className="mr-2 h-4 w-4" /> 메시지 보내기
                </Button>
              )}
            </div>
            {/* <p className="mb-4">{user}</p> */}
            <div className="flex flex-wrap gap-4 text-sm">
              <p className="mb-4">{user.bio}</p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{user.major}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
