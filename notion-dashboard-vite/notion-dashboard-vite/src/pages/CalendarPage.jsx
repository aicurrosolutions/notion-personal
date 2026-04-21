import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('media');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const prev = () => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); };
  const next = () => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); };

  const getTasksForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;

  const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  const handleAddTask = () => {
    if (!newTaskText.trim() || !selectedDay) return;
    addTask({ text: newTaskText, priority: newTaskPriority, category: 'Personal', project: '', dueDate: selectedDateStr, notes: '' });
    setNewTaskText('');
    setShowTaskForm(false);
  };

  const formatSelectedDate = () => {
    if (!selectedDay) return '';
    const d = new Date(year, month, selectedDay);
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div>
      <div className="page-cover" style={{ background: 'linear-gradient(135deg, #e3f9f5 0%, #e8f4fd 100%)' }} />
      <div className="page-icon-wrapper"><div className="page-icon">📅</div></div>
      <div className="page-header">
        <h1 className="page-title">Calendario</h1>
        <p className="page-description">Haz clic en un día para ver y añadir tareas.</p>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: selectedDay ? '1fr 300px' : '1fr', gap: 16, alignItems: 'start' }}>

          {/* Calendar grid */}
          <div className="notion-table-wrapper" style={{ padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: 16, fontWeight: 600 }}>{MONTHS[month]} {year}</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost" onClick={prev}><ChevronLeft size={16} /></button>
                <button className="btn btn-ghost" onClick={() => { setViewDate(new Date(now.getFullYear(), now.getMonth(), 1)); setSelectedDay(null); }}>Hoy</button>
                <button className="btn btn-ghost" onClick={next}><ChevronRight size={16} /></button>
              </div>
            </div>

            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                {DAY_NAMES.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px', padding: '4px 0' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {Array.from({ length: totalCells }, (_, i) => {
                  const day = i - offset + 1;
                  const valid = day >= 1 && day <= daysInMonth;
                  const dateStr = valid ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                  const isToday = dateStr === todayStr;
                  const isSelected = selectedDay === day && valid;
                  const dayTasks = valid ? getTasksForDay(day) : [];
                  const doneTasks = dayTasks.filter(t => t.done).length;

                  return (
                    <div
                      key={i}
                      onClick={() => valid && setSelectedDay(isSelected ? null : day)}
                      style={{
                        minHeight: 80,
                        padding: '6px',
                        borderRadius: 'var(--radius)',
                        background: isSelected ? 'var(--bg-active)' : isToday ? 'var(--accent-light)' : valid ? 'var(--bg)' : 'transparent',
                        border: isSelected ? '2px solid var(--text-primary)' : isToday ? '1.5px solid var(--accent)' : valid ? '1px solid var(--border)' : 'none',
                        cursor: valid ? 'pointer' : 'default',
                        transition: 'all 0.1s',
                      }}
                    >
                      {valid && (
                        <>
                          <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text-secondary)', marginBottom: 4 }}>{day}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {dayTasks.slice(0, 2).map(t => (
                              <div key={t.id} style={{
                                fontSize: 10, padding: '2px 5px', borderRadius: 3,
                                background: t.done ? 'var(--green-light)' : t.priority === 'alta' ? 'var(--red-light)' : 'var(--accent-light)',
                                color: t.done ? 'var(--green)' : t.priority === 'alta' ? 'var(--red)' : 'var(--accent)',
                                textDecoration: t.done ? 'line-through' : 'none',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>{t.text}</div>
                            ))}
                            {dayTasks.length > 2 && <div style={{ fontSize: 10, color: 'var(--text-tertiary)', paddingLeft: 2 }}>+{dayTasks.length - 2} más</div>}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Day panel */}
          {selectedDay && (
            <div className="notion-table-wrapper" style={{ padding: 0 }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{formatSelectedDate()}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{selectedTasks.length} tarea{selectedTasks.length !== 1 ? 's' : ''}</div>
                </div>
                <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => setSelectedDay(null)}><X size={16} /></button>
              </div>

              <div style={{ padding: '8px 0' }}>
                {selectedTasks.length === 0 && !showTaskForm && (
                  <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
                    No hay tareas este día
                  </div>
                )}
                {selectedTasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)' }}>
                    <div className={`notion-checkbox ${t.done ? 'checked' : ''}`} style={{ flexShrink: 0 }} onClick={() => toggleTask(t.id)}>
                      {t.done && <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1.5,5 4,7.5 8.5,2.5" /></svg>}
                    </div>
                    <span style={{ flex: 1, fontSize: 13, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{t.text}</span>
                    <span className={`badge ${t.priority === 'alta' ? 'badge-red' : t.priority === 'media' ? 'badge-yellow' : 'badge-gray'}`} style={{ fontSize: 10 }}>{t.priority}</span>
                    <button className="btn btn-ghost" style={{ padding: 3, color: 'var(--text-tertiary)' }} onClick={() => deleteTask(t.id)}><Trash2 size={12} /></button>
                  </div>
                ))}

                {showTaskForm ? (
                  <div style={{ padding: '12px 14px', borderTop: selectedTasks.length > 0 ? '1px solid var(--border)' : 'none' }}>
                    <input
                      className="form-input"
                      style={{ marginBottom: 8 }}
                      placeholder="Nombre de la tarea..."
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      {['alta', 'media', 'baja'].map(p => (
                        <button key={p} className={`select-pill ${newTaskPriority === p ? 'active' : ''}`} onClick={() => setNewTaskPriority(p)} style={{ fontSize: 11 }}>{p}</button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { setShowTaskForm(false); setNewTaskText(''); }}>Cancelar</button>
                      <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={handleAddTask}>Añadir</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '8px 14px' }}>
                    <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setShowTaskForm(true)}>
                      <Plus size={14} /> Añadir tarea
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming tasks */}
        <div className="notion-table-wrapper" style={{ marginTop: 20 }}>
          <div className="notion-table-header">
            <div className="notion-table-title"><Calendar size={16} /> Próximas tareas</div>
          </div>
          {tasks.filter(t => !t.done && t.dueDate && t.dueDate >= todayStr)
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
            .slice(0, 8)
            .map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                <div className="notion-checkbox" onClick={() => toggleTask(t.id)} style={{ flexShrink: 0 }}>
                  {t.done && <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1.5,5 4,7.5 8.5,2.5" /></svg>}
                </div>
                <div style={{ width: 60, fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{t.dueDate?.slice(5)}</div>
                <span style={{ flex: 1, fontSize: 14 }}>{t.text}</span>
                <span className={`badge ${t.priority === 'alta' ? 'badge-red' : t.priority === 'media' ? 'badge-yellow' : 'badge-gray'}`}>{t.priority}</span>
              </div>
            ))}
          {tasks.filter(t => !t.done && t.dueDate && t.dueDate >= todayStr).length === 0 && (
            <div className="empty-state"><p>No hay tareas próximas</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
