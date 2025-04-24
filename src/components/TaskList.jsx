import React, { useState, useContext } from "react";
import PropTypes from 'prop-types'; 
import TaskItem from "./TaskItem";
import { ThemeContext } from "./ThemeContext"; 

export default function TaskList({ tasks = [], onDelete, onUpdate }) {
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useContext(ThemeContext); 

  if (!Array.isArray(tasks)) {
    console.error('Expected tasks to be an array, but received:', tasks);
    return <div>Something went wrong. Please check the task data.</div>;
  }
  
  const filteredTasks = tasks.filter(task => {
    // Use description as the primary field, but fall back to text if needed
    const taskContent = task.description || task.text || '';
    const matchesSearch = taskContent.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filter === 'all') return true; 
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.length - activeTasks;

  const currentStyles = {
    ...styles,
    taskListContainer: {
      ...styles.taskListContainer,
      backgroundColor: darkMode ? '#333' : '#fff',
    },
    searchContainer: {
      ...styles.searchContainer,
      backgroundColor: darkMode ? '#444' : '#f7f5fc',
      borderBottom: darkMode ? '1px solid #555' : '1px solid #f0ecf9'
    },
    searchInput: {
      ...styles.searchInput,
      border: darkMode ? '1px solid #666' : '1px solid black',
      color: darkMode ? 'white' : 'black',
      backgroundColor: darkMode ? '#555' : '#fff'
    },
    clearSearch: {
      ...styles.clearSearch,
      color: darkMode ? '#ccc' : '#9e9e9e'
    },
    taskFilters: {
      ...styles.taskFilters,
      backgroundColor: darkMode ? '#444' : '#f7f5fc',
      borderBottom: darkMode ? '1px solid #555' : '1px solid #f0ecf9'
    },
    filterButton: {
      ...styles.filterButton,
      color: darkMode ? '#ccc' : '#666'
    },
    emptyFilteredList: {
      ...styles.emptyFilteredList,
      color: darkMode ? '#aaa' : '#9e9e9e'
    }
  };

  return (
    <div style={currentStyles.taskListContainer}>
      {/* Search Box */}
      <div style={currentStyles.searchContainer}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={currentStyles.searchInput}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            style={currentStyles.clearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div style={currentStyles.taskFilters}>
        <button
          style={{
            ...currentStyles.filterButton,
            ...(filter === 'all' ? styles.activeButton : {})
          }}
          onClick={() => setFilter('all')}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          style={{
            ...currentStyles.filterButton,
            ...(filter === 'active' ? styles.activeButton : {})
          }}
          onClick={() => setFilter('active')}
        >
          Pending ({activeTasks})
        </button>
        <button
          style={{
            ...currentStyles.filterButton,
            ...(filter === 'completed' ? styles.activeButton : {})
          }}
          onClick={() => setFilter('completed')}
        >
          Finished ({completedTasks})
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div style={currentStyles.emptyFilteredList}>
          {searchTerm 
            ? `No ${filter !== 'all' ? filter : ''} tasks found matching "${searchTerm}"`
            : filter === 'all'
              ? 'No tasks yet'
              : filter === 'active'
                ? 'No active tasks'
                : 'No completed tasks'}
        </div>
      ) : (
        <ul style={styles.taskList}>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={onDelete}
              onUpdate={onUpdate}
              darkMode={darkMode}
              buttonColors={{
                edit: darkMode ? '#ffcc00' : '#2196f3', // Yellow in dark mode, Blue in light mode
                delete: '#ff5252' // Red in both modes
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.array,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func
};

TaskList.defaultProps = {
  tasks: [],
  onDelete: () => {},
  onUpdate: () => {}
};

const styles = {
  taskListContainer: {
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    animation: 'slideIn 0.4s ease'
  },
  searchContainer: {
    position: 'relative',
    padding: '16px',
    borderBottom: '1px solid #f0ecf9'
  },
  searchInput: {
    width: '100%',
    padding: '12px 40px 12px 16px',
    borderRadius: '30px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box'
  },
  clearSearch: {
    position: 'absolute',
    right: '28px',
    top: '28px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%'
  },
  taskFilters: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px'
  },
  filterButton: {
    backgroundColor: 'transparent',  
    border: 'none',
    padding: '10px 18px',
    margin: '0 6px',
    cursor: 'pointer',
    borderRadius: '30px',
    fontWeight: 600,
    fontSize: '15px',
    transition: 'all 0.3s ease'
  },
  activeButton: {
    backgroundColor: '#7e57c2',
    color: 'white',
    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.25)'
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '60vh',
    overflowY: 'auto'
  },
  emptyFilteredList: {
    padding: '40px 20px',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: '1.1rem'
  }
};