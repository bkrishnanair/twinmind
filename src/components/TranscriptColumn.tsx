
import { Mic, MicOff } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function TranscriptColumn() {
  const { state, dispatch } = useSession();

  return (
    <div className="flex-1 flex flex-col min-w-[300px] h-full bg-zinc-950 shrink-0 basis-1/3">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Transcript</h2>
        <button 
          onClick={() => dispatch({ type: 'SET_IS_RECORDING', payload: !state.isRecording })}
          className={`p-3 rounded-full transition-colors ${state.isRecording ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
        >
          {state.isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder for transcript lines */}
        <p className="text-zinc-500 italic text-sm">Waiting for audio...</p>
      </div>
    </div>
  );
}
