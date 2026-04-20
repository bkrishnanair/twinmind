import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { startChunkedRecording } from '../lib/audio';
import { transcribe } from '../lib/groq';

export default function TranscriptColumn() {
  const { state, dispatch } = useSession();
  const [error, setError] = useState<string | null>(null);
  const stopRecordingRef = useRef<(() => void) | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of the transcript whenever it updates
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.transcript]);

  const handleToggleMic = async () => {
    if (state.isRecording) {
      // Stop recording
      if (stopRecordingRef.current) {
        stopRecordingRef.current();
        stopRecordingRef.current = null;
      }
      dispatch({ type: 'SET_IS_RECORDING', payload: false });
      return;
    }

    // Start recording
    setError(null);
    if (!state.apiKey) {
      setError('Missing Groq API Key. Please add it in settings.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const onChunk = async (blob: Blob) => {
        try {
          const text = await transcribe(blob, state.apiKey);
          if (text && text.trim()) {
            dispatch({
              type: 'APPEND_TRANSCRIPT',
              payload: { text: text.trim(), timestamp: Date.now() }
            });
          }
        } catch (err: any) {
          setError(err.message || 'Failed to transcribe chunk.');
        }
      };

      stopRecordingRef.current = startChunkedRecording(stream, state.settings.chunkSeconds, onChunk);
      dispatch({ type: 'SET_IS_RECORDING', payload: true });
    } catch (err) {
      setError('Microphone access denied or error occurred.');
      console.error(err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopRecordingRef.current) {
        stopRecordingRef.current();
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-[300px] h-full bg-zinc-950 shrink-0 basis-1/3">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/90 backdrop-blur-sm z-10">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          Transcript
          {state.isRecording && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </h2>
        <button 
          onClick={handleToggleMic}
          className={`p-3 rounded-full transition-colors ${state.isRecording ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
          title={state.isRecording ? "Stop listening" : "Start listening"}
        >
          {state.isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>

      {error && (
        <div className="m-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.transcript.length === 0 ? (
          <p className="text-zinc-500 italic text-sm mt-4 text-center">
            {state.isRecording ? "Listening..." : "Waiting for audio..."}
          </p>
        ) : (
          state.transcript.map((line, idx) => (
            <div key={idx} className="flex gap-4 group">
              <span className="text-zinc-600 text-xs mt-1 w-12 shrink-0">
                {new Date(line.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
              <p className="text-zinc-300 text-sm leading-relaxed">{line.text}</p>
            </div>
          ))
        )}
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
}
