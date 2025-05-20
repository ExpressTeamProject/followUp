import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { CommentSection } from "./comment/comment-section";
import { Problem } from "@/models/Problem";


interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
}

export function SolutionModal({ isOpen, onClose, problem }: SolutionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{problem.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">문제 설명</h3>
            <p className="text-gray-700 dark:text-gray-300">{problem.content}</p>
          </div>  
        </div>
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-2">답변</h3>
          <CommentSection problemId={problem.id} hasNewComment={false} hasReply={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
}