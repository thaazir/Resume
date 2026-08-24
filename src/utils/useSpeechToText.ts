import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition interface for standard and webkit prefixes
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useSpeechToText(onTranscript?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const isSupported = typeof window !== 'undefined' && Boolean(
    (window as unknown as IWindow).SpeechRecognition || (window as unknown as IWindow).webkitSpeechRecognition
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!isSupported) return;

    if (isListening && recognitionRef.current) {
      stopListening();
      return;
    }

    // Lazy instantiation ONLY when the user actively initiates dictation
    try {
      const win = window as unknown as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
          if (onTranscriptRef.current) {
            onTranscriptRef.current(finalTranscript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status/error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setTranscript('');
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  }, [isListening, isSupported, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    toggleListening,
    stopListening,
  };
}
