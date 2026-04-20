import { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { X } from 'lucide-react';

export default function SettingsModal() {
  const { state, dispatch } = useSession();
  const [formData, setFormData] = useState(state.settings);

  useEffect(() => {
    setFormData(state.settings);
  }, [state.settings]);

  if (!state.isSettingsOpen) return null;

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
    if (formData.groqApiKey !== state.apiKey) {
      dispatch({ type: 'SET_API_KEY', payload: formData.groqApiKey });
    }
    dispatch({ type: 'SET_SETTINGS_OPEN', payload: false });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-100">Settings</h2>
          <button 
            onClick={() => dispatch({ type: 'SET_SETTINGS_OPEN', payload: false })}
            className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Authentication</h3>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Groq API Key</label>
              <input 
                type="password"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                value={formData.groqApiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, groqApiKey: e.target.value }))}
                placeholder="gsk_..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Timing & Context</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Live Context (min)</label>
                <input 
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                  value={formData.liveContextMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, liveContextMinutes: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Detailed Context (min)</label>
                <input 
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                  value={formData.detailedContextMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailedContextMinutes: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Chunk Length (sec)</label>
                <input 
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                  value={formData.chunkSeconds}
                  onChange={(e) => setFormData(prev => ({ ...prev, chunkSeconds: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Models</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Reasoning Effort (Live)</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 appearance-none"
                  value={formData.reasoningEffortLive}
                  onChange={(e) => setFormData(prev => ({ ...prev, reasoningEffortLive: e.target.value as any }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Reasoning Effort (Chat)</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 appearance-none"
                  value={formData.reasoningEffortChat}
                  onChange={(e) => setFormData(prev => ({ ...prev, reasoningEffortChat: e.target.value as any }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-zinc-100 text-zinc-900 rounded-lg font-medium hover:bg-white transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
