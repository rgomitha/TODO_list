const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Todo = require('../models/todoModels');

router.get('/', async (req, res) => {
  try {
    const tasks = await Todo.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = new Todo({
      description: req.body.description,
      completed: false,
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!req.params.id || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const updates = {};
    if (req.body.description) updates.description = req.body.description;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;
    const task = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.params.id || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const task = await Todo.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;