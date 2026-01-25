import { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  maxDuration?: number; // seconds
}

export default function AudioRecorder({ onRecordingComplete, maxDuration = 120 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to use the best available mime type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }
      
      const options: MediaRecorderOptions = { mimeType };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          const blobType = mimeType.split(';')[0] || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          onRecordingComplete(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error('Error creating audio blob:', err);
          alert('Error processing audio recording. Please try again.');
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Error during recording. Please try again.');
        stopRecording();
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setDuration(0);

      // Duration timer
      durationTimerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Microphone permission required. Please grant microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else {
        alert('Error accessing microphone: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (durationTimerRef.current) {
          clearInterval(durationTimerRef.current);
          durationTimerRef.current = null;
        }
      } catch (err) {
        console.error('Error stopping recording:', err);
        setIsRecording(false);
        if (durationTimerRef.current) {
          clearInterval(durationTimerRef.current);
          durationTimerRef.current = null;
        }
      }
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setDuration(0);
    audioChunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: 20, background: '#f8fafc', borderRadius: 12, border: '2px solid #e2e8f0' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>🎤 Audio Recording</div>
        <div className="muted" style={{ fontSize: 13 }}>
          Click the microphone and speak. Maximum time: {formatTime(maxDuration)}
        </div>
      </div>

      {!audioUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          {!isRecording ? (
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startRecording();
              }}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: 16,
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              }}
            >
              🎤 Start Recording
            </button>
          ) : (
            <>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: '#fee2e2',
                border: '4px solid #ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                animation: 'pulse 1.5s ease infinite'
              }}>
                🎤
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>
                {formatTime(duration)}
              </div>
              <button
                type="button"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  stopRecording();
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 16,
                  background: '#dc2626',
                }}
              >
                ⏹️ Stop
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <audio controls style={{ width: '100%' }} src={audioUrl} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                resetRecording();
              }}
              style={{ flex: 1 }}
            >
              🔄 Record Again
            </button>
            <div className="muted" style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 13
            }}>
              ✅ Recorded
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}




