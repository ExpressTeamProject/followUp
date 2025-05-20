import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/lib/router/routes';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // 실제 API 호출은 여기에 구현
      // const response = await fetch("/api/auth/forgot-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      // 데모 목적으로 타임아웃 사용
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 성공 메시지 설정
      setMessage({
        type: 'success',
        text: '비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.',
      });

      // 실제 구현에서는 응답 처리
      // if (response.ok) {
      //   const data = await response.json();
      //   setMessage({ type: "success", text: data.message });
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
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <CardTitle className="text-2xl font-bold text-center">비밀번호 찾기</CardTitle>
            <CardDescription className="text-center">
              가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '비밀번호 재설정 링크 받기'}
              </Button>
              <div className="text-center text-sm">
                계정이 없으신가요?{' '}
                <Link to={ROUTES.AUTH.REGISTER} className="text-teal-500 hover:text-teal-600 hover:underline">
                  회원가입
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
