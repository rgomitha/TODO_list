import React, { useState } from "react";
import PropTypes from 'prop-types';

export default function TaskItem({ task, onDelete, onUpdate, darkMode, buttonColors }) {
  // Handle both task.text and task.description for compatibility
  const taskContent = task.description || task.text || '';
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(taskContent);
  
  const handleUpdate = () => {
    if (editedText.trim() !== "") {
      // Update based on which property the task has
      const updateData = task.hasOwnProperty('description') 
        ? { description: editedText } 
        : { text: editedText };
      
      onUpdate(task._id, updateData);
      setIsEditing(false);
    }
  };
  
  const handleToggleComplete = () => {
    onUpdate(task._id, { completed: !task.completed });
  };
  
  const handleCancel = () => {
    setEditedText(taskContent);
    setIsEditing(false);
  };
  
  // Dynamically set text color based on dark mode
  const textColor = darkMode ? 'white' : 'black';
  
  return (
    <li style={{
      ...styles.taskItem,
      borderBottom: darkMode ? '1px solid #444' : '1px solid #f0f0f0',
      backgroundColor: darkMode ? '#333' : '#fff'
    }}>
      {isEditing ? (
        <div style={styles.editContainer}>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            style={{
              ...styles.editInput,
              color: textColor,
              backgroundColor: darkMode ? '#444' : '#f9f9f9',
              border: darkMode ? '1px solid #555' : '1px solid #e0e0e0'
            }}
            autoFocus
          />
          <div style={styles.editActions}>
            <button 
              onClick={handleUpdate} 
              style={{
                ...styles.actionButton,
                backgroundColor: buttonColors.edit
              }}
            >
              Save
            </button>
            <button 
              onClick={handleCancel} 
              style={{
                ...styles.actionButton,
                backgroundColor: darkMode ? '#555' : '#e0e0e0',
                color: textColor
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.taskContent}>
          <div style={styles.taskMain}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              style={styles.checkbox}
            />
            <span style={{
              ...styles.taskText,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: textColor,
              opacity: task.completed ? 0.6 : 1
            }}>
              {taskContent}
            </span>
          </div>
          
          <div style={styles.taskActions}>
            <button 
              onClick={() => setIsEditing(true)} 
              style={{
                ...styles.actionButton,
                backgroundColor: buttonColors.edit,
                color: buttonColors.edit === '#ffcc00' ? 'black' : 'white' // Ensure text is visible on yellow background
              }}
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(task._id)} 
              style={{
                ...styles.actionButton,
                backgroundColor: buttonColors.delete,
                color: 'white'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    completed: PropTypes.bool,
    // Allow either text or description
    text: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  buttonColors: PropTypes.object
};

TaskItem.defaultProps = {
  darkMode: false,
  buttonColors: {
    edit: '#2196f3',
    delete: '#ff5252'
  }
};

const styles = {
  taskItem: {
    padding: '16px',
    transition: 'background-color 0.3s ease'
  },
  taskContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskMain: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginRight: '12px',
    cursor: 'pointer'
  },
  taskText: {
    fontSize: '16px',
    transition: 'opacity 0.3s ease, text-decoration 0.3s ease',
    wordBreak: 'break-word',
    flex: 1
  },
  taskActions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  editInput: {
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box'
  },
  editActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px'
  }
};