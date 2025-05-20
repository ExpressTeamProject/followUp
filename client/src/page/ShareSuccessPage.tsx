import type React from "react";
import { useEffect } from "react";

interface ShareSuccessModalProps {
  onComplete: () => void;
}

const ShareSuccessModal: React.FC<ShareSuccessModalProps> = ({ onComplete }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onComplete();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onComplete]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onComplete();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.2)] backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-teal-500 dark:text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-center font-semibold text-teal-500 dark:text-teal-400 text-lg mb-2">주소 복사 완료!</h2>

          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            클립보드에 현재 페이지 주소가 복사되었습니다.
          </p>

          <button
            onClick={onComplete}
            className="w-full py-2.5 rounded-md bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSuccessModal;
