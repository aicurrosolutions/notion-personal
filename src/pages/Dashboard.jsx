import React from 'react';
import { CheckSquare, FolderOpen, TrendingUp, Target, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

function priorityBadge(p) {
  if (p === 'alta') return <span className="badge badge-red">Alta</span>;
  if (p === 'media') return <span className="badge badge-yellow">Media</span>;
  return <span className="badge badge-gray">Baja</span>;
}

export default function Dashboard({ onNavigate }) {
  const { tasks, projects, transactions, goals } = useApp();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const m = today.getMonth();
  const y = today.getFullYear();

  const pendingTasks = tasks.filter(t => !t.done);
  const dueTodayTasks = tasks.filter(t => !t.done && t.dueDate === todayStr);
  const activeProjects = projects.filter(p => p.status === 'En progreso');
  const thisMonthTx = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === m && d.getFullYear() === y;
  });
  const ingresos = thisMonthTx.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
  const gastos = thisMonthTx.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
  const completedGoals = goals.filter(g => g.progress >= 100).length;

  const recentTasks = tasks.slice(0, 5);

  return (
    <div>
      <div className="page-cover" />
      <div className="page-icon-wrapper">
        <div className="page-icon">🏠</div>
      </div>
      <div className="page-header">
        <h1 className="page-title">Inicio</h1>
        <p className="page-description">
          {today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('tasks')}>
            <div className="stat-label"><CheckSquare size={14} /> Tareas pendientes</div>
            <div className="stat-value">{pendingTasks.length}</div>
            <div className="stat-sub">{dueTodayTasks.length} para hoy</div>
          </div>
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('projects')}>
            <div className="stat-label"><FolderOpen size={14} /> Proyectos activos</div>
            <div className="stat-value">{activeProjects.length}</div>
            <div className="stat-sub">de {projects.length} totales</div>
          </div>
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('finances')}>
            <div className="stat-label"><TrendingUp size={14} /> Ingresos este mes</div>
            <div className="stat-value">€{ingresos.toLocaleString()}</div>
            <div className="stat-trend trend-up">
              <ArrowUpRight size={12} /> Gastos: €{gastos.toLocaleString()}
            </div>
          </div>
          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('goals')}>
            <div className="stat-label"><Target size={14} /> Objetivos</div>
            <div className="stat-value">{goals.length}</div>
            <div className="stat-sub">{completedGoals} completados</div>
          </div>
        </div>

        <div className="two-col">
          <div className="notion-table-wrapper">
            <div className="notion-table-header">
              <div className="notion-table-title"><CheckSquare size={16} /> Tareas recientes</div>
              <button className="btn btn-ghost" onClick={() => onNavigate('tasks')}>Ver todas →</button>
            </div>
            {recentTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                <div className={`notion-checkbox ${task.done ? 'checked' : ''}`}>
                  {task.done && <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1.5,5 4,7.5 8.5,2.5" /></svg>}
                </div>
                <span style={{ flex: 1, fontSize: 14, color: task.done ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
                {priorityBadge(task.priority)}
              </div>
            ))}
          </div>

          <div>
            <div className="notion-table-wrapper" style={{ marginBottom: 16 }}>
              <div className="notion-table-header">
                <div className="notion-table-title"><FolderOpen size={16} /> Proyectos en curso</div>
              </div>
              {activeProjects.map(p => (
                <div key={p.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{p.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.progress}%`, background: p.progress > 80 ? 'var(--green)' : p.progress > 50 ? 'var(--accent)' : 'var(--orange)' }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6, display: 'flex', gap: 12 }}>
                    <span><Clock size={11} style={{ display: 'inline', marginRight: 3 }} />{p.dueDate}</span>
                    <span>{p.client || 'Sin cliente'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="notion-table-wrapper">
              <div className="notion-table-header">
                <div className="notion-table-title"><Target size={16} /> Objetivos</div>
              </div>
              {goals.slice(0, 3).map(g => (
                <div key={g.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{g.title}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{g.current}/{g.target} {g.unit}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${g.progress}%`, background: 'var(--purple)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
