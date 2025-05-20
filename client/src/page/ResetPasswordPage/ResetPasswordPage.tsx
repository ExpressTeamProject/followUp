import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BookOpen, Lock, Eye, EyeOff } from 'lucide-react';
import useResetPasswordMutation from './useResetPasswordMutation';
import { ROUTES } from '@/lib/router/routes';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const { mutate: resetPassword, formData, setFormData, isPending } = useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = isPending;
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  useEffect(() => {
    // 토큰 유효성 검사 (실제 구현에서는 API 호출)
    const validateToken = async () => {
      try {
        // 실제 API 호출은 여기에 구현
        // const response = await fetch(`/api/auth/validate-reset-token/${token}`);
        // if (!response.ok) {
        //   setIsTokenValid(false);
        // }

        // 데모 목적으로 토큰이 유효하다고 가정
        setIsTokenValid(true);
      } catch (error) {
        console.error(error);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 일치 확인
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    resetPassword(formData);
    setMessage({ type: '', text: '' });

    try {
      // 실제 API 호출은 여기에 구현
      // const response = await fetch(`/api/auth/reset-password`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     token,
      //     password: formData.password,
      //   }),
      // });

      // 데모 목적으로 타임아웃 사용
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 성공 메시지 설정
      setMessage({
        type: 'success',
        text: '비밀번호가 성공적으로 재설정되었습니다.',
      });

      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        navigate('/login');
      }, 3000);

      // 실제 구현에서는 응답 처리
      // if (response.ok) {
      //   const data = await response.json();
      //   setMessage({ type: "success", text: data.message });
      //   setTimeout(() => {
      //     navigate("/login");
      //   }, 3000);
      // } else {
      //   const error = await response.json();
      //   setMessage({ type: "error", text: error.message });
      // }
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  if (!isTokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full border-none shadow-lg dark:shadow-gray-800/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">유효하지 않은 링크</CardTitle>
              <CardDescription className="text-center">
                비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link to="/forgot-password">
                <Button className="bg-teal-500 hover:bg-teal-600 transition-colors">새 링크 요청하기</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full border-none shadow-lg dark:shadow-gray-800/30">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center mb-4">
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="text-gray-500 hover:text-teal-500 transition-colors flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>로그인으로 돌아가기</span>
              </Link>
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-teal-500" />
                <span className="font-bold text-xl">학문공유</span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-center">비밀번호 재설정</CardTitle>
            <CardDescription className="text-center">새로운 비밀번호를 입력해주세요.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="password">새 비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 rounded-lg border-gray-300 dark:border-gray-700 focus-visible:ring-teal-500"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">비밀번호는 최소 8자 이상이어야 합니다.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 rounded-lg border-gray-300 dark:border-gray-700 focus-visible:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {message.text && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : message.type === 'error'
                        ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : ''
                  }`}
                >
                  {message.text}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                type="submit"
                className="w-full rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '비밀번호 변경하기'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
