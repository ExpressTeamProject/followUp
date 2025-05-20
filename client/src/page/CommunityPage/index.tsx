import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import SideSection from './SideSection';
import ArticleList from './ArticleList';

export default function CommunityPage() {
  return (
    <div className="container py-8 px-4 md:px-8 max-w-full mx-auto">
      <div className="flex flex-col gap-6">
        <PageHeader />
        <SearchBar />
        <div className="flex flex-col md:flex-row gap-6">
          <SideSection />
          <ArticleList />
        </div>
      </div>
    </div>
  );
}
