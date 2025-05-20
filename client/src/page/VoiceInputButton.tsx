import { useState } from 'react';
import { Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}
interface VoiceInputButtonProps {
  onTranscriptReceived: (transcript: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscriptReceived, className }: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false);

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      onTranscriptReceived(transcript);
    };
    recognition.onerror = event => {
      alert('음성 인식 오류: ' + event.error);
      setListening(false);
    };

    recognition.start();
  };

  return (
    <Tooltip>
      <Button
        type="button"
        onClick={handleMicClick}
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-3 rounded-full transition-all duration-200 flex items-center gap-1.5',
          listening
            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 border-teal-300 shadow-inner'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
          className,
        )}
        disabled={listening}
      >
        <Mic className={cn('w-4 h-4 transition-all', listening && 'animate-pulse text-teal-600 dark:text-teal-400')} />
        <span className="text-xs font-medium">{listening ? '듣는 중...' : '음성 입력'}</span>
      </Button>
    </Tooltip>
  );
}
