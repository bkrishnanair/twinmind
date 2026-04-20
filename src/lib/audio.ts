export function startChunkedRecording(stream: MediaStream, chunkSeconds: number, onChunk: (blob: Blob) => void) {
  let stopped = false;
  const CHUNK_MS = chunkSeconds * 1000;

  const recordOne = () => {
    if (stopped) return;
    const parts: Blob[] = [];
    const rec = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    rec.ondataavailable = e => e.data.size && parts.push(e.data);
    rec.onstop = () => {
      if (parts.length) onChunk(new Blob(parts, { type: 'audio/webm' }));
      recordOne(); // immediately start the next chunk
    };
    rec.start();
    setTimeout(() => rec.state === 'recording' && rec.stop(), CHUNK_MS);
  };

  recordOne();
  return () => { 
    stopped = true; 
    stream.getTracks().forEach(t => t.stop()); 
  };
}
