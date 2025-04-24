import React, { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { ThemeContext } from './components/ThemeContext';
import todoService from './axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Using fetchTodos instead of fetchTodo
      const data = await todoService.fetchTodos();
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
      setInitialized(true);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      // Enhanced error handling for network issues
      if (err.code === 'ERR_NETWORK') {
        setError("Network error: Request blocked by browser. Disable ad blockers or check server status.");
      } else if (err.response && err.response.status === 404) {
        setTasks([]);
        setInitialized(true);
      } else {
        setError("Failed to load tasks. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      // Map text property to description for API compatibility
      const description = task.text || task.description;
      const response = await todoService.createTodo(description);
      return response;
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      // Using todoService.updateTodo
      const response = await todoService.updateTodo(id, updates);
      return response;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      // Using todoService.deleteTodo
      const response = await todoService.deleteTodo(id);
      return response;
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const handleAdd = async (task) => {
    try {
      const newTask = await addTask(task);
      setTasks([...tasks, newTask]);
      return true;
    } catch (err) {
      setError("Failed to add task. Please try again.");
      return false;
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      return true;
    } catch (err) {
      setError("Failed to update task. Please try again.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const buttonColors = {
    edit: darkMode ? '#ffcc00' : '#2196f3',
    delete: '#ff5252'
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme: () => setDarkMode(!darkMode) }}>
      <div className={`app-container ${darkMode ? 'dark-mode-container' : ''}`}>
        <div className="app-header">
          <h1 className={`heading ${darkMode ? 'dark-mode-heading' : ''}`}>TODO-Website</h1>
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="dismiss-error">✕</button>
          </div>
        )}

        <TaskForm onAdd={handleAdd} darkMode={darkMode} />

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className={darkMode ? 'dark-text' : ''}>Loading your tasks...</p>
          </div>
        ) : initialized && tasks.length === 0 ? (
          <div className={`empty-list ${darkMode ? 'dark-empty-list' : ''}`}>
            <p>🎉 Your task list is empty! Add a new task to get started.</p>
          </div>
        ) : (
          <TaskList 
            tasks={tasks} 
            onDelete={handleDelete} 
            onUpdate={handleUpdate} 
            darkMode={darkMode}
            buttonColors={buttonColors}
          />
        )}

        <div className={`app-footer ${darkMode ? 'dark-mode-footer' : ''}`}>
          <p>Built with MERN by Abinesh❤️ | Crush Your Task List 💥</p>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;