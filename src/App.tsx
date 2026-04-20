import Header from './components/Header'
import TranscriptColumn from './components/TranscriptColumn'
import SuggestionsColumn from './components/SuggestionsColumn'
import ChatColumn from './components/ChatColumn'
import SettingsModal from './components/SettingsModal'

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <TranscriptColumn />
        <div className="w-px bg-zinc-800 shrink-0" />
        <SuggestionsColumn />
        <div className="w-px bg-zinc-800 shrink-0" />
        <ChatColumn />
      </div>
      <SettingsModal />
    </div>
  )
}

export default App
