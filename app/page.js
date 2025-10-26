'use client'

import { useState, useEffect } from 'react'

export default function CaloriesTracker() {
  const [entries, setEntries] = useState([])
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [dailyGoal, setDailyGoal] = useState(2000)

  useEffect(() => {
    const saved = localStorage.getItem('calorieEntries')
    const savedGoal = localStorage.getItem('dailyGoal')
    if (saved) setEntries(JSON.parse(saved))
    if (savedGoal) setDailyGoal(Number(savedGoal))
  }, [])

  useEffect(() => {
    localStorage.setItem('calorieEntries', JSON.stringify(entries))
  }, [entries])

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal)
  }, [dailyGoal])

  const addEntry = (e) => {
    e.preventDefault()
    if (foodName && calories) {
      const newEntry = {
        id: Date.now(),
        food: foodName,
        calories: Number(calories),
        timestamp: new Date().toLocaleString()
      }
      setEntries([newEntry, ...entries])
      setFoodName('')
      setCalories('')
    }
  }

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const remaining = dailyGoal - totalCalories
  const percentage = Math.min((totalCalories / dailyGoal) * 100, 100)

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🍎 Calories Tracker</h1>

        <div style={styles.goalSection}>
          <label style={styles.label}>
            Daily Goal:
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              style={styles.goalInput}
              min="0"
            />
            cal
          </label>
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${percentage}%`}}></div>
          </div>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Consumed</span>
              <span style={styles.statValue}>{totalCalories} cal</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Remaining</span>
              <span style={{...styles.statValue, color: remaining < 0 ? '#ef4444' : '#10b981'}}>
                {remaining} cal
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={addEntry} style={styles.form}>
          <input
            type="text"
            placeholder="Food name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            style={styles.input}
            min="0"
            required
          />
          <button type="submit" style={styles.button}>Add Entry</button>
        </form>

        <div style={styles.entriesList}>
          <h2 style={styles.subtitle}>Today's Entries</h2>
          {entries.length === 0 ? (
            <p style={styles.emptyState}>No entries yet. Add your first meal!</p>
          ) : (
            entries.map(entry => (
              <div key={entry.id} style={styles.entry}>
                <div style={styles.entryContent}>
                  <div style={styles.entryFood}>{entry.food}</div>
                  <div style={styles.entryTime}>{entry.timestamp}</div>
                </div>
                <div style={styles.entryRight}>
                  <span style={styles.entryCalories}>{entry.calories} cal</span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={styles.deleteButton}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all entries?')) {
                setEntries([])
              }
            }}
            style={styles.clearButton}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '30px',
    textAlign: 'center'
  },
  goalSection: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  label: {
    fontSize: '16px',
    color: '#4b5563',
    fontWeight: '500'
  },
  goalInput: {
    width: '80px',
    padding: '8px',
    margin: '0 10px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    textAlign: 'center'
  },
  progressSection: {
    marginBottom: '30px'
  },
  progressBar: {
    height: '20px',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '15px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
    transition: 'width 0.3s ease'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  statItem: {
    textAlign: 'center'
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '5px'
  },
  statValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px'
  },
  input: {
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '14px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '15px'
  },
  entriesList: {
    marginTop: '30px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '30px',
    fontSize: '16px'
  },
  entry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    marginBottom: '10px'
  },
  entryContent: {
    flex: 1
  },
  entryFood: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  entryTime: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  entryRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  entryCalories: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1'
  },
  clearButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  }
}
