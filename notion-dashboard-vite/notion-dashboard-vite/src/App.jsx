import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import Projects from './pages/Projects.jsx'
import Finances from './pages/Finances.jsx'
import Goals from './pages/Goals.jsx'
import Habits from './pages/Habits.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import Notes from './pages/Notes.jsx'

function AppInner() {
  const [page, setPage] = useState('dashboard')
  const { tasks, projects, loading } = useApp()
  const pendingTasks = tasks.filter(t => !t.done).length
  const activeProjects = projects.filter(p => p.status === 'En progreso').length

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    tasks: <Tasks />,
    projects: <Projects />,
    finances: <Finances />,
    goals: <Goals />,
    habits: <Habits />,
    calendar: <CalendarPage />,
    notes: <Notes />,
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Cargando tu dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar active={page} onNavigate={setPage} taskCount={pendingTasks} projectCount={activeProjects} />
      <main className="main">
        {pages[page] || pages.dashboard}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
