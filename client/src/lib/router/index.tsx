import { createBrowserRouter } from 'react-router';
import { FEATURE_SEGMENT, ROUTE_SEGMENT } from './routes';
import HomePage from '@/page/HomePage';
import LoginPage from '@/page/LoginPage';
import RegisterPage from '@/page/RegisterPage';
import ProblemDetailPage from '@/page/ProblemDetailPage';
import NewProblemPage from '@/page/NewProblemPage/NewProblemPage';
import ProblemsPage from '@/page/ProblemsPage/ProblemsPage';
import SolvedProblemsPage from '@/page/SolvedProblemsPage';
import CommunityPage from '@/page/CommunityPage';
import CommunityNewPage from '@/page/CommunityNewPage';
import RankingPage from '@/page/RankingPage/RankingPage';
import UserProfilePage from '@/page/UserProfilePage';
import SearchResultsPage from '@/page/SearchResultPages/SearchResultsPage';
import AboutPage from '@/components/footer/AboutPage';
import FeaturesPage from '@/components/footer/FeaturesPage';
import HelpPage from '@/components/footer/HelpPage';
import FAQPage from '@/components/footer/FAQPage';
import FAQDetailPage from '@/components/footer/FAQDetailPage';
import TermsPage from '@/components/footer/TermsPage';
import PrivacyPolicyPage from '@/components/footer/PrivacyPolicyPage';
import CookiePolicyPage from '@/components/footer/CookiePolicyPage';
import ContactUsPage from '@/components/footer/ContactUsPage';
import ForgotPasswordPage from '@/page/ForgotPasswordPage';
import ResetPasswordPage from '@/page/ResetPasswordPage/ResetPasswordPage';
import EditProblemPage from '@/components/problem-detail/EditProblemPage';
import { CommonLayout } from '@/components/common-layout';
import ArticleDetail from '@/page/CommunityPage/ArticleDetail';
import ArticleEdit from '@/page/CommunityPage/ArticleEdit';
import EditMyProfile from '@/page/UserProfilePage/EditMyProfilePage';
import NotFoundPage from '@/page/NotFoundPage';
import ErrorBoundary from '@/components/error-boundary';
import { ProtectedRoute } from '@/components/router/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: ROUTE_SEGMENT.HOME,
    element: <CommonLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: FEATURE_SEGMENT.PROBLEMS.ROOT,
        children: [
          {
            index: true,
            element: <ProblemsPage />,
          },
          {
            path: ROUTE_SEGMENT.NEW,
            element: (
              <ProtectedRoute>
                <NewProblemPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_SEGMENT.ID,
            children: [
              {
                index: true,
                element: <ProblemDetailPage />,
              },
              {
                path: ROUTE_SEGMENT.EDIT,
                element: (
                  <ProtectedRoute>
                    <EditProblemPage />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
      {
        path: FEATURE_SEGMENT.SOLVED.ROOT,
        element: <SolvedProblemsPage />,
      },
      {
        path: FEATURE_SEGMENT.COMMUNITY.ROOT,
        children: [
          {
            index: true,
            element: <CommunityPage />,
          },
          {
            path: ROUTE_SEGMENT.NEW,
            element: (
              <ProtectedRoute>
                <CommunityNewPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_SEGMENT.ID,
            children: [
              {
                index: true,
                element: <ArticleDetail />,
              },
              {
                path: ROUTE_SEGMENT.EDIT,
                element: (
                  <ProtectedRoute>
                    <ArticleEdit />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
      {
        path: FEATURE_SEGMENT.RANKING.ROOT,
        element: <RankingPage />,
      },
      {
        path: FEATURE_SEGMENT.USER.ROOT,
        children: [
          {
            path: ROUTE_SEGMENT.ID,
            children: [
              {
                index: true,
                element: <UserProfilePage />,
              },
              {
                path: ROUTE_SEGMENT.EDIT,
                element: (
                  <ProtectedRoute requireSelf>
                    <EditMyProfile />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
      {
        path: FEATURE_SEGMENT.SEARCH.ROOT,
        element: <SearchResultsPage />,
      },
      {
        path: FEATURE_SEGMENT.ABOUT.ROOT,
        element: <AboutPage />,
      },
      {
        path: FEATURE_SEGMENT.FEATURES.ROOT,
        element: <FeaturesPage />,
      },
      {
        path: FEATURE_SEGMENT.HELP.ROOT,
        element: <HelpPage />,
      },
      {
        path: FEATURE_SEGMENT.FAQ.ROOT,
        children: [
          {
            index: true,
            element: <FAQPage />,
          },
          {
            path: ROUTE_SEGMENT.ID,
            element: <FAQDetailPage />,
          },
        ],
      },
      {
        path: FEATURE_SEGMENT.TERMS.ROOT,
        element: <TermsPage />,
      },
      {
        path: FEATURE_SEGMENT.PRIVACY.ROOT,
        element: <PrivacyPolicyPage />,
      },
      {
        path: FEATURE_SEGMENT.COOKIES.ROOT,
        element: <CookiePolicyPage />,
      },
      {
        path: FEATURE_SEGMENT.CONTACT.ROOT,
        element: <ContactUsPage />,
      },
      {
        path: FEATURE_SEGMENT.FEATURES.ROOT,
        element: <FeaturesPage />,
      },
    ],
  },
  {
    path: FEATURE_SEGMENT.AUTH.ROOT,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: FEATURE_SEGMENT.AUTH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: FEATURE_SEGMENT.AUTH.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: FEATURE_SEGMENT.AUTH.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
      {
        path: FEATURE_SEGMENT.AUTH.RESET_PASSWORD,
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: '*',
    element: <CommonLayout />,
    children: [
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
