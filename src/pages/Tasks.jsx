import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, X, ChevronRight, FileText, Calendar, Tag, Folder } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const PRIORITIES = ['alta', 'media', 'baja'];
const CATEGORIES = ['Trabajo', 'Personal', 'Salud', 'Aprendizaje', 'Otro'];

function priorityBadge(p) {
  if (p === 'alta') return <span className="badge badge-red">Alta</span>;
  if (p === 'media') return <span className="badge badge-yellow">Media</span>;
  return <span className="badge badge-gray">Baja</span>;
}

function catBadge(c) {
  const map = { Trabajo: 'badge-blue', Personal: 'badge-green', Salud: 'badge-orange', Aprendizaje: 'badge-purple', Otro: 'badge-gray' };
  return <span className={`badge ${map[c] || 'badge-gray'}`}>{c}</span>;
}

export default function Tasks() {
  const { tasks, toggleTask, addTask, deleteTask, updateTask } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [form, setForm] = useState({ text: '', priority: 'media', category: 'Trabajo', project: '', dueDate: '', notes: '' });

  const filtered = tasks.filter(t => {
    if (filter === 'pending' && t.done) return false;
    if (filter === 'done' && !t.done) return false;
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    return true;
  });

  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  const alta = tasks.filter(t => !t.done && t.priority === 'alta').length;

  const handleAdd = () => {
    if (!form.text.trim()) return;
    addTask({ ...form, done: false });
    setForm({ text: '', priority: 'media', category: 'Trabajo', project: '', dueDate: '', notes: '' });
    setShowModal(false);
  };

  const handleRowClick = (task) => {
    setSelectedTask({ ...task });
  };

  const handleSaveTask = () => {
    if (!selectedTask) return;
    updateTask(selectedTask.id, {
      text: selectedTask.text,
      priority: selectedTask.priority,
      category: selectedTask.category,
      project: selectedTask.project,
      dueDate: selectedTask.dueDate,
      notes: selectedTask.notes,
    });
    setSelectedTask(null);
  };

  return (
    <div>
      <div className="page-cover" style={{ background: 'linear-gradient(135deg, #e8f4fd 0%, #f0ebfa 100%)' }} />
      <div className="page-icon-wrapper"><div className="page-icon">✅</div></div>
      <div className="page-header">
        <h1 className="page-title">Tareas</h1>
        <p className="page-description">Gestiona y organiza todas tus tareas. Haz clic en una para ver los detalles.</p>
      </div>
      <div className="page-content">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card"><div className="stat-label">Pendientes</div><div className="stat-value">{pending}</div></div>
          <div className="stat-card"><div className="stat-label">Completadas</div><div className="stat-value">{done}</div></div>
          <div className="stat-card"><div className="stat-label">Urgentes</div><div className="stat-value" style={{ color: 'var(--red)' }}>{alta}</div></div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'pending', 'done'].map(f => (
              <button key={f} className={`select-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
            <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
            <button className={`select-pill ${catFilter === 'all' ? 'active' : ''}`} onClick={() => setCatFilter('all')}>Todas</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`select-pill ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Nueva tarea</button>
        </div>

        {/* Main layout: table + detail panel */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedTask ? '1fr 340px' : '1fr', gap: 16, alignItems: 'start' }}>

          {/* Table */}
          <div className="notion-table-wrapper">
            <div className="table-cols" style={{ gridTemplateColumns: '32px 1fr 90px 90px 110px 36px' }}>
              <div className="table-col-header"></div>
              <div className="table-col-header"><CheckSquare size={12} /> Tarea</div>
              <div className="table-col-header">Categoría</div>
              <div className="table-col-header">Prioridad</div>
              <div className="table-col-header">Fecha</div>
              <div className="table-col-header"></div>
            </div>
            {filtered.length === 0 && (
              <div className="empty-state"><CheckSquare size={40} /><p>No hay tareas con este filtro</p></div>
            )}
            {filtered.map(task => (
              <div
                key={task.id}
                className="table-row"
                style={{
                  gridTemplateColumns: '32px 1fr 90px 90px 110px 36px',
                  background: selectedTask?.id === task.id ? 'var(--bg-secondary)' : undefined,
                  cursor: 'pointer',
                }}
                onClick={() => handleRowClick(task)}
              >
                <div className="table-cell" onClick={e => e.stopPropagation()}>
                  <div className={`notion-checkbox ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>
                    {task.done && <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1.5,5 4,7.5 8.5,2.5" /></svg>}
                  </div>
                </div>
                <div className="table-cell">
                  <span className={`task-text ${task.done ? 'done' : ''}`}>{task.text}</span>
                  {task.notes && <FileText size={12} style={{ marginLeft: 6, color: 'var(--text-tertiary)', flexShrink: 0 }} />}
                  {task.project && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 6 }}>↳ {task.project}</span>}
                </div>
                <div className="table-cell">{catBadge(task.category)}</div>
                <div className="table-cell">{priorityBadge(task.priority)}</div>
                <div className="table-cell table-cell-secondary">{task.dueDate || '—'}</div>
                <div className="table-cell" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--text-tertiary)' }} onClick={() => { if (selectedTask?.id === task.id) setSelectedTask(null); deleteTask(task.id); }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(true)}><Plus size={14} /> Añadir tarea</button>
            </div>
          </div>

          {/* Detail panel */}
          {selectedTask && (
            <div className="notion-table-wrapper" style={{ padding: 0, position: 'sticky', top: 20 }}>
              {/* Header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Detalle de tarea</span>
                <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => setSelectedTask(null)}><X size={16} /></button>
              </div>

              <div style={{ padding: '16px' }}>
                {/* Checkbox + title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                  <div className={`notion-checkbox ${selectedTask.done ? 'checked' : ''}`} style={{ marginTop: 3, flexShrink: 0 }} onClick={() => { toggleTask(selectedTask.id); setSelectedTask({ ...selectedTask, done: !selectedTask.done }); }}>
                    {selectedTask.done && <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1.5,5 4,7.5 8.5,2.5" /></svg>}
                  </div>
                  <textarea
                    value={selectedTask.text}
                    onChange={e => setSelectedTask({ ...selectedTask, text: e.target.value })}
                    style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font)', background: 'transparent', lineHeight: 1.4, textDecoration: selectedTask.done ? 'line-through' : 'none' }}
                    rows={2}
                  />
                </div>

                {/* Properties */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>

                  {/* Priority */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)', gap: 10 }}>
                    <div style={{ width: 100, fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Tag size={11} /> Prioridad
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {PRIORITIES.map(p => (
                        <button key={p} onClick={() => setSelectedTask({ ...selectedTask, priority: p })} style={{ padding: '2px 8px', fontSize: 11, fontWeight: 500, borderRadius: 4, cursor: 'pointer', border: selectedTask.priority === p ? 'none' : '1px solid var(--border)', background: selectedTask.priority === p ? (p === 'alta' ? 'var(--red-light)' : p === 'media' ? 'var(--yellow-light)' : 'var(--bg-active)') : 'var(--bg)', color: selectedTask.priority === p ? (p === 'alta' ? 'var(--red)' : p === 'media' ? 'var(--yellow)' : 'var(--text-secondary)') : 'var(--text-tertiary)' }}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)', gap: 10 }}>
                    <div style={{ width: 100, fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Tag size={11} /> Categoría
                    </div>
                    <select value={selectedTask.category} onChange={e => setSelectedTask({ ...selectedTask, category: e.target.value })} style={{ border: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font)', outline: 'none', cursor: 'pointer' }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Due date */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border)', gap: 10 }}>
                    <div style={{ width: 100, fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={11} /> Fecha
                    </div>
                    <input type="date" value={selectedTask.dueDate || ''} onChange={e => setSelectedTask({ ...selectedTask, dueDate: e.target.value })} style={{ border: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font)', outline: 'none', cursor: 'pointer' }} />
                  </div>

                  {/* Project */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 10 }}>
                    <div style={{ width: 100, fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Folder size={11} /> Proyecto
                    </div>
                    <input value={selectedTask.project || ''} onChange={e => setSelectedTask({ ...selectedTask, project: e.target.value })} placeholder="Sin proyecto" style={{ border: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font)', outline: 'none', flex: 1 }} />
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FileText size={11} /> Notas
                  </div>
                  <textarea
                    value={selectedTask.notes || ''}
                    onChange={e => setSelectedTask({ ...selectedTask, notes: e.target.value })}
                    placeholder="Añade notas, enlaces, detalles importantes..."
                    style={{ width: '100%', minHeight: 120, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-primary)', background: 'var(--bg)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSaveTask}>Guardar cambios</button>
                  <button className="btn btn-ghost" style={{ color: 'var(--red)' }} onClick={() => { deleteTask(selectedTask.id); setSelectedTask(null); }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nueva tarea</div>
            <div className="form-group">
              <label className="form-label">Tarea *</label>
              <input className="form-input" placeholder="¿Qué tienes que hacer?" value={form.text} onChange={e => setForm({...form, text: e.target.value})} autoFocus onKeyDown={e => e.key === 'Enter' && handleAdd()} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prioridad</label>
                <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Proyecto</label>
                <input className="form-input" placeholder="Proyecto relacionado" value={form.project} onChange={e => setForm({...form, project: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha límite</label>
                <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea className="form-textarea" placeholder="Detalles, enlaces, instrucciones..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Crear tarea</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
