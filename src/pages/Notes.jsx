import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Search, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const TAG_COLORS = { ideas: 'badge-purple', procesos: 'badge-blue', negocio: 'badge-green', personal: 'badge-orange', aprendizaje: 'badge-teal' };

export default function Notes() {
  const { notes, addNote, deleteNote, updateNote } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', content: '', tags: [] });

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addNote(form);
    setForm({ title: '', content: '', tags: [] });
    setShowModal(false);
  };

  const handleEdit = () => {
    if (!editNote.title.trim()) return;
    updateNote(editNote.id, { title: editNote.title, content: editNote.content, tags: editNote.tags });
    setEditNote(null);
  };

  const toggleTag = (t, target, setTarget) => {
    const tags = target.tags.includes(t) ? target.tags.filter(x => x !== t) : [...target.tags, t];
    setTarget({ ...target, tags });
  };

  const TAGS = Object.keys(TAG_COLORS);

  return (
    <div>
      <div className="page-cover" style={{ background: 'linear-gradient(135deg, #fef9e7 0%, #f0ebfa 100%)' }} />
      <div className="page-icon-wrapper"><div className="page-icon">📓</div></div>
      <div className="page-header">
        <h1 className="page-title">Notas</h1>
        <p className="page-description">Guarda ideas, procesos y notas importantes.</p>
      </div>
      <div className="page-content">
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input className="form-input" style={{ paddingLeft: 32 }} placeholder="Buscar notas..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Nueva nota</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(n => (
            <div key={n.id} className="notion-table-wrapper" style={{ padding: 0 }}>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{n.title}</span>
                  <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                    <button className="btn btn-ghost" style={{ padding: 4, color: 'var(--text-secondary)' }} onClick={() => setEditNote({ ...n })}>
                      <Pencil size={13} />
                    </button>
                    <button className="btn btn-ghost" style={{ padding: 4, color: 'var(--text-tertiary)' }} onClick={() => deleteNote(n.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                  {n.content || <span style={{ color: 'var(--text-placeholder)' }}>Sin contenido</span>}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {(n.tags || []).map(tag => (
                      <span key={tag} className={`badge ${TAG_COLORS[tag] || 'badge-gray'}`}>{tag}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{n.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <BookOpen size={40} />
              <p>No hay notas{search ? ' con esa búsqueda' : ''}</p>
            </div>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(true)}><Plus size={14} /> Añadir nota</button>
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nueva nota</div>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input className="form-input" placeholder="Título de la nota" value={form.title} onChange={e => setForm({...form, title: e.target.value})} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Contenido</label>
              <textarea className="form-textarea" style={{ minHeight: 140 }} placeholder="Escribe aquí tu nota..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <div className="select-group">
                {TAGS.map(t => (
                  <button key={t} className={`select-pill ${form.tags.includes(t) ? 'active' : ''}`} onClick={() => toggleTag(t, form, setForm)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Guardar nota</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editNote && (
        <div className="modal-overlay" onClick={() => setEditNote(null)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Editar nota</div>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input className="form-input" value={editNote.title} onChange={e => setEditNote({...editNote, title: e.target.value})} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Contenido</label>
              <textarea className="form-textarea" style={{ minHeight: 140 }} value={editNote.content} onChange={e => setEditNote({...editNote, content: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <div className="select-group">
                {TAGS.map(t => (
                  <button key={t} className={`select-pill ${editNote.tags.includes(t) ? 'active' : ''}`} onClick={() => toggleTag(t, editNote, setEditNote)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditNote(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleEdit}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
