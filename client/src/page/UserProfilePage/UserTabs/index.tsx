import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleList from './ArticleList';
import SolvedProblemList from './SolvedProblemList';
import SavedItems from './SavedItems';
import ProblemList from './ProblemList';
import Activities from './Activities';
import { useState } from 'react';

export default function UserTabs() {
  const [tab, setTab] = useState('problems');
  console.log('tab', tab);
  return (
    <Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
      <TabsList className="flex justify-between flex-wrap mb-4 h-auto gap-2">
        <TabsTrigger value="problems">등록한 문제</TabsTrigger>
        <TabsTrigger value="solved-problems">해결한 문제</TabsTrigger>
        <TabsTrigger value="articles">커뮤니티 게시글</TabsTrigger>
        <TabsTrigger value="saved-items">저장한 목록</TabsTrigger>
        <TabsTrigger value="activities">활동 내역</TabsTrigger>
      </TabsList>
      <TabsContent value={tab}>
        {tab === 'problems' && <ProblemList />}
        {tab === 'solved-problems' && <SolvedProblemList />}
        {tab === 'articles' && <ArticleList />}
        {tab === 'saved-items' && <SavedItems />}
        {tab === 'activities' && <Activities />}
      </TabsContent>
    </Tabs>
  );
}
