import React, { useState } from 'react';
import { FolderOpen, Plus, Trash2, Clock, User, Euro, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const STATUS_OPTS = ['Planificado', 'En progreso', 'Revisión', 'Completado', 'Pausado'];
const TAGS_OPTS = ['React', 'HTML', 'CSS', 'JavaScript', 'Vercel', 'WordPress', 'Stripe', 'Node.js'];

function statusBadge(s) {
  const map = { 'En progreso': 'badge-blue', 'Completado': 'badge-green', 'Planificado': 'badge-gray', 'Revisión': 'badge-yellow', 'Pausado': 'badge-orange' };
  return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
}

export default function Projects() {
  const { projects, addProject, deleteProject, updateProject, tasks } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', client: '', status: 'En progreso', progress: 0, dueDate: '', budget: '', earned: '', tags: [], notes: '' });

  const filtered = projects.filter(p => filter === 'all' || p.status === filter);
  const totalEarned = projects.reduce((s, p) => s + (p.earned || 0), 0);
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const active = projects.filter(p => p.status === 'En progreso').length;

  const toggleTag = (t, obj, setObj) => {
    setObj({ ...obj, tags: obj.tags.includes(t) ? obj.tags.filter(x => x !== t) : [...obj.tags, t] });
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addProject({ ...form, budget: Number(form.budget) || 0, earned: Number(form.earned) || 0, progress: Number(form.progress) || 0 });
    setForm({ name: '', client: '', status: 'En progreso', progress: 0, dueDate: '', budget: '', earned: '', tags: [], notes: '' });
    setShowModal(false);
  };

  const handleSaveEdit = () => {
    if (!editProject.name.trim()) return;
    updateProject(editProject.id, {
      name: editProject.name,
      client: editProject.client,
      status: editProject.status,
      progress: Number(editProject.progress) || 0,
      dueDate: editProject.dueDate,
      budget: Number(editProject.budget) || 0,
      earned: Number(editProject.earned) || 0,
      tags: editProject.tags,
      notes: editProject.notes,
    });
    setEditProject(null);
  };

  const projectTasks = (name) => tasks.filter(t => t.project === name);

  return (
    <div>
      <div className="page-cover" style={{ background: 'linear-gradient(135deg, #e6f5ef 0%, #e8f4fd 100%)' }} />
      <div className="page-icon-wrapper"><div className="page-icon">📁</div></div>
      <div className="page-header">
        <h1 className="page-title">Proyectos</h1>
        <p className="page-description">Seguimiento de todos tus proyectos freelance.</p>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total proyectos</div><div className="stat-value">{projects.length}</div></div>
          <div className="stat-card"><div className="stat-label">En progreso</div><div className="stat-value" style={{ color: 'var(--accent)' }}>{active}</div></div>
          <div className="stat-card"><div className="stat-label">Cobrado</div><div className="stat-value">€{totalEarned.toLocaleString()}</div></div>
          <div className="stat-card"><div className="stat-label">Presupuesto total</div><div className="stat-value">€{totalBudget.toLocaleString()}</div></div>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button className={`select-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todos</button>
            {STATUS_OPTS.map(s => <button key={s} className={`select-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>)}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> Nuevo proyecto</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.length === 0 && <div className="empty-state"><FolderOpen size={40} /><p>No hay proyectos</p></div>}
          {filtered.map(p => {
            const ptasks = projectTasks(p.name);
            const ptasksDone = ptasks.filter(t => t.done).length;
            return (
              <div key={p.id} className="notion-table-wrapper">
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</span>
                        {statusBadge(p.status)}
                      </div>
                      {p.client && <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}><User size={13} /> {p.client}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost" style={{ color: 'var(--text-secondary)', padding: '5px 8px', fontSize: 13 }} onClick={() => setEditProject({ ...p })}>
                        <Pencil size={14} /> Editar
                      </button>
                      <button className="btn btn-ghost" style={{ color: 'var(--text-tertiary)', padding: 5 }} onClick={() => deleteProject(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progreso</span>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{p.progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div className="progress-fill" style={{ width: `${p.progress}%`, background: p.progress === 100 ? 'var(--green)' : p.progress > 70 ? 'var(--accent)' : 'var(--orange)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {p.dueDate && <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}><Clock size={13} /> {p.dueDate}</div>}
                    {p.budget > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}><Euro size={13} /> €{p.earned} / €{p.budget}</div>}
                    {ptasks.length > 0 && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📋 {ptasksDone}/{ptasks.length} tareas</div>}
                    <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
                      {(p.tags || []).map(tag => <span key={tag} className="badge badge-gray">{tag}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(true)}><Plus size={14} /> Añadir proyecto</button>
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo proyecto</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" placeholder="Nombre del proyecto" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoFocus /></div>
              <div className="form-group"><label className="form-label">Cliente</label><input className="form-input" placeholder="Nombre del cliente" value={form.client} onChange={e => setForm({...form, client: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Estado</label><select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>{STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Progreso (%)</label><input type="number" min="0" max="100" className="form-input" placeholder="0-100" value={form.progress} onChange={e => setForm({...form, progress: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Presupuesto (€)</label><input type="number" className="form-input" placeholder="0" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Cobrado (€)</label><input type="number" className="form-input" placeholder="0" value={form.earned} onChange={e => setForm({...form, earned: e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Fecha entrega</label><input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Tecnologías</label><div className="select-group">{TAGS_OPTS.map(t => <button key={t} className={`select-pill ${form.tags.includes(t) ? 'active' : ''}`} onClick={() => toggleTag(t, form, setForm)}>{t}</button>)}</div></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Crear proyecto</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editProject && (
        <div className="modal-overlay" onClick={() => setEditProject(null)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Editar proyecto</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={editProject.name} onChange={e => setEditProject({...editProject, name: e.target.value})} autoFocus /></div>
              <div className="form-group"><label className="form-label">Cliente</label><input className="form-input" value={editProject.client} onChange={e => setEditProject({...editProject, client: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Estado</label><select className="form-select" value={editProject.status} onChange={e => setEditProject({...editProject, status: e.target.value})}>{STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="form-group">
                <label className="form-label">Progreso: {editProject.progress}%</label>
                <input type="range" min="0" max="100" value={editProject.progress} onChange={e => setEditProject({...editProject, progress: Number(e.target.value)})} style={{ width: '100%', marginTop: 8, accentColor: 'var(--text-primary)' }} />
                <div className="progress-bar" style={{ marginTop: 6, height: 6 }}>
                  <div className="progress-fill" style={{ width: `${editProject.progress}%`, background: editProject.progress === 100 ? 'var(--green)' : editProject.progress > 70 ? 'var(--accent)' : 'var(--orange)' }} />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Presupuesto (€)</label><input type="number" className="form-input" value={editProject.budget} onChange={e => setEditProject({...editProject, budget: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Cobrado (€)</label><input type="number" className="form-input" value={editProject.earned} onChange={e => setEditProject({...editProject, earned: e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Fecha entrega</label><input type="date" className="form-input" value={editProject.dueDate} onChange={e => setEditProject({...editProject, dueDate: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Tecnologías</label><div className="select-group">{TAGS_OPTS.map(t => <button key={t} className={`select-pill ${editProject.tags.includes(t) ? 'active' : ''}`} onClick={() => toggleTag(t, editProject, setEditProject)}>{t}</button>)}</div></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditProject(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
