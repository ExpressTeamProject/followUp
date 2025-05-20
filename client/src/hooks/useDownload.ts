import { useState } from 'react';

interface DownloadOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async (blobPromise: Promise<Blob>, filename: string, options: DownloadOptions = {}) => {
    const { onSuccess, onError } = options;

    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const blob = await blobPromise;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to download file:', error);
      onError?.(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadFile,
    isDownloading,
  };
}
