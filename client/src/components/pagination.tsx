import { Button } from './ui/button';
interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="sr-only">이전 페이지</span>
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
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
        {Array.from({ length: lastPage }, (_, index) => {
          const isCurrentPage = currentPage === index + 1;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`rounded-full ${isCurrentPage ? 'bg-primary text-primary-foreground cursor-default hover:pointer-events-none hover:bg-primary hover:text-primary-foreground' : ''}`}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </Button>
          );
        })}
        {/* <span className="mx-1">...</span> */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="sr-only">다음 페이지</span>
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
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </nav>
    </div>
  );
}

export default Pagination;
