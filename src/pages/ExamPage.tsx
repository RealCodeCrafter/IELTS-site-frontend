import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import ExamTimer from '../components/ExamTimer';
import AudioRecorder from '../components/AudioRecorder';

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
}

interface Exam {
  id: string;
  title: string;
  type: string;
  content: any;
}

export default function ExamPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | Blob>>({});
  const [activeSection, setActiveSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  const [examStarted, setExamStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/exams/${id}`)
        .then((r) => {
          setExam(r.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Exam load error:', err);
          setLoading(false);
        });
    }
  }, [id]);

  // Prevent scroll jumping
  useEffect(() => {
    if (examStarted) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [examStarted, activeSection]);

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <div style={{ fontSize: '24px', marginBottom: 12 }}>⏳</div>
          <div>Loading exam...</div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px', color: '#e11d48' }}>
          <div style={{ fontSize: '24px', marginBottom: 12 }}>❌</div>
          <div>Exam not found</div>
        </div>
      </div>
    );
  }

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;
    
    if (window.confirm('Are you sure you want to submit the exam? You cannot change your answers after submission.')) {
      try {
        // Convert audio blobs to base64
        const processedAnswers: Record<string, string> = {};
        for (const [key, value] of Object.entries(answers)) {
          if (value instanceof Blob) {
            // Convert blob to base64
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(value);
            });
            processedAnswers[key] = base64;
          } else {
            processedAnswers[key] = value as string;
          }
        }
        
        await api.post(`/exams/${exam.id}/submit`, { userId: user.id, answers: processedAnswers });
        navigate('/dashboard');
      } catch (err: any) {
        alert('Error: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleTimeUp = () => {
    alert('Time is up! The exam will be submitted automatically.');
    submit();
  };

  const content = exam.content || {};
  const duration = content.duration || 180;

  // Start exam screen
  if (!examStarted) {
    return (
      <div className="card" style={{ maxWidth: 600, margin: '40px auto' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: 20 }}>📝</div>
          <div className="section-title" style={{ marginBottom: 12 }}>{exam.title}</div>
          <div className="muted" style={{ marginBottom: 24, fontSize: 15 }}>
            {content.description || 'Are you ready to start the IELTS exam?'}
          </div>
          
          <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Exam Information:</div>
            <div style={{ fontSize: 14, lineHeight: 2, color: '#475569' }}>
              <div>⏱️ Duration: {duration} minutes</div>
              {content.listening && <div>🎧 Listening section available</div>}
              {content.reading && <div>📖 Reading section available</div>}
              {content.writing && <div>✍️ Writing section available</div>}
              {content.speaking && <div>🗣️ Speaking section available</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/dashboard')} 
              style={{ 
                minWidth: 120,
                background: 'transparent',
                color: '#475569',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              Back
            </button>
            <button 
              className="btn" 
              onClick={() => setExamStarted(true)}
              style={{ minWidth: 200 }}
            >
              ✅ Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header with Timer - Sticky at top */}
      <div className="exam-sticky-header">
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, width: '100%' }}>
          <div>
            <div className="section-title" style={{ marginBottom: 4, fontSize: 20 }}>{exam.title}</div>
            <div className="muted" style={{ fontSize: 14 }}>
              {duration} minutes
            </div>
          </div>
          <ExamTimer duration={duration} onTimeUp={handleTimeUp} isStarted={examStarted} />
        </div>
        
        {/* Section Navigation */}
        <div style={{ maxWidth: 1200, margin: '16px auto 0', display: 'flex', gap: 8, flexWrap: 'wrap', width: '100%' }}>
          {content.listening && (
            <button
              className={activeSection === 'listening' ? 'btn' : 'btn ghost'}
              onClick={() => setActiveSection('listening')}
              style={{ fontSize: 14, color: activeSection === 'listening' ? 'white' : '#0f172a' }}
            >
              🎧 Listening
            </button>
          )}
          {content.reading && (
            <button
              className={activeSection === 'reading' ? 'btn' : 'btn ghost'}
              onClick={() => setActiveSection('reading')}
              style={{ fontSize: 14, color: activeSection === 'reading' ? 'white' : '#0f172a' }}
            >
              📖 Reading
            </button>
          )}
          {content.writing && (
            <button
              className={activeSection === 'writing' ? 'btn' : 'btn ghost'}
              onClick={() => setActiveSection('writing')}
              style={{ fontSize: 14, color: activeSection === 'writing' ? 'white' : '#0f172a' }}
            >
              ✍️ Writing
            </button>
          )}
          {content.speaking && (
            <button
              className={activeSection === 'speaking' ? 'btn' : 'btn ghost'}
              onClick={() => setActiveSection('speaking')}
              style={{ fontSize: 14, color: activeSection === 'speaking' ? 'white' : '#0f172a' }}
            >
              🗣️ Speaking
            </button>
          )}
        </div>
      </div>

      <div className="exam-content-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
      <form onSubmit={submit} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
        {/* Listening Section */}
        {activeSection === 'listening' && content.listening && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: '32px' }}>🎧</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>Listening</h2>
                <div className="muted" style={{ fontSize: 14 }}>
                  Listen to the audio and answer the questions
                </div>
              </div>
            </div>

            {content.listening.sections && Array.isArray(content.listening.sections) && content.listening.sections.map((section: any, sIdx: number) => (
              <div key={sIdx} style={{ marginBottom: 40 }}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', 
                  color: 'white', 
                  borderRadius: '8px',
                  marginBottom: 20,
                  fontWeight: 700
                }}>
                  Section {section.sectionNumber || sIdx + 1}
                </div>

                {section.audioUrl && (
                  <div style={{ marginBottom: 24, padding: 20, background: '#f8fafc', borderRadius: 12, border: '2px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>🎧 Listen to Audio</div>
                    <audio controls style={{ width: '100%', marginBottom: 12 }} preload="auto">
                      <source src={section.audioUrl.startsWith('http') ? section.audioUrl : `http://localhost:4000${section.audioUrl}`} type="audio/mpeg" />
                      <source src={section.audioUrl.startsWith('http') ? section.audioUrl : `http://localhost:4000${section.audioUrl}`} type="audio/wav" />
                      <source src={section.audioUrl.startsWith('http') ? section.audioUrl : `http://localhost:4000${section.audioUrl}`} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                    {section.transcript && (
                      <details style={{ marginTop: 12 }}>
                        <summary style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 600, fontSize: 14 }}>
                          📄 View Transcript
                        </summary>
                        <div style={{ marginTop: 12, padding: 16, background: 'white', borderRadius: 8, fontSize: 14, lineHeight: 1.8 }}>
                          {section.transcript}
                        </div>
                      </details>
                    )}
                  </div>
                )}

                {section.questions && Array.isArray(section.questions) && section.questions.map((q: Question, qIdx: number) => {
                  const answerValue = answers[`listening_${q.id}`];
                  const isAnswered = answerValue && (typeof answerValue === 'string' ? answerValue.trim() : true);
                  
                  return (
                    <div 
                      key={q.id} 
                      style={{ 
                        marginBottom: 24, 
                        padding: 20, 
                        background: isAnswered ? '#f0fdf4' : '#f8fafc', 
                        borderRadius: 12,
                        border: `2px solid ${isAnswered ? '#10b981' : '#e2e8f0'}`
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16, color: '#0f172a' }}>
                        {qIdx + 1}. {q.question}
                      </div>
                      {q.type === 'multiple-choice' && q.options ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {q.options.map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 12,
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                              <input
                                type="radio"
                                name={`listening_${q.id}`}
                                value={opt}
                                checked={answers[`listening_${q.id}`] === opt && typeof answers[`listening_${q.id}`] === 'string'}
                                onChange={(e) => setAnswers({ ...answers, [`listening_${q.id}`]: e.target.value })}
                                style={{ width: 18, height: 18, cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: 15 }}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          className="input"
                          placeholder="Enter your answer"
                          value={typeof answers[`listening_${q.id}`] === 'string' ? answers[`listening_${q.id}`] : ''}
                          onChange={(e) => setAnswers({ ...answers, [`listening_${q.id}`]: e.target.value })}
                          style={{ fontSize: 15 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Reading Section */}
        {activeSection === 'reading' && content.reading && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: '32px' }}>📖</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>Reading</h2>
                <div className="muted" style={{ fontSize: 14 }}>
                  Read the passages and answer the questions
                </div>
              </div>
            </div>

            {content.reading.passages && Array.isArray(content.reading.passages) && content.reading.passages.map((passage: any, pIdx: number) => (
              <div key={pIdx} style={{ marginBottom: 40 }}>
                <h3 style={{ fontSize: '20px', marginBottom: 16, color: '#0f172a' }}>{passage.title || `Passage ${pIdx + 1}`}</h3>
                <div 
                  style={{ 
                    background: '#f8fafc', 
                    padding: 24, 
                    borderRadius: 12, 
                    marginBottom: 24, 
                    lineHeight: 2,
                    fontSize: 15,
                    color: '#334155',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {passage.content}
                </div>
                {passage.questions && Array.isArray(passage.questions) && passage.questions.map((q: Question, qIdx: number) => {
                  const answerValue = answers[`reading_${q.id}`];
                  const isAnswered = answerValue && (typeof answerValue === 'string' ? answerValue.trim() : true);
                  
                  return (
                    <div 
                      key={q.id} 
                      style={{ 
                        marginBottom: 24, 
                        padding: 20, 
                        background: isAnswered ? '#f0fdf4' : '#f8fafc', 
                        borderRadius: 12,
                        border: `2px solid ${isAnswered ? '#10b981' : '#e2e8f0'}`
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16, color: '#0f172a' }}>
                        {qIdx + 1}. {q.question}
                      </div>
                      {q.type === 'multiple-choice' && q.options ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {q.options.map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 12,
                                padding: '12px',
                                background: 'white',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                              <input
                                type="radio"
                                name={`reading_${q.id}`}
                                value={opt}
                                checked={answers[`reading_${q.id}`] === opt && typeof answers[`reading_${q.id}`] === 'string'}
                                onChange={(e) => setAnswers({ ...answers, [`reading_${q.id}`]: e.target.value })}
                                style={{ width: 18, height: 18, cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: 15 }}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          className="input"
                          placeholder="Enter your answer"
                          value={typeof answers[`reading_${q.id}`] === 'string' ? answers[`reading_${q.id}`] : ''}
                          onChange={(e) => setAnswers({ ...answers, [`reading_${q.id}`]: e.target.value })}
                          style={{ fontSize: 15 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Writing Section */}
        {activeSection === 'writing' && content.writing && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: '32px' }}>✍️</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>Writing</h2>
                <div className="muted" style={{ fontSize: 14 }}>
                  Complete the tasks and write essays
                </div>
              </div>
            </div>

            {content.writing.tasks && Array.isArray(content.writing.tasks) && content.writing.tasks.map((task: any, tIdx: number) => (
              <div key={tIdx} style={{ marginBottom: 40 }}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', 
                  color: 'white', 
                  borderRadius: '8px',
                  marginBottom: 20,
                  fontWeight: 700
                }}>
                  Task {task.taskNumber || tIdx + 1}
                </div>
                <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>{task.title || `Task ${task.taskNumber || tIdx + 1}`}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.8, color: '#334155' }}>{task.description}</div>
                  {task.imageUrl && (
                    <img 
                      src={task.imageUrl} 
                      alt="Task" 
                      style={{ maxWidth: '100%', marginTop: 16, borderRadius: 8, border: '1px solid #e2e8f0' }} 
                    />
                  )}
                  {task.wordCount && (
                    <div style={{ marginTop: 12, fontSize: 14, color: '#64748b' }}>
                      ⚠️ Minimum {task.wordCount} so'z yozing
                    </div>
                  )}
                </div>
                <textarea
                  className="input"
                  style={{ minHeight: 300, fontSize: 15, lineHeight: 1.8 }}
                  placeholder={`Task ${task.taskNumber || tIdx + 1} javobingizni yozing${task.wordCount ? ` (minimum ${task.wordCount} so'z)` : ''}`}
                  value={typeof answers[`writing_task${task.taskNumber || tIdx + 1}`] === 'string' ? answers[`writing_task${task.taskNumber || tIdx + 1}`] : ''}
                  onChange={(e) => setAnswers({ ...answers, [`writing_task${task.taskNumber || tIdx + 1}`]: e.target.value })}
                />
                {answers[`writing_task${task.taskNumber || tIdx + 1}`] && typeof answers[`writing_task${task.taskNumber || tIdx + 1}`] === 'string' && task.wordCount && (
                  <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
                    Word count: {answers[`writing_task${task.taskNumber || tIdx + 1}`].split(/\s+/).filter((w) => w.length > 0).length} / {task.wordCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Speaking Section */}
        {activeSection === 'speaking' && content.speaking && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: '32px' }}>🗣️</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>Speaking</h2>
                <div className="muted" style={{ fontSize: 14 }}>
                  Answer the questions and write a transcript
                </div>
              </div>
            </div>

            {content.speaking.parts && Array.isArray(content.speaking.parts) && content.speaking.parts.map((part: any, pIdx: number) => (
              <div key={pIdx} style={{ marginBottom: 40 }}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', 
                  color: 'white', 
                  borderRadius: '8px',
                  marginBottom: 20,
                  fontWeight: 700
                }}>
                  Part {part.partNumber || pIdx + 1}: {part.title || `Part ${part.partNumber || pIdx + 1}`}
                </div>
                <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, marginBottom: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 15, lineHeight: 1.8, color: '#334155', marginBottom: 12 }}>{part.description}</div>
                  {part.questions && Array.isArray(part.questions) && (
                    <ul style={{ marginTop: 12, paddingLeft: 24, fontSize: 15 }}>
                      {part.questions.map((q: string, qIdx: number) => (
                        <li key={qIdx} style={{ marginBottom: 8, color: '#334155' }}>{q}</li>
                      ))}
                    </ul>
                  )}
                  {part.topic && (
                    <div style={{ marginTop: 16, padding: 16, background: 'white', borderRadius: 8 }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>📌 Topic:</div>
                      <div style={{ fontSize: 16, color: '#2563eb' }}>{part.topic}</div>
                      {part.timeLimit && (
                        <div style={{ marginTop: 8, fontSize: 14, color: '#64748b' }}>
                          ⏱️ Time: {part.timeLimit} minutes
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <AudioRecorder
                    onRecordingComplete={(audioBlob) => {
                      setAnswers({ ...answers, [`speaking_part${part.partNumber || pIdx + 1}_audio`]: audioBlob });
                    }}
                    maxDuration={part.timeLimit ? part.timeLimit * 60 : 120}
                  />
                </div>
                <textarea
                  className="input"
                  style={{ minHeight: 200, fontSize: 15, lineHeight: 1.8, marginTop: 16 }}
                  placeholder={`Enter your answer for Part ${part.partNumber || pIdx + 1} (transcript - optional)`}
                  value={typeof answers[`speaking_part${part.partNumber || pIdx + 1}`] === 'string' ? answers[`speaking_part${part.partNumber || pIdx + 1}`] : ''}
                  onChange={(e) => setAnswers({ ...answers, [`speaking_part${part.partNumber || pIdx + 1}`]: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

      </form>
      </div>

      {/* Submit Button - Sticky at bottom */}
      <div className="exam-sticky-footer">
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, width: '100%' }}>
          <div style={{ fontSize: 14, color: '#64748b' }}>
            Answers submitted: {Object.values(answers).filter(a => {
              if (!a) return false;
              if (typeof a === 'string') return a.trim().length > 0;
              if (a instanceof Blob) return true;
              return true;
            }).length}
          </div>
          <button className="btn" type="button" onClick={submit} style={{ minWidth: '200px', fontSize: 16 }}>
            ✅ Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
