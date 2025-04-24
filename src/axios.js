import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/todos/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTodos = async () => {
  try {
    const response = await axiosInstance.get('');
    return response.data;
  } catch (err) {
    console.error('Error fetching todos:', err.message, err.response?.data || err.config);
    throw err;
  }
};

export const createTodo = async (descriptionOrTask) => {
  // Handle both string and object input formats
  const description = typeof descriptionOrTask === 'string' 
    ? descriptionOrTask 
    : (descriptionOrTask.description || descriptionOrTask.text);
  
  if (!description || typeof description !== 'string') {
    throw new Error('Todo description is required and must be a string');
  }
  
  try {
    const response = await axiosInstance.post('/', { description });
    return response.data;
  } catch (err) {
    console.error('Error creating todo:', err.message, err.response?.data || err.config);
    throw err;
  }
};

export const updateTodo = async (id, updateData) => {
  if (!id) {
    throw new Error('Todo ID is required');
  }
  
  try {
    const response = await axiosInstance.put(`/${id}`, updateData);
    return response.data;
  } catch (err) {
    console.error(`Error updating todo ${id}:`, err.message, err.response?.data || err.config);
    throw err;
  }
};

export const deleteTodo = async (id) => {
  if (!id) {
    throw new Error('Todo ID is required');
  }
  
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Error deleting todo ${id}:`, err.message, err.response?.data || err.config);
    throw err;
  }
};

// Export all services
const todoService = {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  axiosInstance
};

export default todoService;