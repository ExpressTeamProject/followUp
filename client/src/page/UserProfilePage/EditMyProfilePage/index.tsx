import { API_PATHS } from '@/lib/api/api-paths';
import { getMe, updateProfileDetails, updateProfileImage } from '@/lib/api/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera } from 'lucide-react';
import { ROUTE_SEGMENT, ROUTES } from '@/lib/router/routes';
import { strIdSchema } from '@/lib/validations/common';
import { Controller, useForm } from 'react-hook-form';
import { editMyProfileSchema, EditMyProfileSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { MAJOR_OPTIONS } from '@/config/options';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function EditMyProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const userId = strIdSchema.parse(params.id);
  const queryClient = useQueryClient();

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const { data: myInfo } = useQuery({
    queryKey: [API_PATHS.AUTH.ME],
    queryFn: () => getMe(),
  });

  const form = useForm<EditMyProfileSchema>({
    defaultValues: {
      username: myInfo?.data.username,
      nickname: myInfo?.data.nickname,
      email: myInfo?.data.email,
      bio: myInfo?.data.bio,
      major: myInfo?.data.major,
      website: myInfo?.data.website,
      socialLinks: {
        github: myInfo?.data.socialLinks?.github?.replace('https://github.com/', ''),
        twitter: myInfo?.data.socialLinks?.twitter?.replace('https://twitter.com/', ''),
      },
    },
    resolver: zodResolver(editMyProfileSchema),
  });

  const updateDetailsMutation = useMutation({
    mutationFn: updateProfileDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_PATHS.AUTH.ME] });
      toast.success('프로필이 업데이트되었습니다.');
    },
    onError: () => {
      toast.error('프로필 업데이트에 실패했습니다.');
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_PATHS.AUTH.ME] });
      toast.success('프로필 이미지가 업데이트되었습니다.');
    },
    onError: () => {
      toast.error('프로필 이미지 업데이트에 실패했습니다.');
    },
  });

  const handleProfileImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      setProfileImageFile(file);
      updateImageMutation.mutate(file);
    }
  };

  console.log(form.formState.errors);

  const onSubmit = async (data: EditMyProfileSchema) => {
    await updateDetailsMutation.mutateAsync(data);
    navigate(ROUTES.USER.PROFILE.replace(ROUTE_SEGMENT.ID, userId));
  };

  useEffect(() => {
    if (myInfo?.data) {
      form.reset({
        ...myInfo.data,
        socialLinks: {
          github: myInfo.data.socialLinks?.github?.replace('https://github.com/', ''),
          twitter: myInfo.data.socialLinks?.twitter?.replace('https://twitter.com/', ''),
        },
      });
    }
  }, [myInfo?.data, form]);

  const profileImageUrl = profileImageFile
    ? URL.createObjectURL(profileImageFile)
    : myInfo?.data.profileImage
      ? `${import.meta.env.VITE_API_URL}${myInfo.data.profileImage}`
      : undefined;

  return (
    <div className="container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link
            to={ROUTES.USER.PROFILE.replace(ROUTE_SEGMENT.ID, userId)}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            프로필로 돌아가기
          </Link>
        </div>

        <Card className="border-none shadow-lg dark:shadow-gray-800/30">
          <CardHeader>
            <CardTitle className="text-2xl">프로필 편집</CardTitle>
            <CardDescription>프로필 정보를 수정하여 다른 사용자들에게 나를 소개하세요</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-md">
                    <AvatarImage src={profileImageUrl} alt={myInfo?.data.nickname} />
                    <AvatarFallback className="text-4xl">{myInfo?.data.nickname?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer hover:bg-teal-600 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">프로필 이미지 변경</span>
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleProfileImageUpload(e.target.files)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">프로필 이미지를 변경하려면 이미지를 클릭하세요</p>
              </div>

              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">사용자 이름 (ID)</Label>
                  <Input {...form.register('username')} disabled readOnly className="bg-gray-50 dark:bg-gray-900" />
                  <p className="text-xs text-muted-foreground">사용자 이름은 변경할 수 없습니다</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">표시 이름</Label>
                  <Input {...form.register('nickname')} />
                  {form.formState.errors.nickname && (
                    <p className="text-xs text-red-500">{form.formState.errors.nickname.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input {...form.register('email')} type="email" required />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">자기소개</Label>
                <Textarea {...form.register('bio')} rows={4} placeholder="자신에 대한 소개를 작성해주세요" />
                {form.formState.errors.bio && (
                  <p className="text-xs text-red-500">{form.formState.errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">전공</Label>
                <Controller
                  name="major"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="전공 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {MAJOR_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.major && (
                  <p className="text-sm text-red-500">{form.formState.errors.major.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">웹사이트</Label>
                <Input id="website" {...form.register('website')} type="url" placeholder="https://example.com" />
              </div>

              {/* 소셜 링크 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">소셜 미디어</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm">
                        github.com/
                      </span>
                      <Input {...form.register('socialLinks.github')} className="rounded-l-none" />
                    </div>
                    {form.formState.errors.socialLinks?.github && (
                      <p className="text-xs text-red-500">{form.formState.errors.socialLinks.github.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm">
                        twitter.com/
                      </span>
                      <Input {...form.register('socialLinks.twitter')} className="rounded-l-none" />
                    </div>
                    {form.formState.errors.socialLinks?.twitter && (
                      <p className="text-xs text-red-500">{form.formState.errors.socialLinks.twitter.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 계정 설정 링크 */}
              <div className="border-t py-4">
                <h3 className="text-lg font-medium mb-2">계정 설정</h3>
                <div className="flex flex-col gap-2">
                  <Link
                    to={ROUTES.AUTH.RESET_PASSWORD}
                    className="text-teal-500 hover:text-teal-600 transition-colors text-sm w-fit"
                  >
                    비밀번호 변경
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link to={ROUTES.USER.PROFILE.replace(ROUTE_SEGMENT.ID, userId)}>취소</Link>
              </Button>
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 transition-colors"
                disabled={updateDetailsMutation.isPending}
              >
                변경사항 저장
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
