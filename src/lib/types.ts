export type TranscriptLine = {
  text: string;
  timestamp: number;
};

export type SuggestionType = "answer" | "fact-check" | "question" | "talking-point" | "clarification";

export type Suggestion = {
  type: SuggestionType;
  preview: string;
};

export type SuggestionBatch = {
  id: string;
  timestamp: number;
  suggestions: Suggestion[];
};

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

export type Settings = {
  groqApiKey: string;
  liveSuggestionsPrompt: string;
  detailedAnswerPrompt: string;
  chatPrompt: string;
  liveContextMinutes: number;
  detailedContextMinutes: number;
  chunkSeconds: number;
  reasoningEffortLive: "low" | "medium" | "high";
  reasoningEffortChat: "low" | "medium" | "high";
};

export type SessionState = {
  apiKey: string;
  isRecording: boolean;
  transcript: TranscriptLine[];
  suggestionBatches: SuggestionBatch[];
  chat: ChatMessage[];
  settings: Settings;
  isSettingsOpen: boolean;
};
