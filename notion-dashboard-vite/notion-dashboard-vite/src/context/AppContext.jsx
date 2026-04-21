import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [transactions, setTransactions] = useState([])
  const [habits, setHabits] = useState([])
  const [goals, setGoals] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      const [t, p, tx, h, g, n] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('habits').select('*').order('created_at', { ascending: true }),
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
        supabase.from('notes').select('*').order('created_at', { ascending: false }),
      ])
      if (t.data) setTasks(t.data.map(normalizeTask))
      if (p.data) setProjects(p.data.map(normalizeProject))
      if (tx.data) setTransactions(tx.data.map(normalizeTx))
      if (h.data) setHabits(h.data.map(normalizeHabit))
      if (g.data) setGoals(g.data.map(normalizeGoal))
      if (n.data) setNotes(n.data.map(normalizeNote))
      setLoading(false)
    }
    loadAll()
  }, [])

  const normalizeTask = (r) => ({ id: r.id, text: r.text, done: r.done, priority: r.priority, category: r.category, project: r.project, dueDate: r.due_date, notes: r.notes })
  const normalizeProject = (r) => ({ id: r.id, name: r.name, client: r.client, status: r.status, progress: r.progress, dueDate: r.due_date, budget: r.budget, earned: r.earned, tags: r.tags || [], notes: r.notes })
  const normalizeTx = (r) => ({ id: r.id, type: r.type, amount: r.amount, description: r.description, category: r.category, date: r.date })
  const normalizeHabit = (r) => ({ id: r.id, name: r.name, emoji: r.emoji, color: r.color, completedDays: r.completed_days || [] })
  const normalizeGoal = (r) => ({ id: r.id, title: r.title, target: r.target, current: r.current, progress: r.progress, unit: r.unit, category: r.category, dueDate: r.due_date })
  const normalizeNote = (r) => ({ id: r.id, title: r.title, content: r.content, tags: r.tags || [], updatedAt: r.updated_at })

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    const newDone = !task.done
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: newDone } : t))
    await supabase.from('tasks').update({ done: newDone }).eq('id', id)
  }
  const addTask = async (task) => {
    const { data } = await supabase.from('tasks').insert([{ text: task.text, done: false, priority: task.priority, category: task.category, project: task.project, due_date: task.dueDate, notes: task.notes }]).select().single()
    if (data) setTasks(ts => [normalizeTask(data), ...ts])
  }
  const updateTask = async (id, changes) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, ...changes } : t))
    await supabase.from('tasks').update({
      text: changes.text,
      priority: changes.priority,
      category: changes.category,
      project: changes.project,
      due_date: changes.dueDate,
      notes: changes.notes,
    }).eq('id', id)
  }
  const deleteTask = async (id) => {
    setTasks(ts => ts.filter(t => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }

  const addProject = async (p) => {
    const { data } = await supabase.from('projects').insert([{ name: p.name, client: p.client, status: p.status, progress: Number(p.progress) || 0, due_date: p.dueDate, budget: Number(p.budget) || 0, earned: Number(p.earned) || 0, tags: p.tags || [], notes: p.notes || '' }]).select().single()
    if (data) setProjects(ps => [normalizeProject(data), ...ps])
  }
  const updateProject = async (id, changes) => {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, ...changes } : p))
    await supabase.from('projects').update({
      name: changes.name, client: changes.client, status: changes.status,
      progress: changes.progress, due_date: changes.dueDate,
      budget: changes.budget, earned: changes.earned,
      tags: changes.tags, notes: changes.notes
    }).eq('id', id)
  }
  const deleteProject = async (id) => {
    setProjects(ps => ps.filter(p => p.id !== id))
    await supabase.from('projects').delete().eq('id', id)
  }

  const addTransaction = async (tx) => {
    const { data } = await supabase.from('transactions').insert([{ type: tx.type, amount: Number(tx.amount), description: tx.description, category: tx.category, date: tx.date }]).select().single()
    if (data) setTransactions(ts => [normalizeTx(data), ...ts])
  }
  const deleteTransaction = async (id) => {
    setTransactions(ts => ts.filter(t => t.id !== id))
    await supabase.from('transactions').delete().eq('id', id)
  }

  const toggleHabit = async (habitId, day) => {
    const habit = habits.find(h => h.id === habitId)
    const newDays = habit.completedDays.includes(day) ? habit.completedDays.filter(d => d !== day) : [...habit.completedDays, day]
    setHabits(hs => hs.map(h => h.id === habitId ? { ...h, completedDays: newDays } : h))
    await supabase.from('habits').update({ completed_days: newDays }).eq('id', habitId)
  }
  const addHabit = async (h) => {
    const { data } = await supabase.from('habits').insert([{ name: h.name, emoji: h.emoji, color: h.color, completed_days: [] }]).select().single()
    if (data) setHabits(hs => [...hs, normalizeHabit(data)])
  }
  const deleteHabit = async (id) => {
    setHabits(hs => hs.filter(h => h.id !== id))
    await supabase.from('habits').delete().eq('id', id)
  }

  const addGoal = async (g) => {
    const { data } = await supabase.from('goals').insert([{ title: g.title, target: Number(g.target), current: Number(g.current) || 0, progress: g.progress, unit: g.unit, category: g.category, due_date: g.dueDate }]).select().single()
    if (data) setGoals(gs => [normalizeGoal(data), ...gs])
  }
  const updateGoal = async (id, changes) => {
    const dbChanges = {}
    if (changes.current !== undefined) dbChanges.current = changes.current
    if (changes.progress !== undefined) dbChanges.progress = changes.progress
    setGoals(gs => gs.map(g => g.id === id ? { ...g, ...changes } : g))
    await supabase.from('goals').update(dbChanges).eq('id', id)
  }
  const deleteGoal = async (id) => {
    setGoals(gs => gs.filter(g => g.id !== id))
    await supabase.from('goals').delete().eq('id', id)
  }

  const addNote = async (n) => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('notes').insert([{ title: n.title, content: n.content, tags: n.tags || [], updated_at: today }]).select().single()
    if (data) setNotes(ns => [normalizeNote(data), ...ns])
  }
  const updateNote = async (id, changes) => {
    const today = new Date().toISOString().split('T')[0]
    setNotes(ns => ns.map(n => n.id === id ? { ...n, ...changes, updatedAt: today } : n))
    await supabase.from('notes').update({ title: changes.title, content: changes.content, tags: changes.tags, updated_at: today }).eq('id', id)
  }
  const deleteNote = async (id) => {
    setNotes(ns => ns.filter(n => n.id !== id))
    await supabase.from('notes').delete().eq('id', id)
  }

  return (
    <AppContext.Provider value={{
      loading,
      tasks, toggleTask, addTask, updateTask, deleteTask,
      projects, addProject, updateProject, deleteProject,
      transactions, addTransaction, deleteTransaction,
      habits, toggleHabit, addHabit, deleteHabit,
      goals, addGoal, updateGoal, deleteGoal,
      notes, addNote, updateNote, deleteNote,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
