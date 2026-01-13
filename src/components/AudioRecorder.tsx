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
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
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
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Mikrofon ruxsati kerak. Iltimos, brauzer sozlamalaridan mikrofon ruxsatini bering.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
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
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>🎤 Audio yozib olish</div>
        <div className="muted" style={{ fontSize: 13 }}>
          Mikrofonni bosing va gapiring. Maksimal vaqt: {formatTime(maxDuration)}
        </div>
      </div>

      {!audioUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          {!isRecording ? (
            <button
              className="btn"
              onClick={startRecording}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: 16,
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              }}
            >
              🎤 Yozib olishni boshlash
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
                className="btn"
                onClick={stopRecording}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 16,
                  background: '#dc2626',
                }}
              >
                ⏹️ To'xtatish
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <audio controls style={{ width: '100%' }} src={audioUrl} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn secondary" onClick={resetRecording} style={{ flex: 1 }}>
              🔄 Qayta yozish
            </button>
            <div className="muted" style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 13
            }}>
              ✅ Yozib olindi
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

