
import { SendHorizontal } from 'lucide-react';

export default function ChatColumn() {
  return (
    <div className="flex-1 flex flex-col min-w-[300px] h-full bg-zinc-950 shrink-0 basis-1/3">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Detailed Answers</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end">
         {/* Placeholder for chat */}
         <p className="text-zinc-600 text-sm text-center mb-4">Click a suggestion or type a question to get more details.</p>
      </div>
      <div className="p-4 border-t border-zinc-800 bg-zinc-950 object-bottom">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask TwinMind..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-4 pr-12 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
          <button className="absolute right-2 top-2 p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-800 rounded-md">
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
