# TwinMind Live Suggestions - SPEC

This spec outlines the architecture and context for TwinMind, a three-column React application designed to evaluate transcripts and render live AI suggestions.

## 1. Core Objectives
- Establish a workspace to capture audio and stream chunks.
- Render transcripts dynamically as they are processed.
- Provide live, structured AI suggestions based on recent audio context.
- Support interactive follow-ups and chat querying.

## 2. Technical Stack
- **Frontend Framework**: Vite + React + TypeScript 
- **Styling**: Tailwind CSS integration
- **Icons**: Lucide React
- **State Management**: React Context API (`useReducer` managed `SessionState`)
- **APIs**:
  - Browser native `MediaRecorder` API for mic capture.
  - Groq API used for ultra-fast Whisper transcription and Llama-3 completions.

## 3. Architecture & Layout
The layout uses a Flexbox 3-column system spanning 100vh horizontally:
1. **Transcript Column (Left)**: Active microphone controls and scrolling transcribed lines with timestamps.
2. **Suggestions Column (Middle)**: Display batches of real-time AI suggestions across 5 primary categories (answer, fact-check, question, talking-point, clarification). Includes reloading interface.
3. **Chat Column (Right)**: Chat interface for conversational dive-ins on specific topics surfaced during the meeting.

## 4. State Objects
### Settings (Persistent localStorage)
- `groqApiKey`
- `liveSuggestionsPrompt`
- `detailedAnswerPrompt`
- `chatPrompt`
- `liveContextMinutes`
- `chunkSeconds`
- `reasoningEffortLive` / `reasoningEffortChat`

### Global App State
- `isRecording`, `apiKey`, `transcript` array, `suggestionBatches` array, `chat` history.

*(Note: Master context from Section 4 of the original playbook resides here.)*
