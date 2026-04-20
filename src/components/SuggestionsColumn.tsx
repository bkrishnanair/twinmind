
import { useState, useEffect } from 'react';
import { RefreshCw, Zap, HelpCircle, CheckSquare, MessageSquare, Info } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { generateSuggestions } from '../lib/groq';
import { Suggestion, SuggestionType } from '../lib/types';

const TypeIcon = ({ type }: { type: SuggestionType }) => {
  switch (type) {
    case 'answer': return <Zap className="w-4 h-4 text-yellow-400" />;
    case 'question': return <HelpCircle className="w-4 h-4 text-purple-400" />;
    case 'fact-check': return <CheckSquare className="w-4 h-4 text-green-400" />;
    case 'talking-point': return <MessageSquare className="w-4 h-4 text-blue-400" />;
    case 'clarification': return <Info className="w-4 h-4 text-orange-400" />;
    default: return <Zap className="w-4 h-4 text-zinc-400" />;
  }
};

export default function SuggestionsColumn() {
  const { state, dispatch } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!state.apiKey) {
      setError('Missing API key in settings.');
      return;
    }
    
    // Get recent transcript text
    const textContext = state.transcript
      .slice(-20) // Get the last 20 chunks to avoid massive token usage
      .map(t => t.text)
      .join(' ');

    if (!textContext.trim()) {
      setError('No recent transcript available.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateSuggestions(
        textContext,
        state.apiKey,
        state.settings.liveSuggestionsPrompt
      );

      // Create a batch
      const newBatch = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        // Needs cast because type could be slightly off but we validated it mostly
        suggestions: response.suggestions as Suggestion[]
      };

      dispatch({ type: 'PREPEND_SUGGESTION_BATCH', payload: newBatch });
    } catch (err: any) {
      setError(err.message || 'Failed to generate suggestions.');
    } finally {
      setLoading(false);
    }
  };

  // Optional: Auto-fetch every X seconds if recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isRecording) {
      // automatically evaluate every 30 seconds
      interval = setInterval(() => {
        fetchSuggestions();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [state.isRecording, state.transcript]); // Re-bind interval nicely

  return (
    <div className="flex-1 flex flex-col min-w-[300px] h-full bg-zinc-900 shrink-0 basis-1/3">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/90 backdrop-blur-sm z-10 sticky top-0">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Live Suggestions</h2>
        <button 
          onClick={fetchSuggestions}
          disabled={loading}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-colors text-sm font-medium
            ${loading ? 'bg-zinc-800 cursor-not-allowed text-zinc-500' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {state.suggestionBatches.length === 0 && !loading && !error && (
          <p className="text-zinc-500 italic text-sm text-center mt-10">Start recording to generate suggestions automatically, or click reload manually.</p>
        )}

        {state.suggestionBatches.map((batch) => (
          <div key={batch.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <div className="h-px bg-zinc-800 flex-1" />
              <span>{new Date(batch.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>
            
            <div className="space-y-2">
              {batch.suggestions.map((suggestion, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-zinc-700/50 rounded-lg group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <TypeIcon type={suggestion.type} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1 block">
                        {suggestion.type.replace('-', ' ')}
                      </span>
                      <p className="text-sm text-zinc-200 leading-snug">{suggestion.preview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
