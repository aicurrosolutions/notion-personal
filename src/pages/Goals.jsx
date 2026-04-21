import React, { useState } from 'react';
import { Target, Plus, Trash2, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const CATS = ['Trabajo', 'Finanzas', 'Salud', 'Aprendizaje', 'Personal', 'Otro'];

function catColor(c) {
  const m = { Trabajo: 'var(--accent)', Finanzas: 'var(--green)', Salud: 'var(--orange)', Aprendizaje: 'var(--purple)', Personal: 'var(--pink)', Otro: 'var(--text-tertiary)' };
  return m[c] || 'var(--text-tertiary)';
}
function catBadge(c) {
  const m = { Trabajo: 'badge-blue', Finanzas: 'badge-green', Salud: 'badge-orange', Aprendizaje: 'badge-purple', Personal: 'badge-pink', Otro: 'badge-gray' };
  return <span className={`badge ${m[c] || 'badge-gray'}`}>{c}</span>;
}

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null); // goal being edited
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', target: '', current: '', unit: '', category: 'Trabajo', dueDate: '' });

  const filtered = goals.filter(g => {
    if (filter === 'active') return g.progress < 100;
    if (filter === 'done') return g.progress >= 100;
    return true;
  });

  const handleAdd = () => {
    if (!form.title.trim() || !form.target) return;
    const target = Number(form.target);
    const current = Number(form.current) || 0;
    addGoal({ ...form, target, current, progress: Math.min(100, Math.round((current / target) * 100)) });
    setForm({ title: '', target: '', current: '', unit: '', category: 'Trabajo', dueDate: '' });
    setShowModal(false);
  };

  // Edit modal state
  const openEdit = (g) => {
    setEditGoal({ ...g, newCurrent: g.current });
  };

  const handleSaveEdit = () => {
    if (!editGoal) return;
    const current = Number(editGoal.newCurrent) || 0;
    const progress = Math.min(100, Math.round((current / editGoal.target) * 100));
    updateGoal(editGoal.id, { current, progress });
    setEditGoal(null);
  };

  return (
    <div>
      <div className="page-cover" style={{ background: 'linear-gradient(135deg, #f0ebfa 0%, #fce8f3 100%)' }} />
      <div className="page-icon-wrapper"><div className="page-icon">🎯</div></div>
      <div className="page-header">
        <h1 className="page-title">Objetivos</h1>
        <p className="page-description">Define y sigue el progreso de tus metas a largo plazo.</p>
      </div>
      <div className="page-content">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value">{goals.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">En progreso</div>
            <div className="stat-value">{goals.filter(g => g.progress < 100 && g.progress > 0).length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completados</div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{goals.filter(g => g.progress >= 100).length}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'active', 'done'].map(f => (
              <button key={f} className={`select-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'Todos' : f === 'active' ? 'En progreso' : 'Completados'}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Nuevo objetivo</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(g => (
            <div key={g.id} className="notion-table-wrapper">
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{g.title}</span>
                      {catBadge(g.category)}
                      {g.progress >= 100 && <span className="badge badge-green">✓ Completado</span>}
                    </div>
                    {g.dueDate && <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Fecha límite: {g.dueDate}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost" style={{ color: 'var(--text-secondary)', padding: '5px 8px', fontSize: 13 }} onClick={() => openEdit(g)} title="Editar progreso">
                      <Pencil size={14} /> Editar
                    </button>
                    <button className="btn btn-ghost" style={{ color: 'var(--text-tertiary)', padding: 5 }} onClick={() => deleteGoal(g.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {g.current} / {g.target} {g.unit}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: catColor(g.category), fontFamily: 'var(--font-mono)' }}>{g.progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8, borderRadius: 4 }}>
                      <div className="progress-fill" style={{
                        width: `${g.progress}%`,
                        background: g.progress >= 100 ? 'var(--green)' : catColor(g.category),
                        borderRadius: 4
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state"><Target size={40} /><p>No hay objetivos</p></div>}
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(true)}><Plus size={14} /> Añadir objetivo</button>
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo objetivo</div>
            <div className="form-group">
              <label className="form-label">Objetivo *</label>
              <input className="form-input" placeholder="¿Qué quieres conseguir?" value={form.title} onChange={e => setForm({...form, title: e.target.value})} autoFocus />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Meta *</label>
                <input type="number" className="form-input" placeholder="100" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Progreso actual</label>
                <input type="number" className="form-input" placeholder="0" value={form.current} onChange={e => setForm({...form, current: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Unidad</label>
                <input className="form-input" placeholder="€, horas, km..." value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha límite</label>
                <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <div className="select-group">
                {CATS.map(c => (
                  <button key={c} className={`select-pill ${form.category === c ? 'active' : ''}`} onClick={() => setForm({...form, category: c})}>{c}</button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Crear objetivo</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editGoal && (
        <div className="modal-overlay" onClick={() => setEditGoal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Actualizar progreso</div>

            <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{editGoal.title}</span>
                {catBadge(editGoal.category)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Meta: {editGoal.target} {editGoal.unit}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Progreso actual ({editGoal.unit || 'unidades'})</label>
              <input
                type="number"
                className="form-input"
                style={{ fontSize: 18, fontWeight: 600, textAlign: 'center' }}
                value={editGoal.newCurrent}
                min={0}
                max={editGoal.target}
                onChange={e => setEditGoal({ ...editGoal, newCurrent: e.target.value })}
                autoFocus
              />
            </div>

            {/* Live preview */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{editGoal.newCurrent || 0} / {editGoal.target} {editGoal.unit}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: catColor(editGoal.category), fontFamily: 'var(--font-mono)' }}>
                  {Math.min(100, Math.round(((Number(editGoal.newCurrent) || 0) / editGoal.target) * 100))}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: 10, borderRadius: 5 }}>
                <div className="progress-fill" style={{
                  width: `${Math.min(100, Math.round(((Number(editGoal.newCurrent) || 0) / editGoal.target) * 100))}%`,
                  background: catColor(editGoal.category),
                  borderRadius: 5,
                  transition: 'width 0.2s'
                }} />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditGoal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Guardar progreso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
