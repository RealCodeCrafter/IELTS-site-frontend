import { useEffect, useRef } from 'react';

interface ProgressChartProps {
  attempts: Array<{
    createdAt: string;
    score?: {
      overall: number;
      listening: number;
      reading: number;
      writing: number;
      speaking: number;
    };
  }>;
}

export default function ProgressChart({ attempts }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || attempts.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw Y-axis labels (0-9)
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (5 - i) * 1.8; // 0 to 9
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(value.toFixed(1), padding - 10, y + 4);
    }

    // Draw data points
    const sortedAttempts = [...attempts]
      .filter((a) => a.score?.overall)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (sortedAttempts.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Natijalar mavjud emas', width / 2, height / 2);
      return;
    }

    const maxValue = 9;
    const pointSpacing = chartWidth / Math.max(sortedAttempts.length - 1, 1);

    // Draw line
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    sortedAttempts.forEach((attempt, index) => {
      const x = padding + pointSpacing * index;
      const y = padding + chartHeight - (chartHeight * (attempt.score!.overall / maxValue));
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    sortedAttempts.forEach((attempt, index) => {
      const x = padding + pointSpacing * index;
      const y = padding + chartHeight - (chartHeight * (attempt.score!.overall / maxValue));

      // Point
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Value label
      ctx.fillStyle = '#0f172a';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(attempt.score!.overall.toFixed(1), x, y - 10);
    });

    // X-axis labels (dates)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    sortedAttempts.forEach((attempt, index) => {
      if (index % Math.ceil(sortedAttempts.length / 5) === 0 || index === sortedAttempts.length - 1) {
        const x = padding + pointSpacing * index;
        const date = new Date(attempt.createdAt);
        const label = `${date.getDate()}/${date.getMonth() + 1}`;
        ctx.fillText(label, x, height - padding + 20);
      }
    });
  }, [attempts]);

  if (attempts.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        Progress chart ko'rsatish uchun kamida bir nechta natija kerak
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
      <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>📈 Progress Chart</div>
      <canvas ref={canvasRef} width={600} height={300} style={{ maxWidth: '100%', height: 'auto' }} />
      <div style={{ marginTop: 12, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
        Overall score o'zgarishi
      </div>
    </div>
  );
}


