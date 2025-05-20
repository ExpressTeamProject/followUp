import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { ROUTE_SEGMENT, ROUTES } from '@/lib/router/routes';
import useAuthStore from '@/store/useAuthStore';
import { logout } from '@/lib/api/auth';
import { Bell, Search, Menu, BookOpen } from 'lucide-react';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  // // 현재 로그인한 사용자 정보 (실제 구현에서는 인증 상태에서 가져옴)
  // const currentUser = {
  //   username: "mathprofessor",
  //   avatar: "/musical-performance.png",
  //   notifications: 3,
  // };

  // 현재 경로에 따라 활성 상태 결정
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    clearAuth();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2">
          {/* 알림 버튼 */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {/* {currentUser.notifications > 0 && ( */}
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
              3
            </Badge>
            {/* )} */}
          </Button>

          {/* 검색 버튼 */}
          <Link to={ROUTES.SEARCH}>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {/* 사용자 프로필 버튼 */}
          {user && (
            <Link to={ROUTES.USER.PROFILE.replace(ROUTE_SEGMENT.ID, user?.id || '')}>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
            </Link>
          )}

          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
        </div>

        <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
          <div className="flex flex-col h-full">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <BookOpen className="h-6 w-6 text-teal-500" />
                <span className="font-bold text-xl">학문공유</span>
              </Link>
              {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button> */}
            </div>

            {/* 메뉴 항목 */}
            <div className="flex-1 overflow-auto py-4">
              <nav className="flex flex-col gap-1 px-2">
                <Link
                  to="/"
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                    location.pathname === ROUTES.HOME
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-lg">홈</span>
                </Link>

                <Link
                  to="/problems"
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                    isActive(ROUTES.PROBLEMS.LIST)
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-lg">문제 목록</span>
                </Link>

                <Link
                  to="/solved"
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                    isActive(ROUTES.SOLVED)
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-lg">해결된 문제</span>
                </Link>

                <Link
                  to="/community"
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                    isActive(ROUTES.COMMUNITY.LIST)
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" x2="14" y1="17" y2="17" />
                    <line x1="6" x2="14" y1="13" y2="13" />
                    <line x1="9" x2="14" y1="9" y2="9" />
                  </svg>
                  <span className="text-lg">커뮤니티</span>
                </Link>

                <Link
                  to="/ranking"
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                    isActive(ROUTES.RANKING)
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 20V10" />
                    <path d="M12 20V4" />
                    <path d="M6 20v-6" />
                  </svg>
                  <span className="text-lg">랭킹</span>
                </Link>
              </nav>

              <div className="mt-4 px-4">
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">바로가기</h3>
                <nav className="flex flex-col gap-1">
                  <Link
                    to="/problems/new"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-teal-500"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    <span>문제 등록하기</span>
                  </Link>
                  <Link
                    to={ROUTES.COMMUNITY.NEW}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-teal-500"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                    <span>글 작성하기</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* 로그인/회원가입 버튼 */}
            <div className="p-4 border-t">
              <div className="flex flex-col gap-2">
                {user ? (
                  <Button variant="outline" className="w-full rounded-full" onClick={handleLogout}>
                    로그아웃
                  </Button>
                ) : (
                  <>
                    <Link to={ROUTES.AUTH.LOGIN} onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full">
                        로그인
                      </Button>
                    </Link>
                    <Link to={ROUTES.AUTH.REGISTER} onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-full bg-teal-500 hover:bg-teal-600 transition-colors">
                        회원가입
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
