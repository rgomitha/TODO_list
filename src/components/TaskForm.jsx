import React, { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    const success = await onAdd({ text, completed: false });

    if (success) {
      setText("");
    }
    setIsSubmitting(false);
  };

  const isButtonDisabled = isSubmitting || !text.trim();

  return (
    <form style={styles.taskForm} onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="✏️ Add new task..."
        disabled={isSubmitting}
        style={styles.input}
        aria-label="Task input"
      />
      <button
        type="submit"
        disabled={isButtonDisabled}
        style={{
          ...styles.button,
          ...(isButtonDisabled ? styles.disabledButton : styles.enabledButton)
        }}
      >
        {isSubmitting ? '⏳ Adding...' : '✚ Add Task'}
      </button>
    </form>
  );
}

const styles = {
  taskForm: {
    display: 'flex',
    marginBottom: '25px',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  button: {
    padding: '14px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  enabledButton: {
    backgroundColor: '#7e57c2',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.2)',
  },
  disabledButton: {
    backgroundColor: '#bbb',
    color: '#fff',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};
