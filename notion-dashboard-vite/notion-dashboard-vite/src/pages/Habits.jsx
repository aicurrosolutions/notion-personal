import React, { useState } from 'react';
import { Activity, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const EMOJIS = ['🏃', '📚', '💧', '📵', '🧘', '🏋️', '🥗', '😴', '✍️', '🎯', '🚴', '🧹', '💊', '🎸', '🌿'];
const COLORS = [
  { label: 'Verde', value: '#0f7b55' },
  { label: 'Azul', value: '#2383e2' },
  { label: 'Morado', value: '#6940a5' },
  { label: 'Naranja', value: '#d9730d' },
  { label: 'Rosa', value: '#c14f8a' },
  { label: 'Rojo', value: '#e03e3e' },
  { label: 'Teal', value: '#0b7285' },
  { label: 'Amarillo', value: '#dfab01' },
];

export default function Habits() {
  const { habits, toggleHabit, addHabit, deleteHabit } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', emoji: '🏃', color: '#0f7b55' });

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todayDay = today.getDate();
  const monthName = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const getStreak = (completedDays) => {
    let streak = 0;
    for (let d = todayDay; d >= 1; d--) {
      if (completedDays.includes(d)) streak++;
      else break;
    }
    return streak;
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addHabit(form);
    setForm({ name: '', emoji: '🏃', color: '#0f7b55' });
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-cover" style={{ background: 'linear-gradient(135deg, #e6f5ef 0%, #fef0e6 100%)' }} />
      <div className="page-icon-wrapper"><div className="page-icon">📊</div></div>
      <div className="page-header">
        <h1 className="page-title">Hábitos</h1>
        <p className="page-description">Seguimiento diario de tus hábitos — {monthName}.</p>
      </div>
      <div className="page-content">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-label">Hábitos activos</div>
            <div className="stat-value">{habits.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Mejor racha</div>
            <div className="stat-value">{habits.length > 0 ? Math.max(...habits.map(h => getStreak(h.completedDays))) : 0} días</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completados hoy</div>
            <div className="stat-value">{habits.filter(h => h.completedDays.includes(todayDay)).length}/{habits.length}</div>
          </div>
        </div>

        <div className="notion-table-wrapper">
          <div className="notion-table-header">
            <div className="notion-table-title"><Activity size={16} /> Tracker mensual</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Haz clic en cada día para marcar</span>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Nuevo hábito</button>
            </div>
          </div>

          {habits.length === 0 && (
            <div className="empty-state">
              <Activity size={40} />
              <p>No tienes hábitos todavía</p>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowModal(true)}><Plus size={14} /> Crear primer hábito</button>
            </div>
          )}

          {habits.length > 0 && (
            <>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
                <div style={{ width: 170, flexShrink: 0 }} />
                {days.map(d => (
                  <div key={d} style={{ width: 26, flexShrink: 0, textAlign: 'center', fontSize: 10, fontFamily: 'var(--font-mono)', color: d === todayDay ? 'var(--accent)' : 'var(--text-tertiary)', fontWeight: d === todayDay ? 700 : 400 }}>{d}</div>
                ))}
                <div style={{ width: 80, flexShrink: 0 }} />
              </div>

              {habits.map(habit => {
                const streak = getStreak(habit.completedDays);
                const total = habit.completedDays.filter(d => d <= daysInMonth).length;
                const rate = Math.round((total / todayDay) * 100);
                return (
                  <div key={habit.id} style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
                    <div style={{ width: 170, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{habit.emoji}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{habit.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{rate}% este mes</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 0 }}>
                      {days.map(d => {
                        const done = habit.completedDays.includes(d);
                        const isFuture = d > todayDay;
                        return (
                          <div key={d} onClick={() => !isFuture && toggleHabit(habit.id, d)} style={{ width: 26, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isFuture ? 'default' : 'pointer', borderRadius: 4, background: done ? habit.color : isFuture ? 'transparent' : 'var(--bg-secondary)', border: done ? 'none' : isFuture ? 'none' : '1px solid var(--border)', transition: 'all 0.1s', flexShrink: 0 }}>
                            {done && <span style={{ fontSize: 10, color: 'white' }}>✓</span>}
                            {!done && !isFuture && <span style={{ fontSize: 8, color: 'var(--text-placeholder)' }}>·</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ width: 80, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      <span style={{ fontSize: 12, color: streak > 0 ? habit.color : 'var(--text-tertiary)', fontWeight: streak > 0 ? 600 : 400, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>🔥 {streak}</span>
                      <button className="btn btn-ghost" style={{ padding: 4, color: 'var(--text-tertiary)' }} onClick={() => deleteHabit(habit.id)} title="Eliminar hábito"><Trash2 size={13} /></button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(true)}><Plus size={14} /> Añadir hábito</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo hábito</div>
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input className="form-input" placeholder="Ej: Ir al gimnasio, Leer 30 min..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Emoji</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EMOJIS.map(em => (
                  <button key={em} onClick={() => setForm({ ...form, emoji: em })} style={{ width: 36, height: 36, fontSize: 20, border: form.emoji === em ? '2px solid var(--text-primary)' : '1.5px solid var(--border)', borderRadius: 'var(--radius)', background: form.emoji === em ? 'var(--bg-active)' : 'var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c.value} onClick={() => setForm({ ...form, color: c.value })} title={c.label} style={{ width: 28, height: 28, borderRadius: '50%', background: c.value, border: form.color === c.value ? '3px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', outline: form.color === c.value ? '2px solid var(--bg)' : 'none', outlineOffset: '-4px' }} />
                ))}
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{form.emoji}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{form.name || 'Nombre del hábito'}</span>
              <div style={{ marginLeft: 'auto', width: 14, height: 14, borderRadius: '50%', background: form.color }} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Crear hábito</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
