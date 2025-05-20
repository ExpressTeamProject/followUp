import { Link, useLocation, Outlet, ScrollRestoration, useNavigate } from 'react-router';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';
import { Plus, Bell, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Footer from './footer';
import MobileFooterNav from './mobile-footer-nav';
import useAuthStore from '@/store/useAuthStore';
import { ROUTE_SEGMENT, ROUTES } from '@/lib/router/routes';
import { logout } from '@/lib/api/auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const hideFooterPaths = [ROUTES.COMMUNITY.LIST, ROUTES.COMMUNITY.NEW, ROUTES.PROBLEMS.NEW] as const;
const showFabPaths = [ROUTES.COMMUNITY.LIST, ROUTES.PROBLEMS.LIST] as const;

export function CommonLayout() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hideFooter = hideFooterPaths.includes(location.pathname as (typeof hideFooterPaths)[number]);
  const showFab = showFabPaths.includes(location.pathname as (typeof showFabPaths)[number]);

  const getNewPostPath = () => {
    return location.pathname.includes('problems') ? ROUTES.PROBLEMS.NEW : ROUTES.COMMUNITY.NEW;
  };

  const handleLogout = async () => {
    await logout();
    clearAuth();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header
        className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-8 max-w-full mx-auto">
          <MainNav />
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
                <Link to={ROUTES.USER.PROFILE.replace(ROUTE_SEGMENT.ID, user?.id || '')}>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                </Link>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative" onClick={handleLogout}>
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>로그아웃</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <>
                <Link to={ROUTES.AUTH.LOGIN}>
                  <Button variant="ghost" className="rounded-full">
                    로그인
                  </Button>
                </Link>
                <Link to={ROUTES.AUTH.REGISTER}>
                  <Button className="rounded-full bg-teal-500 hover:bg-teal-600 transition-colors">회원가입</Button>
                </Link>
              </>
            )}
          </div>
          <MobileNav />
        </div>
      </header>

      <Outlet />

      {!hideFooter && <Footer />}
      <MobileFooterNav />

      {showFab && (
        <Button
          asChild
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg md:hidden md:bottom-8"
          size="icon"
          variant="default"
        >
          <Link to={getNewPostPath()}>
            <Plus className="size-5" />
          </Link>
        </Button>
      )}

      <ScrollRestoration />
    </div>
  );
}
