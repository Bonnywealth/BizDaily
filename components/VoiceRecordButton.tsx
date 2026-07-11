"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { parseVoiceTranscript } from "@/lib/voiceParse";
import clsx from "clsx";

interface Props {
  onResult: (sales: number | null, expenses: number | null, transcript: string) => void;
}

export default function VoiceRecordButton({ onResult }: Props) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-NG";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      const { sales, expenses } = parseVoiceTranscript(text);
      onResult(sales, expenses, text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!supported) {
    return (
      <p className="text-[11px] text-slate-muted text-center mt-1">
        Voice input isn't supported on this browser — try Chrome or the Android app.
      </p>
    );
  }

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={toggleListening}
        className={clsx(
          "w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-95",
          listening ? "bg-rust text-white" : "bg-emerald-soft text-emerald"
        )}
      >
        {listening ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
      </button>
      <span className="text-[11px] font-medium text-slate-muted">
        {listening ? "Listening… tap to stop" : "Tap to speak your sales & expenses"}
      </span>
      {transcript && (
        <p className="text-[12px] text-ink/70 italic text-center max-w-[26ch]">"{transcript}"</p>
      )}
    </div>
  );
}
