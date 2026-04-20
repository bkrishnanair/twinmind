
import { RefreshCw } from 'lucide-react';

export default function SuggestionsColumn() {
  return (
    <div className="flex-1 flex flex-col min-w-[300px] h-full bg-zinc-900 shrink-0 basis-1/3">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Live Suggestions</h2>
        <button className="flex items-center space-x-2 px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm font-medium">
          <RefreshCw className="w-4 h-4" />
          <span>Reload</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Placeholder for suggestion batches */}
        <p className="text-zinc-500 italic text-sm text-center mt-10">Start speaking to generate suggestions</p>
      </div>
    </div>
  );
}
