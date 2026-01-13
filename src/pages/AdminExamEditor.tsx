import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function AdminExamEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'full',
    description: '',
    duration: 180,
  });
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/admin/exams`).then((res) => {
        const exam = res.data.find((e: any) => e.id === id);
        if (exam) {
          setForm({
            title: exam.title,
            type: exam.type,
            description: exam.content?.description || '',
            duration: exam.content?.duration || 180,
          });
          setContent(exam.content || {});
        }
      });
    }
  }, [id, isEdit]);

  const addListeningSection = () => {
    const sections = content.listening?.sections || [];
    setContent({
      ...content,
      listening: {
        ...content.listening,
        sections: [
          ...sections,
          {
            sectionNumber: sections.length + 1,
            audioUrl: '',
            transcript: '',
            questions: [],
          },
        ],
      },
    });
  };

  const addReadingPassage = () => {
    const passages = content.reading?.passages || [];
    setContent({
      ...content,
      reading: {
        ...content.reading,
        passages: [
          ...passages,
          {
            passageNumber: passages.length + 1,
            title: '',
            content: '',
            questions: [],
          },
        ],
      },
    });
  };

  const addWritingTask = () => {
    const tasks = content.writing?.tasks || [];
    setContent({
      ...content,
      writing: {
        ...content.writing,
        tasks: [
          ...tasks,
          {
            taskNumber: tasks.length + 1,
            type: tasks.length === 0 ? 'task1' : 'task2',
            title: '',
            description: '',
            wordCount: tasks.length === 0 ? 150 : 250,
          },
        ],
      },
    });
  };

  const addSpeakingPart = () => {
    const parts = content.speaking?.parts || [];
    setContent({
      ...content,
      speaking: {
        ...content.speaking,
        parts: [
          ...parts,
          {
            partNumber: parts.length + 1,
            title: '',
            description: '',
            questions: [],
          },
        ],
      },
    });
  };

  const submit = async () => {
    if (!form.title) {
      alert('Sarlavha kiriting');
      return;
    }

    setLoading(true);
    try {
      const examData = {
        title: form.title,
        type: form.type,
        content: {
          description: form.description,
          duration: parseInt(form.duration.toString()),
          ...content,
        },
      };

      if (isEdit && id) {
        await api.put(`/admin/exams/${id}`, examData);
      } else {
        await api.post('/admin/exams', examData);
      }
      navigate('/admin');
    } catch (err: any) {
      alert('Xatolik: ' + (err.response?.data?.message || 'Noma\'lum xatolik'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="section-title">
        {isEdit ? '✏️ Imtihonni tahrirlash' : '➕ Yangi imtihon yaratish'}
      </div>

      <div className="grid" style={{ marginBottom: 24 }}>
        <input
          className="input"
          placeholder="Imtihon nomi *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="full">Full Test</option>
          <option value="listening">Listening</option>
          <option value="reading">Reading</option>
          <option value="writing">Writing</option>
          <option value="speaking">Speaking</option>
        </select>
        <textarea
          className="input"
          placeholder="Tavsif"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ minHeight: 80 }}
        />
        <input
          className="input"
          type="number"
          placeholder="Davomiyligi (daqiqa)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
        />
      </div>

      {/* Listening Section Builder */}
      {(form.type === 'full' || form.type === 'listening') && (
        <div style={{ marginBottom: 24, padding: 20, background: '#f8fafc', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>🎧 Listening</h3>
            <button className="btn secondary" onClick={addListeningSection} style={{ fontSize: 14 }}>
              + Section qo'shish
            </button>
          </div>
          {content.listening?.sections?.map((section: any, sIdx: number) => (
            <div key={sIdx} style={{ marginBottom: 20, padding: 16, background: 'white', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Section {section.sectionNumber}</div>
              <div style={{ marginBottom: 8 }}>
                <input
                  className="input"
                  placeholder="Audio URL yoki fayl yuklash"
                  value={section.audioUrl || ''}
                  onChange={(e) => {
                    const sections = [...content.listening.sections];
                    sections[sIdx].audioUrl = e.target.value;
                    setContent({ ...content, listening: { ...content.listening, sections } });
                  }}
                  style={{ marginBottom: 8 }}
                />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const res = await api.post('/admin/upload/audio', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const sections = [...content.listening.sections];
                        sections[sIdx].audioUrl = `http://localhost:4000${res.data.url}`;
                        setContent({ ...content, listening: { ...content.listening, sections } });
                      } catch (err: any) {
                        alert('Audio yuklashda xatolik: ' + (err.response?.data?.message || 'Noma\'lum xatolik'));
                      }
                    }
                  }}
                  style={{ fontSize: 13 }}
                />
                {section.audioUrl && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                    ✅ Audio: {section.audioUrl}
                  </div>
                )}
              </div>
              <textarea
                className="input"
                placeholder="Transcript"
                value={section.transcript || ''}
                onChange={(e) => {
                  const sections = [...content.listening.sections];
                  sections[sIdx].transcript = e.target.value;
                  setContent({ ...content, listening: { ...content.listening, sections } });
                }}
                style={{ minHeight: 80, marginBottom: 8 }}
              />
              <div className="muted" style={{ fontSize: 13 }}>
                Savollar: {section.questions?.length || 0} ta
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reading Section Builder */}
      {(form.type === 'full' || form.type === 'reading') && (
        <div style={{ marginBottom: 24, padding: 20, background: '#f8fafc', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>📖 Reading</h3>
            <button className="btn secondary" onClick={addReadingPassage} style={{ fontSize: 14 }}>
              + Passage qo'shish
            </button>
          </div>
          {content.reading?.passages?.map((passage: any, pIdx: number) => (
            <div key={pIdx} style={{ marginBottom: 20, padding: 16, background: 'white', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Passage {passage.passageNumber}</div>
              <input
                className="input"
                placeholder="Sarlavha"
                value={passage.title || ''}
                onChange={(e) => {
                  const passages = [...content.reading.passages];
                  passages[pIdx].title = e.target.value;
                  setContent({ ...content, reading: { ...content.reading, passages } });
                }}
                style={{ marginBottom: 8 }}
              />
              <textarea
                className="input"
                placeholder="Matn"
                value={passage.content || ''}
                onChange={(e) => {
                  const passages = [...content.reading.passages];
                  passages[pIdx].content = e.target.value;
                  setContent({ ...content, reading: { ...content.reading, passages } });
                }}
                style={{ minHeight: 120, marginBottom: 8 }}
              />
              <div className="muted" style={{ fontSize: 13 }}>
                Savollar: {passage.questions?.length || 0} ta
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Writing Section Builder */}
      {(form.type === 'full' || form.type === 'writing') && (
        <div style={{ marginBottom: 24, padding: 20, background: '#f8fafc', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>✍️ Writing</h3>
            <button className="btn secondary" onClick={addWritingTask} style={{ fontSize: 14 }}>
              + Task qo'shish
            </button>
          </div>
          {content.writing?.tasks?.map((task: any, tIdx: number) => (
            <div key={tIdx} style={{ marginBottom: 20, padding: 16, background: 'white', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Task {task.taskNumber}</div>
              <input
                className="input"
                placeholder="Sarlavha"
                value={task.title || ''}
                onChange={(e) => {
                  const tasks = [...content.writing.tasks];
                  tasks[tIdx].title = e.target.value;
                  setContent({ ...content, writing: { ...content.writing, tasks } });
                }}
                style={{ marginBottom: 8 }}
              />
              <textarea
                className="input"
                placeholder="Tavsif"
                value={task.description || ''}
                onChange={(e) => {
                  const tasks = [...content.writing.tasks];
                  tasks[tIdx].description = e.target.value;
                  setContent({ ...content, writing: { ...content.writing, tasks } });
                }}
                style={{ minHeight: 100, marginBottom: 8 }}
              />
              <input
                className="input"
                type="number"
                placeholder="So'zlar soni"
                value={task.wordCount || ''}
                onChange={(e) => {
                  const tasks = [...content.writing.tasks];
                  tasks[tIdx].wordCount = parseInt(e.target.value) || 0;
                  setContent({ ...content, writing: { ...content.writing, tasks } });
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Speaking Section Builder */}
      {(form.type === 'full' || form.type === 'speaking') && (
        <div style={{ marginBottom: 24, padding: 20, background: '#f8fafc', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>🗣️ Speaking</h3>
            <button className="btn secondary" onClick={addSpeakingPart} style={{ fontSize: 14 }}>
              + Part qo'shish
            </button>
          </div>
          {content.speaking?.parts?.map((part: any, pIdx: number) => (
            <div key={pIdx} style={{ marginBottom: 20, padding: 16, background: 'white', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Part {part.partNumber}</div>
              <input
                className="input"
                placeholder="Sarlavha"
                value={part.title || ''}
                onChange={(e) => {
                  const parts = [...content.speaking.parts];
                  parts[pIdx].title = e.target.value;
                  setContent({ ...content, speaking: { ...content.speaking, parts } });
                }}
                style={{ marginBottom: 8 }}
              />
              <textarea
                className="input"
                placeholder="Tavsif"
                value={part.description || ''}
                onChange={(e) => {
                  const parts = [...content.speaking.parts];
                  parts[pIdx].description = e.target.value;
                  setContent({ ...content, speaking: { ...content.speaking, parts } });
                }}
                style={{ minHeight: 80, marginBottom: 8 }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <button 
          onClick={() => navigate('/admin')} 
          disabled={loading}
          style={{
            background: 'transparent',
            color: '#475569',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: 14,
            transition: 'all 0.2s ease',
            opacity: loading ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#94a3b8';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }
          }}
        >
          Bekor qilish
        </button>
        <button className="btn" onClick={submit} disabled={loading}>
          {loading ? 'Saqlanmoqda...' : isEdit ? 'Saqlash' : 'Yaratish'}
        </button>
      </div>
    </div>
  );
}


