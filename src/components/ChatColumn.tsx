import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, User } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { generateChatResponse } from '../lib/groq';

export default function ChatColumn() {
  const { state, dispatch } = useSession();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfChatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chat, loading]);

  const handleSend = async () => {
    if (!input.trim() || !state.apiKey) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Save user message immediately
    dispatch({ 
      type: 'APPEND_CHAT', 
      payload: { role: 'user', content: userMessage, timestamp: Date.now() } 
    });

    try {
      // Build context
      const chatHistory = state.chat.map(m => ({
        role: m.role as string,
        content: m.content
      }));

      // Grab some recent transcript context for the prompt
      const recentTranscript = state.transcript
        .slice(-30) // last 30 chunks
        .map(t => t.text)
        .join(' ');

      const aiResponse = await generateChatResponse(
        recentTranscript,
        chatHistory,
        userMessage,
        state.apiKey,
        state.settings.chatPrompt
      );

      dispatch({
        type: 'APPEND_CHAT',
        payload: { role: 'assistant', content: aiResponse, timestamp: Date.now() }
      });
    } catch (err: any) {
      console.error(err);
      dispatch({
        type: 'APPEND_CHAT',
        payload: { role: 'assistant', content: `Error: ${err.message}`, timestamp: Date.now() }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-[300px] h-full bg-zinc-950 shrink-0 basis-1/3">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm z-10 sticky top-0">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Detailed Answers</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col pt-6">
         {state.chat.length === 0 ? (
           <div className="flex-1 flex items-center justify-center">
             <p className="text-zinc-600 text-sm text-center mb-4 max-w-[250px]">
               Ask TwinMind about details from the transcript or jump into a topic.
             </p>
           </div>
         ) : (
           state.chat.map((msg, idx) => (
             <div 
               key={idx} 
               className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               {msg.role === 'assistant' && (
                 <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                   <Bot className="w-4 h-4 text-emerald-400" />
                 </div>
               )}
               <div 
                 className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-[15px] leading-relaxed ${
                   msg.role === 'user' 
                     ? 'bg-zinc-100 text-zinc-900 rounded-br-sm' 
                     : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-bl-sm'
                 }`}
               >
                 {msg.content}
               </div>
             </div>
           ))
         )}
         
         {loading && (
           <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
               <Bot className="w-4 h-4 text-emerald-400" />
             </div>
             <div className="px-4 py-3 rounded-2xl bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-bl-sm flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
           </div>
         )}
         <div ref={endOfChatRef} className="h-px" />
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-950 mt-auto">
        <form 
          className="relative"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={state.apiKey ? "Ask TwinMind..." : "Add API Key to chat"} 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-4 pr-12 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading || !state.apiKey}
            className="absolute right-2 top-2 p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-800 rounded-md disabled:opacity-50 disabled:hover:text-zinc-400"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
