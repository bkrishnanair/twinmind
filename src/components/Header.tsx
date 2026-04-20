
import { Settings, Download } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function Header() {
  const { dispatch } = useSession();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
      <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">TwinMind — Live Suggestions</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors" title="Export">
          <Download className="w-5 h-5" />
        </button>
        <button 
          className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors" 
          title="Settings"
          onClick={() => dispatch({ type: 'SET_SETTINGS_OPEN', payload: true })}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
