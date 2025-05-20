import { Button } from '@/components/ui/button';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router';
import { ROUTES } from '@/lib/router/routes';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();

  let title = '오류가 발생했습니다';
  let message = '예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = '페이지를 찾을 수 없습니다';
      message = '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.';
    } else if (error.status === 401) {
      title = '접근 권한이 없습니다';
      message = '이 페이지에 접근할 권한이 없습니다. 로그인이 필요할 수 있습니다.';
    } else if (error.status === 403) {
      title = '접근이 거부되었습니다';
      message = '이 페이지에 대한 접근 권한이 없습니다.';
    } else if (error.status === 503) {
      title = '서비스를 이용할 수 없습니다';
      message = '현재 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 text-center">
        <div className="mb-8">
          <AlertCircle className="mx-auto h-24 w-24 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{message}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => {
              window.location.reload();
            }}
          >
            페이지 새로고침
          </Button>
          <Button asChild className="bg-teal-500 hover:bg-teal-600 transition-colors">
            <Link to={ROUTES.HOME}>홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
