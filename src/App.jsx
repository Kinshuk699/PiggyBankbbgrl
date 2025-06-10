// ===============================
// File: src/App.jsx
// ===============================

import React, { useState, useEffect } from "react";
import "./App.css";

export default function PiggyWisdomApp() {
  // ---------- helpers ----------
  const load = (k, d) => JSON.parse(localStorage.getItem(k)) ?? d;
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // ---------- state ----------
  const [goal, setGoal] = useState(load("goal", 1000));
  const [savings, setSavings] = useState(load("savings", 0));
  const [expenses, setExpenses] = useState(load("expenses", []));

  const [goalIn, setGoalIn] = useState(goal);
  const [incIn, setIncIn] = useState("");
  const [expNameIn, setExpNameIn] = useState("");
  const [expAmtIn, setExpAmtIn] = useState("");
  const [celebrate, setCelebrate] = useState(false);

  // ---------- derived ----------
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const net = savings - spent;
  const pct = goal ? Math.min((net / goal) * 100, 100) : 0;

  // ---------- persistence ----------
  useEffect(() => save("goal", goal), [goal]);
  useEffect(() => save("savings", savings), [savings]);
  useEffect(() => save("expenses", expenses), [expenses]);

  // ---------- effects ----------
  useEffect(() => {
    if (pct >= 100 && !celebrate) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 5000);
    }
  }, [pct, celebrate]);

  // ---------- handlers ----------
  const addIncome = () => {
    const v = parseFloat(incIn);
    if (v > 0) {
      setSavings(s => s + v);
      setIncIn("");
    }
  };
  const addExpense = () => {
    const v = parseFloat(expAmtIn);
    if (expNameIn && v > 0) {
      setExpenses(e => [{ id: Date.now(), name: expNameIn, amount: v, date: new Date().toLocaleString() }, ...e]);
      setExpNameIn("");
      setExpAmtIn("");
    }
  };
  const delExpense = id => setExpenses(e => e.filter(x => x.id !== id));
  const updGoal = () => {
    const v = parseFloat(goalIn);
    if (v > 0) setGoal(v);
  };

  // ---------- ui ----------
  return (
    <div className="app">
      {celebrate && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <div className="celebration-pig">🐷</div>
            <h1 className="celebration-text">Congrats!</h1>
          </div>
        </div>
      )}

      {/* pulsating background */}
      <div className="pulsating-bg">
        <div className="radiating-pattern">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="circle-line"
              style={{
                width: `${100 - i * 2}%`,
                height: `${100 - i * 2}%`,
                animationDelay: `${i * 0.05}s`,
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            />
          ))}
        </div>
      </div>

      {/* navbar */}
      <nav className="nav">
        <span className="nav__logo">🐷 PiggyWisdom</span>
        <div className="nav__links">
          <a href="#goal">Savings</a>
          <a href="#expenses">Expenses</a>
          <a href="https://www.investopedia.com/articles/personal-finance/112614/20-something-financial-tips.asp" target="_blank" rel="noreferrer">Tips</a>
        </div>
      </nav>

      {/* hero */}
      <header className="hero">
        <h1>Welcome to <span className="pink">PiggyWisdom</span></h1>
        <p>Track coins, curb cravings, and make your piggy bank proud.</p>
      </header>

      <main className="grid">
        {/* savings card */}
        <section id="goal" className="card card--save">
          <h2>🐽 Saving Goals</h2>

          <div className="row">
            <input type="number" value={goalIn} onChange={e=>setGoalIn(e.target.value)} placeholder="Set goal $" />
            <button onClick={updGoal}>Update Goal</button>
          </div>

          <div className="row">
            <input type="number" value={incIn} onChange={e=>setIncIn(e.target.value)} placeholder="Add $ to piggy" />
            <button className="green" onClick={addIncome}>Save</button>
          </div>

          <h3>{net.toFixed(2)} / {goal} saved</h3>
          <div className="bar"><div style={{width:`${pct}%`}} /></div>
          <p className="tiny">{pct<100?`${Math.round(pct)}% reached – keep going!`:"Goal smashed! 🎉"}</p>
        </section>

        {/* expenses card */}
        <section id="expenses" className="card card--exp">
          <h2>💸 Expense Tracker</h2>

          <div className="col">
            <input placeholder="Expense name" value={expNameIn} onChange={e=>setExpNameIn(e.target.value)} />
            <input type="number" step="0.01" placeholder="$ Amount" value={expAmtIn} onChange={e=>setExpAmtIn(e.target.value)} />
            <button className="blue" onClick={addExpense}>Add Expense</button>
          </div>

          <h3 className="sub">Recent</h3>
          <ul className="list">
            {expenses.length===0 && <li>No expenses yet 🎉</li>}
            {expenses.map(x=>(
              <li key={x.id}>
                <div>
                  <strong>{x.name}</strong><br/>
                  <span className="tiny">{x.date}</span>
                </div>
                <div className="right">
                  <span>${x.amount.toFixed(2)}</span>
                  <button className="del" onClick={()=>delExpense(x.id)}>✕</button>
                </div>
              </li>
            ))}
          </ul>

          <p className="tiny">Total spent: ${spent.toFixed(2)} | Net: ${net.toFixed(2)}</p>
        </section>
      </main>
    </div>
  );
}
