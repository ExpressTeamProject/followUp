import { SelectOption } from '@/types/common';

export const PROBLEM_CATEGORY_VALUES = [
  '수학',
  '물리학',
  '화학',
  '생물학',
  '컴퓨터공학',
  '전자공학',
  '기계공학',
  '경영학',
  '경제학',
  '심리학',
  '사회학',
  '기타',
] as const satisfies string[];

export const PROBLEM_CATEGORY_OPTIONS = PROBLEM_CATEGORY_VALUES.map(value => ({
  value,
  label: value,
}));

export const POPULAR_TAGS = [
  '미분방정식',
  '알고리즘',
  '양자역학',
  '유기화학',
  '데이터구조',
  '열역학',
  '선형대수',
  '통계학',
  '기타',
] as const satisfies string[];

export const PROBLEM_STATUSES = ['all', 'solved', 'unsolved'] as const satisfies string[];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'comments', label: '댓글순' },
] as const satisfies SelectOption[];

export const SORT_VALUES = SORT_OPTIONS.map(option => option.value);

export const PROBLEM_SUGGESTED_TAGS = [
  '미분방정식',
  '선형대수',
  '확률론',
  '통계학',
  '해석학',
  '대수학',
  '기하학',
  '위상수학',
  '이산수학',
  '수치해석',
  '양자역학',
  '전자기학',
  '열역학',
  '유체역학',
  '광학',
  '상대성이론',
  '입자물리학',
  '천체물리학',
  '유기화학',
  '무기화학',
  '물리화학',
  '분석화학',
  '생화학',
  '고분자화학',
  '알고리즘',
  '자료구조',
  '운영체제',
  '컴퓨터네트워크',
  '데이터베이스',
  '인공지능',
  '기계학습',
  '컴퓨터비전',
  '자연어처리',
  '웹개발',
  '모바일개발',
] as const satisfies string[];

export const ARTICLE_SUGGESTED_TAGS = [
  '질문',
  '정보공유',
  '스터디모집',
  '프로젝트',
  '취업',
  '대학원',
  '수학',
  '물리학',
  '화학',
  '생물학',
  '컴퓨터공학',
  '전자공학',
  '기계공학',
  '경영학',
  '경제학',
  '심리학',
  '사회학',
  '인문학',
  '예술',
  '교육',
  '의학',
  '약학',
  '간호학',
  '법학',
  '행정학',
] as const satisfies string[];

export const ARTICLE_CATEGORY_VALUES = ['질문', '정보', '모집', '후기', '기타'] as const satisfies string[];

export const ARTICLE_CATEGORY_OPTIONS = ARTICLE_CATEGORY_VALUES.map(value => ({
  value,
  label: value,
}));

export const MAJOR_VALUES = [
  '수학',
  '물리학',
  '화학',
  '생물학',
  '컴퓨터공학',
  '전자공학',
  '기계공학',
  '경영학',
  '경제학',
  '심리학',
  '사회학',
  '기타',
] as const satisfies string[];

export const MAJOR_OPTIONS = MAJOR_VALUES.map(value => ({
  value,
  label: value,
}));
