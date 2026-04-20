import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { SessionState, Settings, TranscriptLine, SuggestionBatch, ChatMessage } from '../lib/types';

const defaultSettings: Settings = {
  groqApiKey: '',
  liveSuggestionsPrompt: '',
  detailedAnswerPrompt: '',
  chatPrompt: '',
  liveContextMinutes: 5,
  detailedContextMinutes: 60,
  chunkSeconds: 30,
  reasoningEffortLive: 'low',
  reasoningEffortChat: 'medium',
};

const initialState: SessionState = {
  apiKey: '',
  isRecording: false,
  transcript: [],
  suggestionBatches: [],
  chat: [],
  settings: defaultSettings,
  isSettingsOpen: false,
};

type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_IS_RECORDING'; payload: boolean }
  | { type: 'APPEND_TRANSCRIPT'; payload: TranscriptLine }
  | { type: 'PREPEND_SUGGESTION_BATCH'; payload: SuggestionBatch }
  | { type: 'APPEND_CHAT'; payload: ChatMessage }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_SETTINGS_OPEN'; payload: boolean };

function sessionReducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload, settings: { ...state.settings, groqApiKey: action.payload } };
    case 'SET_IS_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'APPEND_TRANSCRIPT':
      return { ...state, transcript: [...state.transcript, action.payload] };
    case 'PREPEND_SUGGESTION_BATCH':
      return { ...state, suggestionBatches: [action.payload, ...state.suggestionBatches] };
    case 'APPEND_CHAT':
      return { ...state, chat: [...state.chat, action.payload] };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_SETTINGS_OPEN':
      return { ...state, isSettingsOpen: action.payload };
    default:
      return state;
  }
}

interface SessionContextType {
  state: SessionState;
  dispatch: Dispatch<Action>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Load state from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('twinmind-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsed });
        if (parsed.groqApiKey) {
          dispatch({ type: 'SET_API_KEY', payload: parsed.groqApiKey });
        }
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
  }, []);

  // Sync settings to localStorage on change
  useEffect(() => {
    localStorage.setItem('twinmind-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
