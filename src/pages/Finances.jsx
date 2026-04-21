import React, { useState, useMemo } from 'react';
import { TrendingUp, Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

const GASTO_CATS = ['Combustible', 'Comida', 'Ocio', 'Ropa', 'Transporte', 'Suscripciones', 'Salud', 'Hogar', 'Tecnología', 'Educación', 'Otro'];
const INGRESO_CATS = ['Proyectos', 'Freelance', 'Salario', 'Inversiones', 'Otro'];

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CAT_COLORS = {
  Combustible: '#d9730d', Comida: '#0f7b55', Ocio: '#6940a5', Ropa: '#c14f8a',
  Transporte: '#2383e2', Suscripciones: '#e03e3e', Salud: '#0b7285',
  Hogar: '#dfab01', Tecnología: '#1a1a19', Educación: '#6940a5', Otro: '#9b9b98',
  Proyectos: '#0f7b55', Freelance: '#2383e2', Salario: '#6940a5', Inversiones: '#dfab01',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name === 'ingresos' ? 'Ingresos' : 'Gastos'}: €{p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Finances() {
  const { transactions, addTransaction, deleteTransaction } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({ type: 'gasto', amount: '', description: '', category: 'Combustible', date: new Date().toISOString().split('T')[0] });

  const today = new Date();
  const currMonth = today.getMonth();
  const currYear = today.getFullYear();

  const monthlyData = useMemo(() => {
    return MONTHS.map((name, i) => {
      const txs = transactions.filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === i && d.getFullYear() === currYear;
      });
      return {
        name,
        ingresos: txs.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0),
        gastos: txs.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, currYear]);

  const thisMonthTx = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const ingresos = thisMonthTx.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
  const gastos = thisMonthTx.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
  const balance = ingresos - gastos;

  const gastosPorCat = useMemo(() => {
    const map = {};
    thisMonthTx.filter(t => t.type === 'gasto').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([cat, amount]) => ({ cat, amount, color: CAT_COLORS[cat] || '#9b9b98' }))
      .sort((a, b) => b.amount - a.amount);
  }, [thisMonthTx]);

  const pieData = gastosPorCat.map(g => ({ name: g.cat, value: g.amount, fill: g.color }));

  const filteredTx = thisMonthTx.filter(tx => typeFilter === 'all' || tx.type === typeFilter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAdd = () => {
    if (!form.amount || !form.description) return;
    addTransaction({ ...form, amount: Number(form.amount) });
    setForm({ type: 'gasto', amount: '', description: '', category: 'Combustible', date: new Date().toISOString().split('T')[0] });
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-cover" style={{ background: 'linear-gradient(135deg, #fef9e7 0%, #e6f5ef 100%)' }} />
      <div className="page-icon-wrapper"><div className="page-icon">💰</div></div>
      <div className="page-header">
        <h1 className="page-title">Finanzas</h1>
        <p className="page-description">Controla tus ingresos y gastos mensuales.</p>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label"><ArrowUpRight size={14} color="var(--green)" /> Ingresos</div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>€{ingresos.toLocaleString()}</div>
            <div className="stat-sub">{MONTHS[selectedMonth]}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label"><ArrowDownRight size={14} color="var(--red)" /> Gastos</div>
            <div className="stat-value" style={{ color: 'var(--red)' }}>€{gastos.toLocaleString()}</div>
            <div className="stat-sub">{MONTHS[selectedMonth]}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Balance</div>
            <div className="stat-value" style={{ color: balance >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {balance >= 0 ? '+' : ''}€{balance.toLocaleString()}
            </div>
            <div className="stat-sub">{MONTHS[selectedMonth]}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Tasa ahorro</div>
            <div className="stat-value">{ingresos > 0 ? Math.round((balance / ingresos) * 100) : 0}%</div>
            <div className="stat-sub">del ingreso</div>
          </div>
        </div>

        {/* Month selector */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
          {MONTHS.map((m, i) => (
            <button key={i} className={`select-pill ${selectedMonth === i ? 'active' : ''}`} onClick={() => setSelectedMonth(i)}>{m}</button>
          ))}
        </div>

        {/* Charts */}
        <div className="two-col" style={{ marginBottom: 20 }}>
          <div className="chart-section">
            <div className="chart-header">
              <div className="chart-title"><TrendingUp size={16} /> Ingresos vs gastos anuales</div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} />
                <Bar dataKey="ingresos" fill="var(--green)" radius={[3,3,0,0]} maxBarSize={20} />
                <Bar dataKey="gastos" fill="var(--red)" radius={[3,3,0,0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-section">
            <div className="chart-header">
              <div className="chart-title">Gastos por categoría — {MONTHS[selectedMonth]}</div>
            </div>
            {gastosPorCat.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <p>Sin gastos este mes</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <ResponsiveContainer width="45%" height={180}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`€${v}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="category-list" style={{ flex: 1 }}>
                  {gastosPorCat.map(({ cat, amount, color }) => (
                    <div key={cat} className="category-item">
                      <div className="category-dot" style={{ background: color }} />
                      <span className="category-name" style={{ fontSize: 13 }}>{cat}</span>
                      <div className="category-bar-bg" style={{ maxWidth: 60 }}>
                        <div className="category-bar-fill" style={{ width: `${Math.round((amount / gastos) * 100)}%`, background: color }} />
                      </div>
                      <span className="category-amount" style={{ fontSize: 13 }}>€{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transactions table */}
        <div className="notion-table-wrapper">
          <div className="notion-table-header">
            <div className="notion-table-title"><TrendingUp size={16} /> Movimientos — {MONTHS[selectedMonth]} {selectedYear}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'ingreso', 'gasto'].map(f => (
                <button key={f} className={`select-pill ${typeFilter === f ? 'active' : ''}`} onClick={() => setTypeFilter(f)}>
                  {f === 'all' ? 'Todos' : f === 'ingreso' ? 'Ingresos' : 'Gastos'}
                </button>
              ))}
              <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={13} /> Añadir</button>
            </div>
          </div>
          <div className="table-cols" style={{ gridTemplateColumns: '80px 1fr 120px 90px 100px 36px' }}>
            <div className="table-col-header">Fecha</div>
            <div className="table-col-header">Descripción</div>
            <div className="table-col-header">Categoría</div>
            <div className="table-col-header">Tipo</div>
            <div className="table-col-header">Importe</div>
            <div className="table-col-header"></div>
          </div>
          {filteredTx.length === 0 && <div className="empty-state"><p>Sin movimientos este mes</p></div>}
          {filteredTx.map(tx => (
            <div key={tx.id} className="table-row" style={{ gridTemplateColumns: '80px 1fr 120px 90px 100px 36px' }}>
              <div className="table-cell table-cell-secondary" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {tx.date.slice(5)}
              </div>
              <div className="table-cell">{tx.description}</div>
              <div className="table-cell">
                <span className="badge badge-gray" style={{ background: (CAT_COLORS[tx.category] || '#9b9b98') + '20', color: CAT_COLORS[tx.category] || 'var(--text-secondary)' }}>
                  {tx.category}
                </span>
              </div>
              <div className="table-cell">
                {tx.type === 'ingreso'
                  ? <span className="badge badge-green">Ingreso</span>
                  : <span className="badge badge-red">Gasto</span>}
              </div>
              <div className="table-cell" style={{ fontWeight: 600, color: tx.type === 'ingreso' ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-mono)' }}>
                {tx.type === 'ingreso' ? '+' : '-'}€{tx.amount.toLocaleString()}
              </div>
              <div className="table-cell">
                <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--text-tertiary)' }} onClick={() => deleteTransaction(tx.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(true)}><Plus size={14} /> Añadir movimiento</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo movimiento</div>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`select-pill ${form.type === 'gasto' ? 'active' : ''}`} onClick={() => setForm({...form, type: 'gasto', category: 'Combustible'})}>Gasto</button>
                <button className={`select-pill ${form.type === 'ingreso' ? 'active' : ''}`} onClick={() => setForm({...form, type: 'ingreso', category: 'Proyectos'})}>Ingreso</button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Importe (€) *</label>
                <input type="number" className="form-input" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input type="date" className="form-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <input className="form-input" placeholder="¿En qué fue?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <div className="select-group">
                {(form.type === 'gasto' ? GASTO_CATS : INGRESO_CATS).map(c => (
                  <button key={c} className={`select-pill ${form.category === c ? 'active' : ''}`} onClick={() => setForm({...form, category: c})}>{c}</button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
