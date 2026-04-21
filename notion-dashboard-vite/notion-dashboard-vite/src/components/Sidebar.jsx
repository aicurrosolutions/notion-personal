import React from 'react';
import { LayoutDashboard, CheckSquare, FolderOpen, TrendingUp, Target, BookOpen, Calendar, Activity } from 'lucide-react';

const NAV = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tareas', icon: CheckSquare },
  { id: 'projects', label: 'Proyectos', icon: FolderOpen },
  { id: 'finances', label: 'Finanzas', icon: TrendingUp },
  { id: 'goals', label: 'Objetivos', icon: Target },
  { id: 'habits', label: 'Hábitos', icon: Activity },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'notes', label: 'Notas', icon: BookOpen },
];

export default function Sidebar({ active, onNavigate, taskCount, projectCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="workspace-name">
          <div className="workspace-icon">C</div>
          <div>
            <div className="workspace-title">Curro</div>
            <div className="workspace-subtitle">Espacio de trabajo</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menú</div>
        {NAV.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon className="nav-icon" />
            {label}
            {id === 'tasks' && taskCount > 0 && (
              <span className="nav-badge">{taskCount}</span>
            )}
            {id === 'projects' && projectCount > 0 && (
              <span className="nav-badge">{projectCount}</span>
            )}
          </div>
        ))}
      </nav>

      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>Mi Dashboard v1.0</div>
          Todos los datos se guardan localmente en tu navegador.
        </div>
      </div>
    </aside>
  );
}
