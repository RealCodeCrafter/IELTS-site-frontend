import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function AdminCreateExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    type: 'full',
    description: '',
    duration: 180,
  });
  const [content, setContent] = useState<any>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/exams', {
        title: form.title,
        type: form.type,
        content: {
          description: form.description,
          duration: parseInt(form.duration.toString()),
          ...content,
        },
      });
      navigate('/admin');
    } catch (err) {
      alert('Xatolik yuz berdi');
    }
  };

  return (
    <div className="card">
      <div className="section-title">Yangi imtihon yaratish</div>
      <form onSubmit={submit} className="grid">
        <input
          className="input"
          placeholder="Imtihon nomi"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
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
        />
        <input
          className="input"
          type="number"
          placeholder="Davomiyligi (daqiqa)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
        />
        <div className="muted" style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
          <strong>Eslatma:</strong> Imtihon tarkibini (savollar, audio, matnlar) JSON formatida qo'lda yaratish yoki keyinroq
          yangilash mumkin. Admin panel orqali imtihonni tahrirlash imkoniyati qo'shiladi.
        </div>
        <button className="btn" type="submit">
          Yaratish
        </button>
      </form>
    </div>
  );
}




