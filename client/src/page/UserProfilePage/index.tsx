import { strIdSchema } from '@/lib/validations/common';
import useAuthStore from '@/store/useAuthStore';
import { useParams } from 'react-router';
import UserBasicInfo from './BasicInfo';
import { useQuery } from '@tanstack/react-query';
import { API_PATHS } from '@/lib/api/api-paths';
import { getUser } from '@/lib/api/user';
import { LoadingBox } from '@/components/loading-box';
import UserStatistics from './Statistics';
import UserTabs from './UserTabs';

export default function UserProfilePage() {
  const params = useParams();
  const userId = strIdSchema.parse(params.id);
  const { user } = useAuthStore();

  const { data: userInfoData, isLoading } = useQuery({
    queryKey: [API_PATHS.USERS.PROFILE, userId],
    queryFn: () => getUser(userId),
  });

  const isMe = user?.id === userId;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[500px]">
        <LoadingBox />
      </div>
    );
  if (!userInfoData) return null;

  return (
    <div className="container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-8">
        <UserBasicInfo user={userInfoData?.data} isMe={isMe} />
        <UserStatistics userId={userId} />
        <UserTabs />
      </div>
    </div>
  );
}
