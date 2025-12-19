import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState({ type: '', msg: '' })

  const API_URL = import.meta.env.VITE_API_URL || 'http://backend:5000'

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', msg: 'Saving...' })
    try {
      const response = await fetch(`${API_URL}/api/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      if (response.ok) {
        setStatus({ type: 'success', msg: 'Saved successfully!' })
        setText('')
        fetchMessages()
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000)
      } else {
        setStatus({ type: 'error', msg: data.error || 'Error saving' })
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Network error' })
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchMessages()
      } else {
        console.error('Failed to delete')
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  return (
    <div className="app-container">
      <div className="content-card">
        <header className="card-header">
          <h1>Todo App</h1>
          <p>Submit your text to the database</p>
        </header>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something here..."
              required
              className="text-input"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Saving...' : 'Submit'}
          </button>
        </form>

        {status.msg && (
          <div className={`status-message ${status.type}`}>
            {status.msg}
          </div>
        )}

        <div className="messages-section">
          <h2>Submitted Texts</h2>
          {messages.length === 0 ? (
            <p className="empty-state">No items yet. Add one above!</p>
          ) : (
            <ul className="messages-list">
              {messages.map((msg) => (
                <li key={msg.id} className="message-item">
                  <span className="message-text">{msg.text}</span>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="delete-btn"
                    aria-label="Delete item"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
